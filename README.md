# BiliBanner

Bilibili 动态视差 Banner 独立组件，基于 Vue2 + Webpack 构建。

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
    // 方法一：传 id → 自动拼接为 http://host/res/bilibanner/2022spring/manifest.json
    BiliBanner.init('2022spring')

    // 方法二：传完整 URL（两种方式并存互不影响）
    // BiliBanner.init('https://api.bilibili.com/x/web-show/res/frontpage?resid=142')
  </script>
```

## 接口说明

`BiliBanner.init(apiUrl)` 接受一个参数：

| 参数     | 类型   | 说明                                                         |
|--------|------|--------------------------------------------------------------|
| apiUrl | String | banner JSON 数据接口地址，即原项目中的 `https://api.bilibili.com/x/web-show/res/frontpage?resid=142` |

接口返回数据格式（`data` 字段）应包含：

| 字段            | 说明                        |
|---------------|---------------------------|
| `litpic`      | 静态背景图 URL                 |
| `is_split_layer` | 是否启用动态分层（`1` 表示启用）        |
| `split_layer`  | 动态 banner 配置 JSON 字符串     |

## 项目结构

```
bilibanner/
├── src/
│   ├── main.js                  # 入口，挂载 Vue 实例
│   └── components/
│       ├── Banner.vue           # 主 banner 组件（最小化修改自原项目）
│       └── animated-banner/     # 动态视差 banner（完整保留，未作修改）
│           ├── index.vue
│           ├── cubicBezier.js
│           ├── utils.js
│           └── extensions/
│               ├── snow.js      # 雪花粒子扩展
│               └── particle/    # 粒子特效扩展（WebGL）
├── webpack.config.js
├── package.json
├── .babelrc
└── index.html                    # 使用示例
```
