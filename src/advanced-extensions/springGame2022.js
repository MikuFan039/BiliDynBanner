/**
 * 高级扩展：springGame2022（叶间穿行）
 *
 * 官方模式：每次点击进入都完整走 loadScript → new → init → start 流程，
 * 退出时 destroy() 销毁所有资源，下次进入重建。
 *
 * <base href> 生命周期：
 *   阶段一（脚本加载）：loadScript 前插入，脚本执行完毕后立即移除
 *   阶段二（游戏运行）：点击展开时插入，exitGame() 时移除
 */

import { loadScript, insertBase } from "./utils.js";

export default {
  config: {
    script: "XRG02U9wAU.js",
    constructor: "BannerGameSpring2022",
    video: {
      hq: "blackboard/static/20220315/00979505aec5edd6e5c2f8c096fa0f62/kPbkWcX74M.mp4",
      lq: "blackboard/static/20220314/00979505aec5edd6e5c2f8c096fa0f62/ZlmaPe9AZv.mp4",
      intro: "blackboard/static/20220314/00979505aec5edd6e5c2f8c096fa0f62/CmamSTNOdq.mp4",
    },
  },

  async init(container, taperLine, extConfig, resolveUrl, activeUrl) {
    const originalHeight = container.clientHeight;
    const scriptUrl = resolveUrl(extConfig.script, activeUrl);
    const hqUrl = resolveUrl(extConfig.video?.hq, activeUrl);
    const lqUrl = resolveUrl(extConfig.video?.lq, activeUrl);
    const introUrl = resolveUrl(extConfig.video?.intro, activeUrl);
    const baseUrl = activeUrl.substring(0, activeUrl.lastIndexOf("/") + 1);

    // ── 环境检测 ──────────────────────────────────────────────────────────────
    const supportWebGL2 = !!document
      .createElement("canvas")
      .getContext("webgl2");
    const supportPixel =
      typeof CSS !== "undefined" && CSS.supports("image-rendering: pixelated");
    const supportShadow = !!document.createElement("div").attachShadow;
    if (!(supportWebGL2 && supportPixel && supportShadow)) return;

    // ── 背景视频 ──────────────────────────────────────────────────────────────
    const bgVideo = document.createElement("video");
    bgVideo.muted = true;
    bgVideo.loop = true;
    bgVideo.src = supportWebGL2 ? hqUrl : lqUrl;
    bgVideo.playsInline = true;
    bgVideo.disablePictureInPicture = true;
    bgVideo.disableRemotePlayback = true;
    Object.assign(bgVideo.style, {
      position: "absolute",
      top: "40%",
      transform: "translateY(-50%)",
      left: "0",
      width: "100%",
      objectFit: "cover",
      objectPosition: "center",
      imageRendering: "pixelated",
      transition: "top 1s",
    });
    container.insertBefore(bgVideo, taperLine);
    bgVideo.play();

    // ── 过场视频预加载：0×0 藏在 body，点击后才移入 container 播放 ────────────
    const cutsceneVideo = document.createElement("video");
    cutsceneVideo.muted = true;
    cutsceneVideo.src = introUrl;
    cutsceneVideo.playsInline = true;
    cutsceneVideo.disablePictureInPicture = true;
    cutsceneVideo.disableRemotePlayback = true;
    Object.assign(cutsceneVideo.style, {
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "0",
      width: "0px",
      height: "0px",
      objectFit: "cover",
      objectPosition: "center",
      imageRendering: "pixelated",
    });
    document.body.appendChild(cutsceneVideo);

    container.style.transition = "height 1s";
    container.style.overflow = "hidden";

    let isExpanded = false;
    let inactivityTimer = 0;
    let runtimeBase = null;
    const firstVisitKey = `banner_ext_${extConfig.constructor}`;

    // ── 退出游戏，还原 banner ─────────────────────────────────────────────────
    // 游戏关闭按钮的执行顺序：onExit() → this.destroy()
    const exitGame = () => {
      isExpanded = false;
      window.clearInterval(inactivityTimer);

      runtimeBase?.remove();
      runtimeBase = null;

      container.style.height = originalHeight + "px";
      bgVideo.style.top = "40%";
      setTimeout(() => taperLine.style.removeProperty("display"), 1000);
    };

    // ── 点击 banner 展开游戏 ──────────────────────────────────────────────────
    container.addEventListener("click", async (clickEvent) => {
      if (
        isExpanded ||
        clickEvent
          .composedPath()
          .some(
            (el) =>
              el.classList?.contains("banner-game") ||
              el.classList?.contains("inner-logo")
          )
      )
        return;

      isExpanded = true;
      taperLine.style.display = "none";

      const expandHeight = container.clientWidth / (16 / 3);
      Object.assign(container.style, {
        height: expandHeight + "px",
        maxHeight: expandHeight + "px",
      });
      bgVideo.style.top = "50%";

      // 阶段二：游戏运行期间插入 <base>
      runtimeBase = insertBase(baseUrl);

      // 过场视频移入 container 播放
      cutsceneVideo.currentTime = 0;
      cutsceneVideo.parentElement?.removeChild(cutsceneVideo);
      cutsceneVideo.style.width = "100%";
      cutsceneVideo.style.height = "100%";
      container.appendChild(cutsceneVideo);

      const cutsceneEnded = new Promise((resolve) => {
        cutsceneVideo.addEventListener("ended", resolve, { once: true });
      });
      cutsceneVideo.play();

      // 每次进入都重新加载脚本、重建实例，与官方实现一致。
      // 加时间戳参数强制脚本重新执行，确保 s.am 等模块单例完全重置。
      let gameInstance;
      try {
        const loadingBase = insertBase(baseUrl);
        let scriptEl;
        try {
          scriptEl = await loadScript(scriptUrl + "?t=" + Date.now());
        } finally {
          loadingBase.remove();
          scriptEl?.remove();
        }

        const GameConstructor = window[extConfig.constructor];
        if (!GameConstructor)
          throw new Error(`找不到构造函数: window.${extConfig.constructor}`);
        gameInstance = new GameConstructor(container);
        gameInstance.onExit = exitGame;
        await Promise.all([cutsceneEnded, gameInstance.init()]);
      } catch (err) {
        console.error("[springGame2022] 初始化失败", err);
        exitGame();
        return;
      }

      // 过场结束、游戏就绪，移除过场视频
      cutsceneVideo.parentElement?.removeChild(cutsceneVideo);

      if (window.localStorage.getItem(firstVisitKey)) {
        gameInstance.gameContainer.focus();
        gameInstance.start();
      } else {
        window.localStorage.setItem(firstVisitKey, "1");
        gameInstance.showGuide();
        gameInstance.renderFirstFrame();
      }

      inactivityTimer = window.setInterval(() => {
        if (performance.now() - gameInstance.lastActive > 5 * 60 * 1000) {
          gameInstance.onExit?.();
          gameInstance.destroy();
        }
      }, 30 * 1000);
    });
  },
};
