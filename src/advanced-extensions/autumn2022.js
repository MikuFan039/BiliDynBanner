/**
 * 高级扩展：autumn2022
 *
 * <base href> 生命周期：
 *   阶段一（脚本加载）：点击后 loadScript 前插入，脚本执行完毕后立即移除
 *                       （autumn2022 的脚本在点击后才加载，与 spring/summer 不同）
 *   阶段二（游戏运行）：脚本加载完成后重新插入，exit() 时移除
 *   两次进入游戏之间 <base> 不存在，对页面无影响
 */

import { loadScript, insertBase, detectGpu } from "./utils.js";

export default {
  config: {
    script: "main.d177301ef5bc94ea7572.js",
    globalName: "autumn2022",
    video: "blackboard/activity68698/public/static/2xv.mp4",
    benchmarksURL: "blackboard/static/00979505aec5edd6e5c2f8c096fa0f62",
    transition: 0.6,
    skipGpuCheck: false, // 设为 true 可跳过 GPU 检测（需确保 benchmarksURL 与 detect-gpu 版本匹配）
  },

  async init(container, taperLine, extConfig, resolveUrl, activeUrl) {
    const scriptUrl = resolveUrl(extConfig.script, activeUrl);
    const videoUrl = resolveUrl(extConfig.video, activeUrl);
    const benchmarksURL = resolveUrl(extConfig.benchmarksURL, activeUrl);
    const baseUrl = activeUrl.substring(0, activeUrl.lastIndexOf("/") + 1);
    const transition = extConfig.transition ?? 0.6;

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
        console.warn("[autumn2022] GPU 性能不足，跳过加载", gpu);
        return;
      }
    }

    // ── 插入背景视频 ──────────────────────────────────────────────────────────
    const bgVideo = document.createElement("video");
    bgVideo.muted = true;
    bgVideo.loop = true;
    bgVideo.src = videoUrl;
    bgVideo.playsInline = true;
    bgVideo.disablePictureInPicture = true;
    bgVideo.disableRemotePlayback = true;
    const videoHeight = () => 360 * (container.clientWidth / 1920);
    Object.assign(bgVideo.style, {
      position: "absolute",
      transform: "translateY(-4%)",
      left: "0",
      width: "100%",
      height: `${videoHeight()}px`,
      objectFit: "cover",
      objectPosition: "center",
      transition: `transform ${transition}s linear`,
    });
    window.addEventListener("resize", () => {
      bgVideo.style.height = `${videoHeight()}px`;
    });
    container.style.overflow = "hidden";
    container.insertBefore(bgVideo, taperLine);
    bgVideo.play();

    // ── 构建 DOM ──────────────────────────────────────────────────────────────
    const extDiv = document.createElement("div");
    extDiv.classList.add("autumn-banner");
    Object.assign(extDiv.style, {
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
      left: "50%",
      width: "100%",
      minWidth: "1654px",
      transition: `top ${transition}s linear`,
    });

    const updateHeight = (() => {
      let raf = NaN;
      return () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const h = Math.max(extDiv.clientWidth * 0.1875, 155);
          extDiv.style.height = `${h}px`;
          bgVideo.style.height = `${h}px`;
        });
      };
    })();
    updateHeight();
    window.addEventListener("resize", updateHeight);

    container.style.transition = `height ${transition}s linear`;
    container.insertBefore(extDiv, taperLine);

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

    const originalHeight = container.clientHeight;
    let active = false;
    let exitTimer = NaN;
    let gameBaseEl = null; // 阶段二的 <base>，enter 时创建，exit 时销毁

    // ── 退出游戏 ──────────────────────────────────────────────────────────────
    const exit = () => {
      active = false;
      window.clearTimeout(exitTimer);

      // 阶段二：游戏退出时移除 <base>
      gameBaseEl?.remove();
      gameBaseEl = null;

      container.dispatchEvent(
        new CustomEvent("banner-expand", { detail: false })
      );
      container.style.height = originalHeight + "px";
      bgVideo.style.transform = "translateY(-4%)";
      exitTimer = window.setTimeout(() => {
        bgVideo.play();
        clickZone.style.removeProperty("display");
        taperLine.style.removeProperty("display");
        container.style.maxHeight = "240px";
      }, transition * 1000);
    };

    // ── 点击进入游戏 ──────────────────────────────────────────────────────────
    clickZone.addEventListener("click", async (e) => {
      const hitExtOrLogo = e
        .composedPath()
        .some(
          (el) =>
            el.classList?.contains("autumn-banner") ||
            el.classList?.contains("inner-logo")
        );
      if (active || hitExtOrLogo) return;

      bgVideo.pause();
      active = true;
      container.dispatchEvent(
        new CustomEvent("banner-expand", { detail: true })
      );
      clickZone.style.display = "none";
      taperLine.style.display = "none";

      const expandHeight = container.clientWidth * (3 / 16);
      Object.assign(container.style, {
        height: expandHeight + "px",
        maxHeight: expandHeight + "px",
      });
      bgVideo.style.transform = "translateY(0%)";

      // 阶段一：加载脚本期间临时插入 <base>，加载完立即移除
      {
        const baseEl = insertBase(baseUrl);
        try {
          await loadScript(scriptUrl);
        } finally {
          baseEl.remove();
        }
      }

      // 阶段二：游戏启动前重新插入 <base>，使运行期间的资源请求路径正确
      gameBaseEl = insertBase(baseUrl);

      window.clearTimeout(exitTimer);
      exitTimer = window.setTimeout(async () => {
        const initFn = window[extConfig.globalName];
        if (!initFn) {
          console.error(
            `[autumn2022] 找不到初始化函数: window.${extConfig.globalName}`
          );
          exit();
          return;
        }
        let instance = null;
        try {
          instance = await initFn(extDiv);
        } catch (err) {
          console.error("[autumn2022] 初始化失败", err);
          exit();
          return;
        }
        instance.onExit = exit;
      }, transition * 1000);
    });
  },
};
