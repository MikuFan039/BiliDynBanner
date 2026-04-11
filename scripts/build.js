const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");

// 项目根目录（ `scripts/` 的父级）
const rootDir = path.join(__dirname, "..");

// 过滤函数：排除 .md 文件
const excludeMd = (src) => {
  // src 是文件或目录的完整路径
  return !src.endsWith(".md");
};

async function run() {
  try {
    console.log("构建`bilibanner.js`中...");
    // 执行 webpack 命令，等待完成
    await new Promise((resolve, reject) => {
      exec(
        "webpack --config webpack.config.js",
        { cwd: rootDir },
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          if (stdout) console.log(stdout);
          if (stderr) console.error(stderr);
          resolve();
        }
      );
    });

    // 复制 `src/gallery/*` 到 `dist/*`（排除 .md）
    console.log("复制展示页面中...");
    const gallerySrc = path.join(rootDir, "src", "gallery");
    const galleryDest = path.join(rootDir, "dist");
    await fs.mkdir(galleryDest, { recursive: true });
    await fs.cp(gallerySrc, galleryDest, {
      recursive: true,
      filter: excludeMd,
    });

    // 复制 `public/*` 到 `dist/res/bilibanner/*`（排除 .md）
    console.log("复制Banner元数据中...");
    const resSrc = path.join(rootDir, "public");
    const resDest = path.join(rootDir, "dist", "res", "bilibanner");
    await fs.mkdir(resDest, { recursive: true });
    await fs.cp(resSrc, resDest, { recursive: true, filter: excludeMd });

    console.log("全部完毕");
  } catch (err) {
    console.error("发生错误：", err);
    process.exit(1);
  }
}
run();
