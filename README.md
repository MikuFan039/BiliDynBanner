# BiliBanner

Bilibili 动态视差 Banner 独立组件，基于 Vue2 + Webpack 构建。

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 构建

```bash
npm run build
```

构建完成后，`dist/bilibanner.js` 即为可嵌入任意页面的独立脚本。

### 3. 嵌入页面

```html
<!-- 挂载点 -->
<div id="bili-banner"></div>

<!-- 引入构建产物 -->
<script src="dist/bilibanner.js"></script>

<!-- 初始化：传入 banner 数据接口 URL -->
  <script>
    // 方法一：传 id → 自动拼接为 http://{host}/res/bilibanner/2021spring/manifest.json
    BiliBanner.init('2021spring')

    // 方法二：传完整 URL（两种方式并存互不影响）
    // BiliBanner.init('https://api.bilibili.com/x/web-show/page/header/v2?resource_id=142')
  </script>
```

---

## 其他说明

### 1. `BiliBanner.init()` 接受两种参数：

|参数|类型|说明|
|--|--|--|
|ID|string|指定的 banner ID<br>例：当ID为`2021spring`时自动从`http://{host}/res/bilibanner/2021spring/manifest.json`加载|
|Url| String |banner JSON Url<br>例：`https://api.bilibili.com/x/web-show/page/header/v2?resource_id=142`|

\* 当输入的Url有误或ID有误（或未指定ID、Url参数），将自动加载ID为`latest`的banner。

### 2. Banner元数据获取：

1. 可从哔哩哔哩获取

```
https://api.bilibili.com/x/web-show/page/header/v2?resource_id=142
```

2. 历史数据可从release页面下载