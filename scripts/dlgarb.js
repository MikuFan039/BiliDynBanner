const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const https = require("https");
const http = require("http");

// 解析命令行参数
const args = process.argv.slice(2);
let targetName = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--name" && args[i + 1]) {
    targetName = args[i + 1];
    i++;
  }
}

/**
 * 下载文件
 * @param {string} url 文件URL
 * @param {string} destPath 保存路径（包含文件名）
 * @returns {Promise<void>}
 */
async function downloadFile(url, destPath) {
  const protocol = url.startsWith("https") ? https : http;
  return new Promise((resolve, reject) => {
    protocol
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`下载失败 ${url}: ${response.statusCode}`));
          return;
        }
        const fileStream = fs.createWriteStream(destPath);
        response.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });
        fileStream.on("error", reject);
      })
      .on("error", reject);
  });
}

/**
 * 从 URL 中提取保存路径
 * @param {string} url 资源URL，如 https://i0.hdslb.com/bfs/vc/xxx.png
 * @returns {{folder: string, filename: string}} 子文件夹名和文件名
 */
function extractPathFromUrl(url) {
  const relativePath = url.replace(/^https?:\/\/i0\.hdslb\.com\/bfs\//, "");
  const parts = relativePath.split("/");
  const folder = parts[0];
  const filename = parts.slice(1).join("/");
  return { folder, filename };
}

/**
 * 递归处理 split_layer 中的资源链接，收集下载任务并修改 src
 * @param {object} layersObj split_layer 解析后的对象
 * @param {Set} downloadTasks 收集下载任务的 Set
 * @returns {object} 处理后的 layers 对象
 */
function processLayers(layersObj, downloadTasks) {
  if (!layersObj.layers) return layersObj;

  for (const layer of layersObj.layers) {
    if (layer.resources && Array.isArray(layer.resources)) {
      for (const resource of layer.resources) {
        const src = resource.src;
        if (src && src.startsWith("https://i0.hdslb.com/bfs/")) {
          downloadTasks.add(src);
          const { folder, filename } = extractPathFromUrl(src);
          resource.src = path.join(folder, filename).replace(/\\/g, "/");
        }
      }
    }
  }
  return layersObj;
}

/**
 * 处理单个 URL 字段（如 litpic, pic）
 * @param {string} url 原始 URL
 * @param {Set} downloadTasks 收集下载任务的 Set
 * @returns {string|null} 处理后的相对路径，若无有效 URL 则返回 null
 */
function processSingleUrl(url, downloadTasks) {
  if (!url || typeof url !== "string") return null;
  if (
    url.startsWith("https://i0.hdslb.com/bfs/") ||
    url.startsWith("http://i0.hdslb.com/bfs/")
  ) {
    downloadTasks.add(url);
    const { folder, filename } = extractPathFromUrl(url);
    return path.join(folder, filename).replace(/\\/g, "/");
  }
  return url; // 非标准 BFS 链接保持原样（但本例中应都是 BFS 链接）
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log("正在获取 banner 元数据...");

    // 1. 获取 API 数据
    const apiUrl =
      "https://api.bilibili.com/x/web-show/page/header/v2?resource_id=142";
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }
    const data = await response.json();

    if (data.code !== 0) {
      throw new Error(`API 返回错误: ${data.message}`);
    }

    const dataId = data.data.id;
    console.log(`已获取 banner 元数据，data.id: ${dataId}`);

    // 2. 确定输出目录名
    let folderName;
    if (targetName) {
      folderName = targetName;
    } else {
      // 默认：data.id + 当前日期 YYYYMMDD
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
      folderName = `${dataId}_${dateStr}`;
      console.log(`未指定 banner 名称，使用默认: ${folderName}`);
    }

    const rootDir = path.join(__dirname, ".."); // 项目根目录
    const baseDir = path.join(rootDir, "public", folderName); // 最终保存位置
    console.log(`保存目录: ${baseDir}`);

    // 创建主目录
    await fsPromises.mkdir(baseDir, { recursive: true });

    // 3. 处理 split_layer 中的资源
    let splitLayerObj;
    try {
      splitLayerObj = JSON.parse(data.data.split_layer);
    } catch (e) {
      throw new Error(`解析 split_layer 失败: ${e.message}`);
    }

    const downloadTasks = new Set();
    const processedLayers = processLayers(splitLayerObj, downloadTasks);
    data.data.split_layer = JSON.stringify(processedLayers);

    // 4. 处理 litpic 和 pic 字段
    if (data.data.litpic) {
      const newLitpic = processSingleUrl(data.data.litpic, downloadTasks);
      if (newLitpic) data.data.litpic = newLitpic;
    }
    if (data.data.pic) {
      const newPic = processSingleUrl(data.data.pic, downloadTasks);
      if (newPic) data.data.pic = newPic;
    }

    console.log(`发现 ${downloadTasks.size} 个资源`);

    // 5. 创建所有需要的子目录
    const foldersNeeded = new Set();
    for (const url of downloadTasks) {
      const { folder } = extractPathFromUrl(url);
      foldersNeeded.add(folder);
    }
    for (const folder of foldersNeeded) {
      const folderPath = path.join(baseDir, folder);
      await fsPromises.mkdir(folderPath, { recursive: true });
    }

    // 6. 并发下载资源
    let downloaded = 0;
    const concurrency = 5;
    const urls = Array.from(downloadTasks);
    const queue = [...urls];

    async function worker() {
      while (queue.length) {
        const url = queue.shift();
        if (!url) break;

        const { folder, filename } = extractPathFromUrl(url);
        const destPath = path.join(baseDir, folder, filename);

        try {
          await fsPromises.access(destPath);
          console.log(`跳过已存在: ${destPath}`);
          downloaded++;
        } catch {
          console.log(`正在下载: ${url}`);
          await downloadFile(url, destPath);
          downloaded++;
          console.log(`下载完毕: ${destPath}`);
        }
      }
    }

    const workers = Array(Math.min(concurrency, urls.length))
      .fill()
      .map(() => worker());
    await Promise.all(workers);

    console.log(`全部资源下载完毕，共 ${downloaded} 个资源`);

    // 7. 保存 manifest.json
    const manifestPath = path.join(baseDir, "manifest.json");
    await fsPromises.writeFile(
      manifestPath,
      JSON.stringify(data, null, 2),
      "utf8"
    );
    console.log(`已保存 manifest 到 ${manifestPath}`);

    // 8. 同步到 latest 目录
    const latestDir = path.join(rootDir, "public", "latest");
    console.log(`准备同步到 latest 目录: ${latestDir}`);

    // 删除 latest 目录下所有内容（保留目录本身）
    try {
      await fsPromises.rm(latestDir, { recursive: true, force: true });
    } catch (err) {
      // 如果目录不存在，忽略错误
      if (err.code !== "ENOENT") throw err;
    }
    // 重新创建 latest 目录
    await fsPromises.mkdir(latestDir, { recursive: true });

    // 将新下载的目录内容复制到 latest
    await fsPromises.cp(baseDir, latestDir, { recursive: true });
    console.log(`已同步到 latest 目录`);

    console.log(`全部完成，输出目录: ${baseDir}`);
  } catch (error) {
    console.error("发生错误:", error.message);
    process.exit(1);
  }
}

main();
