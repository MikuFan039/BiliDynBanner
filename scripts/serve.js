const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;
const ROOT = path.join(__dirname, "../dist");

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// 尝试读取文件，如果失败则调用 fallback 回调
function serveFile(filePath, res, fallback) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        fallback(); // 文件不存在，交给 fallback 处理
      } else {
        res.writeHead(500);
        res.end("500 Internal Server Error");
      }
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
    });
    res.end(data);
  });
}

http
  .createServer((req, res) => {
    // 去除查询参数，处理默认首页
    let urlPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    let filePath = path.join(ROOT, urlPath);

    // 先尝试直接读取
    serveFile(filePath, res, () => {
      // 如果直接读取失败且路径不以 .html 结尾，则尝试追加 .html
      if (!urlPath.endsWith(".html")) {
        const htmlFilePath = filePath + ".html";
        serveFile(htmlFilePath, res, () => {
          // 还是失败，返回 404
          res.writeHead(404);
          res.end("404 Not Found: " + urlPath);
        });
      } else {
        // 已经是 .html 结尾但仍找不到，直接 404
        res.writeHead(404);
        res.end("404 Not Found: " + urlPath);
      }
    });
  })
  .listen(PORT, () => {
    console.log(`浏览器打开 http://localhost:${PORT}`);
  });
