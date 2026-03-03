/**
 * 高级扩展注册表
 *
 * 每个扩展模块需导出：
 *   {
 *     config: { ... },                                               // 默认配置
 *     init(container, taperLine, extConfig, resolveUrl, activeUrl),  // 初始化函数
 *   }
 *
 * 新增扩展时只需：
 *   1. 在 src/advanced-extensions/ 下新建对应模块文件
 *   2. 在此处 import 并注册一行
 */

import springGame2022 from "./springGame2022.js";
import summer2022 from "./summer2022.js";
import autumn2022 from "./autumn2022.js";

const ADVANCED_EXTENSIONS = {
  springGame2022,
  summer2022,
  autumn2022,
};

export default ADVANCED_EXTENSIONS;
