const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");

module.exports = {
  mode: "production",

  // 入口文件
  entry: "./src/main.js",

  // 构建输出
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bilibanner.js",
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
      // 处理 JS（转译 ES6+）
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

  // 禁止代码分割：所有动态import都内联到主bundle
  optimization: {
    splitChunks: false,
  },
};
