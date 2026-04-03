<template>
  <!-- banner 容器：动态banner启用时隐藏背景图（由AnimatedBanner接管），否则显示静态背景图 -->
  <div class="bili-banner" ref="banner"
    :style="animatedBannerShow ? '' : (bannerImg ? `background-image: url(${bannerImg})` : '')">
    <!-- 动态分层视差 Banner -->
    <AnimatedBanner v-if="animatedBannerEnabled" :config="animatedBannerConfig" @change="v => animatedBannerShow = v" />
    <!-- 顶部渐变遮罩层，增加层次感 -->
    <div class="taper-line" ref="taperLine"></div>
  </div>
</template>

<script>
import AnimatedBanner from "./animated-banner/index.vue";
import EXTENSIONS from "../extensions/index.js";
import axios from "axios";

// 去掉 URL 中的 http: 前缀，使其成为协议无关链接
const trimHttp = (url) => (url ? url.replace(/^http:/, "") : "");

/**
 * 将 JSON 中的路径解析为绝对 URL。
 * - 已是绝对路径（http/https// 开头）→ 原样返回（仅做 trimHttp）
 * - 相对路径 → 以 manifestUrl 所在目录为 base 拼接
 */
const resolveUrl = (src, manifestUrl) => {
  if (!src) return "";
  if (/^(https?:)?\/\//.test(src)) return trimHttp(src);
  const base = manifestUrl.substring(0, manifestUrl.lastIndexOf("/") + 1);
  return base + src;
};

/**
 * 递归遍历对象/数组，将所有 src 字段用 resolveUrl 处理。
 */
const resolveSrcFields = (node, manifestUrl) => {
  if (Array.isArray(node)) {
    node.forEach((item) => resolveSrcFields(item, manifestUrl));
  } else if (node && typeof node === "object") {
    Object.keys(node).forEach((key) => {
      if (key === "src" && typeof node[key] === "string") {
        node[key] = resolveUrl(node[key], manifestUrl);
      } else {
        resolveSrcFields(node[key], manifestUrl);
      }
    });
  }
};

/**
 * 处理 extensions.time 时间段扩展，根据当前时间选出对应的 layers 并合并进 config。
 */
const resolveTimeExtension = (config) => {
  const timeMap = config.extensions?.time;
  if (!timeMap) return;
  // 当天已过秒数（对齐原始：(Date.now() - 今日零点毫秒) / 1000）
  const secondsOfDay = (Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000;
  // key 转数字后升序排列
  const keys = Object.keys(timeMap)
    .map(Number)
    .sort((a, b) => a - b);
  // 找满足 keys[i] < secondsOfDay && (keys[i+1] > secondsOfDay || 最后一段) 的区间
  let matched = null;
  for (let i = 0; i < keys.length; i++) {
    if (
      keys[i] < secondsOfDay &&
      (i + 1 === keys.length || keys[i + 1] > secondsOfDay)
    ) {
      matched = timeMap[String(keys[i])];
      break;
    }
  }
  if (matched) {
    // 从该时间段的 config 数组中随机取一项，用其 layers 完全替换
    const picked = matched[Math.floor(Math.random() * matched.length)];
    config.layers = picked.layers || [];
  }
  // 清除 time 时间段扩展，避免 AnimatedBanner 误判
  delete config.extensions.time;
};

export default {
  name: "BiliBanner",
  components: { AnimatedBanner },

  props: {
    // banner 数据接口 URL
    apiUrl: {
      type: String,
      required: true,
    },
    // fallback URL
    fallbackUrl: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      animatedBannerShow: false, // AnimatedBanner 加载成功后置为 true
      animatedBannerEnabled: false, // 是否启用动态 banner
      animatedBannerConfig: null, // 动态 banner 配置
      locsData: null, // 接口返回的 banner 数据
      activeUrl: null, // 实际生效的请求 URL
      bannerDataFetched: null, // 数据请求 Promise
    };
  },

  computed: {
    // 静态背景图：优先取 pic，降级取 litpic（部分旧 manifest 仅有 litpic 字段）
    bannerImg() {
      const src = this.locsData && (this.locsData.pic || this.locsData.litpic);
      return resolveUrl(src, this.activeUrl);
    },
  },

  beforeMount() {
    // 请求 banner 数据，失败时自动 fallback 到 fallbackUrl
    this.bannerDataFetched = this.fetchBannerData(this.apiUrl)
      .catch((err) => {
        if (this.fallbackUrl && this.fallbackUrl !== this.apiUrl) {
          console.warn(
            `[BiliBanner] 主请求失败，fallback 到 ${this.fallbackUrl}`,
            err
          );
          return this.fetchBannerData(this.fallbackUrl);
        }
        throw err;
      })
      .catch(console.error);
  },

  mounted() {
    this.initAnimatedBanner();
  },

  methods: {
    /**
     * 请求指定 URL 的 banner 数据，成功后写入 this.locsData 和 this.activeUrl。
     */
    fetchBannerData(url) {
      return axios
        .get(url)
        .then((res) => res.data)
        .then((res) => {
          if (res.code !== 0) throw res;
          this.locsData = res.data;
          this.activeUrl = url;
        });
    },

    async initAnimatedBanner() {
      await this.bannerDataFetched;
      // 预加载静态背景图，确保无闪烁
      if (this.locsData?.pic) {
        const img = document.createElement("img");
        img.src = this.bannerImg;
        await new Promise((r) => {
          img.onload = r;
          img.onerror = r;
        });
      }

      // 分支一：顶层 advExt 字段（完整自定义配置，优先级最高）
      if (this.locsData?.advExt) {
        try {
          const extConfig =
            typeof this.locsData.advExt === "string"
              ? JSON.parse(this.locsData.advExt)
              : this.locsData.advExt;
          // 顶层 advExt 字段不绑定具体高级扩展模块，直接走通用扩展初始化
          // 需在 advExt 中指定 extension 字段对应已注册的高级扩展名
          const ext = EXTENSIONS[extConfig.extension];
          if (!ext) {
            console.error(`[BiliBanner] 未找到高级扩展: ${advExt.extension}`);
            return;
          }
          ext.init(
            this.$refs.banner,
            this.$refs.taperLine,
            extConfig,
            resolveUrl,
            this.activeUrl
          );
        } catch (e) {
          console.error("[BiliBanner] 高级扩展配置处理失败", e);
        }
        return;
      }

      // 分支二：分层视差动效 banner（含高级扩展检测）
      if (this.locsData?.is_split_layer === 1) {
        try {
          const config = JSON.parse(this.locsData.split_layer);
          // 检查 extensions 中是否有已注册的高级扩展，取第一个匹配项
          const advExtKey =
            config.extensions &&
            Object.keys(EXTENSIONS).find((k) => config.extensions[k]);
          if (advExtKey) {
            const ext = EXTENSIONS[advExtKey];
            // 将高级扩展模块的默认 config 与 manifest 中的覆盖值合并
            const extConfig = Object.assign(
              {},
              ext.config,
              config.extensions[advExtKey]
            );
            ext.init(
              this.$refs.banner,
              this.$refs.taperLine,
              extConfig,
              resolveUrl,
              this.activeUrl
            );
            return;
          }

          // 无高级扩展，走普通视差动效流程
          // 处理 extensions.time 时间段扩展，合并对应时间的 layers
          resolveTimeExtension(config);
          resolveSrcFields(config, this.activeUrl);
          this.animatedBannerConfig = config;
          this.animatedBannerEnabled = true;
        } catch (e) {
          console.error("[BiliBanner] 动态Banner配置处理失败", e);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.bili-banner {
  margin: 0 auto;
  position: relative;
  z-index: 0;
  // max-width: 2560px;
  // max-height: 240px;
  min-height: 155px;
  // todo 兼容性？
  height: 9.375vw;
  min-width: 999px;
  //min-height: 155px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;

  background-repeat: no-repeat;
  background-position: center 0;
  background-size: cover;

  .taper-line {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100px;
    background: linear-gradient(rgba(0, 0, 0, 0.4), transparent);
  }
}
</style>