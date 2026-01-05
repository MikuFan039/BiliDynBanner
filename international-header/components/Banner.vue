<template>
  <div class="bili-banner" :style="animatedBannerShow ? '' : `background-image: url(${bannerImg})`" >
    <AnimatedBanner
      v-if="animatedBannerEnabled"
      :config="animatedBannerConfig"
      @change="v => animatedBannerShow = v"
    />

    <!-- 渐变层 -->
    <div class="taper-line"></div>

    <div class="b-logo b-wrap" style="margin: 0">
      <!-- bilibili logo -->
      <a href="//www.bilibili.com"
         class="head-logo"
         v-van-report:headBannerLogo.click>
        <img class="logo-img" :src="logoImg">
      </a>
      <!-- banner 运营位hover展现文字 -->
      <a v-if="bannerTitle"
        :href="bannerLink"
        v-van-report:headBanner.click
        target="_blank"
        class="head-title"
        v-text="bannerTitle"></a>
    </div>
    <!-- banner 运营位跳转链接 -->
    <a v-if="bannerLink"
      :href="bannerLink"
      v-van-report:headBanner.click
      target="_blank"
      class="banner-link"></a>

  </div>
</template>

<script>
import { trimHttp } from 'g-public/js/utils'
import AnimatedBanner from './animated-banner/index.vue'
import axios from 'axios'

export default {
  components: {
    AnimatedBanner,
  },
  props: {
    bid: {
      type: Number,
      default: 142,
    },
    userInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    bannerData: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      mid: null,
      animatedBannerShow: false, 
      animatedBannerEnabled: false,
      locsData: null,
      animatedBannerConfig: null,
    }
  },
  watch: {
    'userInfo': {
      deep: true,
      handler(val) {
        this.mid = val.mid
      }
    },
  },
  computed: {
    locs() {
      return this.locsData || this.bannerData[0] && this.mapBannerData(this.bannerData[0]) || {}
    },
    bannerImg() {
      return trimHttp(this.locs && this.locs.litpic)
    },
    logoImg() {
      return trimHttp(this.locs && this.locs.logo)
    },
    bannerTitle() {
      return this.locs && this.locs.title
    },
    bannerLink() {
      // 通栏连接
      let blink = trimHttp(this.locs && this.locs.jump_url) || null

      // 游戏类型的连接 做特殊的处理 用于上报
      if(blink && blink.indexOf('__MID__') !== -1 && blink.indexOf('__REQUESTID__') !== -1 && this.mid) {
        return blink.replace('__MID__', this.mid || '__MID__').replace('__REQUESTID__', this.locs.request_id || '__REQUESTID__')
      }
      
      return blink
    },
  },
  beforeMount() {
    // 用于管理后台预览时不从接口获取配置
    if (/\.bilibili\.co$/.test(window.location.host)) {
      this.bannerDataFetched = Promise.resolve(true)
      return
    }
    this.bannerDataFetched = axios.get(`https://api.bilibili.com/x/web-show/res/frontpage?resid=${this.bid}`)
      .then(res => res.data)
      .then(res => {
        if (res.code !== 0) {
          throw res
        }
        this.locsData = res.data
      })
      .catch(console.error)
  },
  mounted() {
    this.animatedBanner()
  },
  methods: {
    async animatedBanner() {
      // 先等待获取banner配置
      await this.bannerDataFetched
      // 优先加载展示静态banner
      const staticBannerImg = document.createElement('img')
      staticBannerImg.src = trimHttp(this.locs && this.locs.litpic)
      await new Promise(r => staticBannerImg.onload = r)

      // 获取动画配置
      if (this.locs.is_split_layer === 1) {
        try {
          this.animatedBannerConfig = JSON.parse(this.locs.split_layer)
          this.animatedBannerEnabled = true
        } catch (e) {
          console.error('animated_banner_config parse error')
          this.animatedBannerEnabled = false
        }
      }
    },
    mapBannerData(v) {
      // 将服务端渲染时返回的资源位格式数据映射为新的版头配置接口格式
      return {
        logo: v.litpic,
        litpic: v.pic,
        title: v.name,
        jump_url: v.jump_url,
        request_id: v.request_id,
        is_split_layer: v.is_split_layer,
        split_layer: v.split_layer,
      }
    },
  }
}
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
    background: linear-gradient(rgba(0, 0, 0, .4), transparent);
  }

  .head-title {
    position: absolute;
    bottom: 25px;
    left: 280px;
    line-height: 20px;
    padding: 6px 10px;
    background-color: rgba(0, 0, 0, 0.68);
    color: #fff;
    border-radius: 4px;
    font-size: 14px;
    max-width: 350px;
    opacity: 0;
    transition: all 0.2s;
  }

  &:hover {
    .head-title {
      opacity: 1;
    }
  }

  .b-logo {
    position: relative;
    .head-logo {
      position: absolute;
      width: 220px;
      height: 50%;
      min-height: 60px;
      bottom: 10px;
      z-index: 1;
    }
    .logo-img {
      height: 100%;
    }
  }
  

  .banner-link {
    z-index: 0;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
  }
}

</style>
