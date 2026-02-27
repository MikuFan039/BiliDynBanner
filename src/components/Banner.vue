<template>
  <!-- banner 容器：动态banner启用时隐藏背景图（由AnimatedBanner接管），否则显示静态背景图 -->
  <div
    class="bili-banner"
    :style="
      animatedBannerShow
        ? ''
        : bannerImg
        ? `background-image: url(${bannerImg})`
        : ''
    "
  >
    <!-- 动态分层视差 Banner -->
    <AnimatedBanner
      v-if="animatedBannerEnabled"
      :config="animatedBannerConfig"
      @change="(v) => (animatedBannerShow = v)"
    />

    <!-- 顶部渐变遮罩层，增加层次感 -->
    <div class="taper-line"></div>
  </div>
</template>

<script>
import AnimatedBanner from "./animated-banner/index.vue";
import axios from "axios";

// 去掉 URL 中的 http: 前缀，使其成为协议无关链接
const trimHttp = (url) => (url ? url.replace(/^http:/, "") : "");

/**
 * 将 JSON 中的路径解析为绝对 URL。
 * - 已是绝对路径（http/https// 开头）→ 原样返回（仅做 trimHttp）
 * - 相对路径 → 以 manifestUrl 所在目录为 base 拼接
 *
 * 例：manifestUrl = 'http://{host}/res/bilibanner/spring2022/manifest.json'
 *     src = 'img/123.png'
 *     → 'http://{host}/res/bilibanner/spring2022/img/123.png'
 *
 * @param {string} src         - JSON 中配置的路径
 * @param {string} manifestUrl - manifest.json 的完整请求 URL
 */
const resolveUrl = (src, manifestUrl) => {
  if (!src) return "";
  // 已是绝对路径，直接处理协议头后返回
  if (/^(https?:)?\/\//.test(src)) return trimHttp(src);
  // 取 manifestUrl 的目录部分（去掉文件名）作为 base
  const base = manifestUrl.substring(0, manifestUrl.lastIndexOf("/") + 1);
  return base + src;
};

/**
 * 递归遍历对象/数组，将所有 src 字段用 resolveUrl 处理。
 * 直接修改原对象（in-place），避免深拷贝开销。
 *
 * @param {any}    node        - 待处理的数据节点
 * @param {string} manifestUrl - manifest.json 的完整请求 URL
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

export default {
  name: "BiliBanner",
  components: { AnimatedBanner },

  props: {
    // banner 数据接口 URL，由外部（main.js）传入
    apiUrl: {
      type: String,
      required: true,
    },
    // fallback URL，主 apiUrl 请求失败时使用，由外部（main.js）传入
    fallbackUrl: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      animatedBannerShow: false, // AnimatedBanner 加载成功后置为 true
      animatedBannerEnabled: false, // 是否启用动态 banner（由接口数据决定）
      animatedBannerConfig: null, // 动态 banner 配置（JSON 解析结果）
      locsData: null, // 接口返回的 banner 数据
      activeUrl: null, // 实际生效的 URL（主请求成功用 apiUrl，否则用 fallbackUrl）
      bannerDataFetched: null, // 数据请求 Promise，供 initAnimatedBanner() 等待
    };
  },

  computed: {
    // 静态背景图（pic 可能是相对路径，走 resolveUrl 处理）
    bannerImg() {
      return resolveUrl(this.locsData && this.locsData.pic, this.activeUrl);
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
     * 请求指定 URL 的 banner 数据，成功后写入 this.locsData 和 this.activeUrl
     * 请求失败或业务 code !== 0 均抛出异常，供调用方决定是否 fallback
     * @param {string} url
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
      // 等待接口数据就绪
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

      // 若接口标记了分层动效，则解析配置并启用 AnimatedBanner
      if (this.locsData?.is_split_layer === 1) {
        try {
          const config = JSON.parse(this.locsData.split_layer);
          // 递归将 config 中所有 src 字段的相对路径补全为绝对 URL
          resolveSrcFields(config, this.activeUrl);
          this.animatedBannerConfig = config;
          this.animatedBannerEnabled = true;
        } catch (e) {
          console.error("animated_banner_config parse error", e);
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
