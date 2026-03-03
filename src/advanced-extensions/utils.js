/**
 * 高级扩展公共工具函数
 */

/**
 * 动态加载外部脚本，返回 Promise，脚本执行完成后 resolve。
 * @param {string} src - 脚本 URL
 * @returns {Promise<void>}
 */
export const loadScript = (src) => {
  const script = document.createElement("script");
  script.src = src;
  script.crossOrigin = "anonymous";
  document.body.appendChild(script);
  return new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = () => reject(new Error(`脚本加载失败: ${src}`));
  });
};

/**
 * 插入 <base> 标签，将页面的相对路径解析基准临时切换到指定 URL。
 *
 * 原理：
 *   浏览器解析相对路径时，优先以 <base href> 为基准，而非页面 URL。
 *   插入后，页面内所有运行时的相对路径请求（fetch / XHR /
 *   new URL(relative, document.baseURI)）都以该目录为起点解析。
 *
 *   注意：同一时刻只能有一个 <base> 生效。
 *   调用 removeBase() 可在合适时机（如扩展退出后）还原。
 *
 * @param {string} baseUrl - 目标 base URL，通常为 manifest 所在目录（末尾含 /）
 * @returns {HTMLBaseElement} 插入的 <base> 元素，用于后续移除
 */
export const insertBase = (baseUrl) => {
  const baseEl = document.createElement("base");
  baseEl.href = baseUrl;
  document.head.appendChild(baseEl);
  return baseEl;
};

/**
 * 在指定 base URL 下加载脚本。
 * 脚本加载完成后 <base> 仍然保留，因为脚本内的资源请求发生在运行时（点击后），
 * 而非脚本下载阶段。调用方应在扩展生命周期结束时手动调用 baseEl.remove()。
 *
 * @param {string}          src    - 脚本 URL
 * @param {HTMLBaseElement} baseEl - 由 insertBase() 返回的 <base> 元素
 * @returns {Promise<void>}
 */
export const loadScriptWithBase = (src, baseEl) => {
  return loadScript(src);
};

/**
 * GPU 性能检测（封装 detect-gpu）
 * @param {string} benchmarksURL
 * @returns {Promise<{tier: number, type: string}>}
 */
export const detectGpu = async (benchmarksURL) => {
  try {
    const { getGPUTier } = await import("detect-gpu");
    return await getGPUTier({ benchmarksURL });
  } catch {
    return { tier: 0, type: "FALLBACK" };
  }
};
