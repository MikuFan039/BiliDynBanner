import Vue from "vue";
import Banner from "./components/Banner.vue";

/**
 * BASE_URL：资源根路径
 * LATEST_URL：默认/fallback路径
 */
const BASE_URL = "//localhost/res/bilibanner";
const LATEST_URL = `${BASE_URL}/latest/manifest.json`;

/**
 * 将 id 或完整 URL 转换为 manifest 请求地址。
 * 未传参时直接返回 LATEST_URL。
 * @param {string} [idOrUrl]
 */
const toApiUrl = (idOrUrl) => {
  if (!idOrUrl) return LATEST_URL;
  const isUrl = /^(https?:)?\/\//.test(idOrUrl);
  return isUrl ? idOrUrl : `${BASE_URL}/${idOrUrl}/manifest.json`;
};

/**
 * 挂载 Vue 实例到 #bili-banner
 * @param {string} apiUrl      - 主请求地址
 * @param {string} fallbackUrl - 主请求失败时的备用地址
 */
function mount(apiUrl, fallbackUrl) {
  const el = document.getElementById("bili-banner");
  if (!el) {
    console.error("[BiliBanner] 找不到 #bili-banner 挂载点");
    return;
  }
  new Vue({
    render: (h) => h(Banner, { props: { apiUrl, fallbackUrl } }),
  }).$mount(el);
}

/**
 * 初始化 BiliBanner
 *
 * 两种用法：
 *   1. 传入 id：
 *        BiliBanner.init('2022spring')
 *        → 请求 {BASE_URL}/2022spring/manifest.json
 *
 *   2. 传入 URL：
 *        BiliBanner.init('https://api.bilibili.com/x/web-show/res/frontpage?resid=142')
 *        → 加载该 URL
 *
 *    3. 未传参或参数有误：
 *        BiliBanner.init()
 *        → 加载 fallback
 * @param {string} [idOrUrl] - banner id 或完整接口 URL，不传则直接加载 latest
 */
function initBiliBanner(idOrUrl) {
  const apiUrl = toApiUrl(idOrUrl);
  // 若主 URL 本身就是 latest，则无需 fallback（传 null Banner.vue 内会跳过）
  const fallbackUrl = apiUrl === LATEST_URL ? null : LATEST_URL;
  mount(apiUrl, fallbackUrl);
}

// 挂载到全局
window.BiliBanner = {
  init: initBiliBanner,
};
