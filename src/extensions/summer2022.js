/**
 * 高级扩展：summer2022
 *
 * <base href> 生命周期：
 *   阶段一（脚本加载）：loadScript 前插入，脚本执行完毕后立即移除
 *   阶段二（扩展运行）：点击展开时插入，onExit 触发时移除
 */

import { loadScript, insertBase, detectGpu } from "./utils.js";

export default {
  config: {
    script: "rmt7XCXYp9.js",
    globalName: "summer2022",
    benchmarksURL: "blackboard/static/00979505aec5edd6e5c2f8c096fa0f62",
    transition: 0.6,
    skipGpuCheck: false,
  },

  async init(container, taperLine, extConfig, resolveUrl, activeUrl) {
    const scriptUrl = resolveUrl(extConfig.script, activeUrl);
    const benchmarksURL = resolveUrl(extConfig.benchmarksURL, activeUrl);
    const baseUrl = activeUrl.substring(0, activeUrl.lastIndexOf("/") + 1);
    const transitionDuration = extConfig.transition ?? 0.6;

    // ── 环境检测 ──────────────────────────────────────────────────────────────
    const supportWebGL2 = !!document
      .createElement("canvas")
      .getContext("webgl2");
    const supportShadow = !!document.createElement("div").attachShadow;
    const supportMemory = !(
      navigator.deviceMemory && navigator.deviceMemory < 4
    );
    const supportNetwork = !["slow-2g", "2g"].includes(
      navigator.connection?.effectiveType
    );
    const notSafari = !/^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );
    if (
      !(
        supportWebGL2 &&
        supportShadow &&
        supportMemory &&
        supportNetwork &&
        notSafari
      )
    )
      return;

    if (!extConfig.skipGpuCheck) {
      const gpu = await detectGpu(benchmarksURL);
      if (gpu.tier < 2 || gpu.type === "FALLBACK") {
        console.warn("[summer2022] GPU 性能不足，跳过加载", gpu);
        return;
      }
    }

    // ── 高级扩展容器 ──────────────────────────────────────────────────────────────
    // 响应式高度：展开状态下同步调整 container 尺寸（对齐原始逻辑）
    let isExpanded = false;
    let transitionTimer = NaN;

    const extContainer = document.createElement("div");
    extContainer.classList.add("summer-banner");
    Object.assign(extContainer.style, {
      position: "absolute",
      top: "75%",
      transform: "translate(-50%, -50%)",
      left: "50%",
      width: "100%",
      minWidth: "1654px",
      transition: `top ${transitionDuration}s linear`,
    });

    let heightRafId = NaN;
    const syncHeight = () => {
      cancelAnimationFrame(heightRafId);
      heightRafId = requestAnimationFrame(() => {
        const height = Math.max(extContainer.clientWidth * 0.1875, 155);
        extContainer.style.height = `${height}px`;
        if (isExpanded) {
          container.style.height = `${height}px`;
          container.style.maxHeight = `${height}px`;
        }
      });
    };
    syncHeight();
    window.addEventListener("resize", syncHeight);

    container.style.overflow = "hidden";
    container.style.transition = `height ${transitionDuration}s linear`;
    container.insertBefore(extContainer, taperLine);

    // 高级扩展 JS 内部通过 document.querySelector(".bili-header__banner") 查找 container
    // 来挂载 closeButton 和 closeIcon，如果找不到这个 class 两者都不会被插入 DOM
    container.classList.add("bili-header__banner");

    // ── 相关 DOM 引用 ─────────────────────────────────────────────────────────
    // 展开/收起时需要隐藏/恢复这些元素（对齐原始代码的隐藏目标）
    const bannerInner = container.querySelector(".header-banner__inner");
    const headerBar =
      container.parentElement?.querySelector(".bili-header__bar");

    // ── 阶段一：脚本加载 + 初始化，整个过程保持 <base> 存在 ─────────────────
    // initFn 内部会发出资源请求，必须在 <base> 存在期间完成，不能仅覆盖 loadScript
    let extInstance = null;
    {
      const loadingBase = insertBase(baseUrl);
      try {
        await loadScript(scriptUrl);
        extInstance = await window[extConfig.globalName](extContainer);
      } catch (err) {
        console.error("[summer2022] 初始化失败", err);
        return;
      } finally {
        loadingBase.remove();
      }
    }

    // ── 修复高级扩展 JS 中的 MIME 类型拼写错误 ──────────────────────────────────
    // 高级扩展源码中叉号图片的 src 写成了 "data:img/png;base64,..."
    // 正确应为 "data:image/png;base64,..."，浏览器无法识别前者导致图片不显示
    const fixDataImgMime = (root) => {
      root.querySelectorAll("img").forEach((img) => {
        if (img.src.startsWith("data:img/")) {
          img.src = img.src.replace(/^data:img\//, "data:image/");
        }
      });
    };

    // 立即修复已存在的元素（container + extContainer 子树）
    const fixAll = () => {
      fixDataImgMime(container);
      fixDataImgMime(extContainer);
    };
    fixAll();

    // 高级扩展 JS 把 closeIcon/closeButton 直接 append 到 container（.bili-header__banner）
    // 所以需要 observe container 而非 extContainer
    const mimeObserver = new MutationObserver(() => fixAll());
    mimeObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    // ── 点击热区 ──────────────────────────────────────────────────────────────
    const clickZone = document.createElement("div");
    Object.assign(clickZone.style, {
      position: "absolute",
      top: "36%",
      left: "15%",
      width: "85%",
      height: "64%",
      cursor: "pointer",
    });
    container.appendChild(clickZone);

    // 收起时的 container 高度快照，退出后用于还原
    const collapsedHeight = container.clientHeight;
    let runtimeBase = null; // 阶段二的 <base>，展开时创建，退出时销毁

    clickZone.addEventListener("click", (clickEvent) => {
      if (
        isExpanded ||
        clickEvent
          .composedPath()
          .some(
            (el) =>
              el.classList?.contains("summer-banner") ||
              el.classList?.contains("inner-logo")
          )
      )
        return;

      isExpanded = true;
      container.dispatchEvent(
        new CustomEvent("banner-expand", { detail: true })
      );

      // 隐藏 banner 内部元素和顶部导航栏
      clickZone.style.setProperty("display", "none");
      bannerInner?.style.setProperty("display", "none");
      taperLine.style.setProperty("display", "none");
      headerBar?.style.setProperty("display", "none");

      const expandHeight = container.clientWidth * (3 / 16);
      Object.assign(container.style, {
        height: expandHeight + "px",
        maxHeight: expandHeight + "px",
      });
      extContainer.style.top = "50%";

      // 阶段二：展开前插入 <base>，使高级扩展运行期间的资源请求路径正确解析
      runtimeBase = insertBase(baseUrl);

      // 过渡动画结束后才触发高级扩展进入全屏模式，并注册退出回调
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => {
        extInstance.toggleExtend?.(true);

        // onExit 在 toggleExtend 之后注册，确保高级扩展已进入运行状态
        extInstance.onExit = () => {
          isExpanded = false;
          container.dispatchEvent(
            new CustomEvent("banner-expand", { detail: false })
          );

          // 阶段二：高级扩展退出时移除 <base>，断开 MIME 修复 observer
          runtimeBase?.remove();
          runtimeBase = null;
          mimeObserver.disconnect();

          container.style.height = collapsedHeight + "px";
          extContainer.style.top = "80%"; // 退出后滑到 80%，不回到初始的 75%

          window.clearTimeout(transitionTimer);
          transitionTimer = window.setTimeout(() => {
            clickZone.style.removeProperty("display");
            bannerInner?.style.removeProperty("display");
            taperLine.style.removeProperty("display");
            headerBar?.style.removeProperty("display");
            container.style.maxHeight = "240px";
          }, transitionDuration * 1000);
        };
      }, transitionDuration * 1000);
    });
  },
};
