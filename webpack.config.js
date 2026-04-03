const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  // Build Target ES6（ES2015）
  // target 控制 webpack runtime 自身的语法级别（chunk 加载、__webpack_require__ 等）
  // 与 babel targets 共同保证整个产物输出 ES2015
  mode: "production",
  target: ["web", "es2015"],

  // 生成 SourceMap
  devtool: "source-map",

  // 入口文件
  entry: "./src/main.js",

  // 构建输出
  output: {
    path: path.resolve(__dirname, "dist/res/js"),
    filename: "bilibanner.js",
    // webpack runtime 使用 ES2015 箭头函数 / const 等，与 target 对齐
    environment: {
      arrowFunction: true,
      const: true,
      destructuring: true,
      forOf: true,
      templateLiteral: true,
    },
  },

  resolve: {
    extensions: [".js", ".vue"],
  },

  module: {
    rules: [
      // 处理 .vue 单文件组件
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      // 处理 JS（转译高于 ES2015 的语法，如 async/await → Promise 链）
      // node_modules 中直接发布 ES5 dist 的包（axios、vue、core-js）无需转译，
      // 若引入了发布 ESM 源码的包则需从 exclude 中移除对应包名
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      // 处理 Less 样式（scoped 样式由 vue-loader 自动注入）
      {
        test: /\.less$/,
        use: ["vue-style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      // 处理图片资源（如 snowflake.png），base64 内联，避免额外文件依赖
      {
        test: /\.(png|jpg|gif|svg|webp)$/,
        type: "asset/inline", // webpack5：统一转 base64
      },
    ],
  },

  plugins: [
    new VueLoaderPlugin(),
    // 限制 chunk 数量为 1，强制所有动态import内联进主文件
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],

  optimization: {
    // 禁止代码分割：所有动态import都内联到主bundle
    splitChunks: false,
    // Terser 默认输出 ES5；显式指定 ecma: 2015，与 target 保持一致，
    // 使压缩后的产物同样保留箭头函数、const、模板字符串等 ES6 语法
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 2015,
          compress: { ecma: 2015 },
          output: { ecma: 2015 },
        },
      }),
    ],
  },
};
