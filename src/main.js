import Vue from "vue";
import Banner from "./components/Banner.vue";

// 资源根路径，修改此处后重新构建即可
const BASE_URL = "http://localhost/res/bilibanner";
// latest 的完整 URL，作为所有情况的最终 fallback
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
// 追踪当前挂载的实例
let currentVm = null;
let currentRoot = null;

function mount(apiUrl, fallbackUrl) {
  // 1. 销毁旧实例
  if (currentVm) {
    currentVm.$destroy();
    currentVm = null;
  }

  // 2. 用新占位 div 原地替换旧根节点，位置不变
  if (currentRoot && currentRoot.parentNode) {
    const placeholder = document.createElement("div");
    placeholder.id = "bili-banner";
    currentRoot.parentNode.replaceChild(placeholder, currentRoot);
    currentRoot = null;
  }

  // 3. 取占位 div
  const el = document.getElementById("bili-banner");
  if (!el) {
    console.error("[BiliBanner] 找不到 #bili-banner 挂载点");
    return;
  }

  // 4. 挂载并记录根节点
  currentVm = new Vue({
    render: (h) => h(Banner, { props: { apiUrl, fallbackUrl } }),
  }).$mount(el);
  currentRoot = currentVm.$el;
}

/**
 * 初始化 BiliBanner
 *
 * 用法：
 *   BiliBanner.init()                    → 直接加载 latest
 *   BiliBanner.init('2022spring')        → 加载 2022spring，失败则 fallback 到 latest
 *   BiliBanner.init('https://example.com/manifest.json')
 *                                        → 加载指定 URL，失败则 fallback 到 latest
 *
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
  destroy() {
    if (currentVm) {
      currentVm.$destroy();
      currentVm = null;
      currentRoot = null;
    }
  },
};
