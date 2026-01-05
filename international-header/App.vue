<template lang="html">
  <div
    id="internationalHeader"
    class="international-header report-wrap-module"
    :class="{'fixed-top': navFixed}"
  >
    <MiniHeader
      class="m-header"
      :class="{
        'mini-type': navType === 0 || navFixed,
        'mask-bg': !navFixed && navType === 2,
      }"
      :menuConfig="menuConfig"
      :navType="navType"
      :userInfo="userInfo"
      :locsData="locsData"
      :lang="lang"
    />
    <Banner
      v-if="navType === 1"
      :bid="bid"
      :bannerData="bannerData"
      :userInfo="userInfo"/>
    <PrimaryMenu
      v-if="navType === 1"
      ref="primaryMenu"
      :menuConfig="menuConfig"
      :tid="Number(tid)" />
  </div>
</template>

<script>
import Vue from 'vue'
import MiniHeader from './components/mini-header/index'
import Banner from './components/Banner'
import PrimaryMenu from './components/primary-menu'
import UserState from './lib/UserState'

import 'g-public/js/directive'
import { bannerIdMap } from './config/bid'
import { getScript, cookie } from 'g-public/js/utils'

import CN from './assets/languages/zh-cn'
import TW from './assets/languages/zh-tw'
import * as menuConfig from 'g-public/js/config/menuConfig'
import * as menuConfigTW from 'g-public/js/config/menuConfigTW'

import { getLocs } from './api'
import { checkTouchDevice } from 'g-public/js/utils'

// 引入van
import { Popover, Image, Report } from '@bilibili/van'

import commonReport from 'g-public/directive/commonReport'

import Bfs from '@blink-common/component.bfs-utils'
import { customReport } from 'g-public/js/utils'

Vue.use(Popover)
Vue.use(Image)
Vue.use(Report)
Vue.use(commonReport)

Vue.prototype.$bfs = new Bfs()
Vue.prototype.isTouchDevice = false

import inlineSvgs from './lib/inline-svgs'
Vue.prototype.inlineSvgs = inlineSvgs

if (process.env.VUE_ENV === 'client') {
  // 引入iconfong
  require('g-public/style/bili-iconfont/iconfont.css')
  require('g-public/style/bili-iconfont/iconfont.js')

  // 获取用户状态
  const us = new UserState()
  us.getUserState()
  Vue.prototype.$userStatus = us

  window.UserStatus = us
  // 注册一个全局函数 提供登录后回调
  window.onLoginInfoLoaded = function (fn, watch) {
    if (us.userInfo) {
      fn(us.userInfo)
      if (watch) us.onLoginUpdate(fn)
    } else {
      watch ? us.onLoginUpdate(fn) : us.onLoginOnce(fn)
    }
  }

  // 接收播放器登录成功
  window.loadLoginStatus = function () {
    us.getUserState(null, { isLogin: false })
  }

  Vue.prototype.isTouchDevice = checkTouchDevice()
}

export default {
  components: {
    MiniHeader,
    Banner,
    PrimaryMenu,
  },
  props: {
    // 0 -> 迷你导航
    // 1 -> 带banner导航
    // 2 -> 半透明迷你导航
    navType: {
      type: Number,
      default: 0,
    },
    lang: {
      type: String,
      default: '',
    },
    bannerData: {
      type: Array,
      default: () => {
        return []
      },
    },
    // 是否禁用未登录时的顶导吸顶
    disableSticky: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tid: '',
      userInfo: {
        isLogin: null,
        fallback: false,
        face: '//static.hdslb.com/images/member/noface.gif',
      },
      locsData: null,
      menuConfig: {
        MenuConfig: [],
        LiveMenuConfig: [],
        SideMenuConfig: [],
        ChannelMenuConfig: [],
      },
      navFixed: false,
    }
  },
  computed: {
    bid() {
      return bannerIdMap[this.tid] || 142
    },
  },
  methods: {
    onLoginUpdate(info) {
      this.userInfo = Object.assign(this.userInfo, info)
      const isAccountPage = /(passport|account)\.bilibili\.com$/.test(
        window.location.hostname
      )
      if (!this.userInfo.isLogin && !isAccountPage) {
        this.handleBsource()
      } else {
        if (this.handleScroll) {
          window.removeEventListener('scroll', this.handleScroll)
          this.navFixed = false
        }
      }
    },
    async getLocsData() {
      // 大会员
      const vipIds = '2837,2836,2870'
      // 菜单运营位
      const locMenuIds = ',2953,2954,2955,2956'

      const ids = vipIds + locMenuIds

      try {
        const { data } = await getLocs(ids)
        if (data.code === 0) {
          this.locsData = data.data
        }
      } catch (err) {}
    },
    handleBsource() {
      if (this.disableSticky) {
        return
      }
      const scrollEl = document.scrollingElement || document.documentElement
      this.handleScroll = () => {
        if (!this.navFixed && scrollEl.scrollTop > 56) {
          this.navFixed = true
        }
        if (this.navFixed && scrollEl.scrollTop <= 56) {
          this.navFixed = false
        }
      }
      window.addEventListener('scroll', this.handleScroll)
    },
  },
  created() {
    // header组件分两种情况被调用
    // 1. 如果是组件的方式引入 取的是当前页面传入的
    // 2. 如果是script方式引入 先取cookie的lang 如果没有再取系统的language
    let _lang = ''
    if (typeof window !== 'undefined') {
      _lang =
        cookie.get('LNG') ||
        (window.navigator.language === 'zh-TW' ? 'zh-TW' : 'zh-CN')
    }

    const _lang2 = !this.lang ? _lang : this.lang

    if (_lang2 === 'zh-TW') {
      Vue.prototype.$HeadLang = TW
      this.menuConfig = menuConfigTW
    } else {
      Vue.prototype.$HeadLang = CN
      this.menuConfig = menuConfig
    }
  },
  beforeMount() {
    this.tid = window.bid || window.tid || window.topid
    if (!this.tid) {
      const path = window.location.pathname
      const name = path.split('/')[2]
      const currentMenu = this.menuConfig.MenuConfig.filter(menu => {
        return menu.route === name && !menu.takeOvered
      })
      this.tid = currentMenu[0] && currentMenu[0].tid
    }

    // 登录后回调
    window.onLoginInfoLoaded(info => {
      // eslint-disable-next-line no-console
      this.onLoginUpdate(info)
    }, true)

    // 获取运营位数据
    this.getLocsData()

    // 暴露手动修改tid方法 场景：手动切换导航高亮
    window.setTid = id => {
      this.tid = id
    }

    //合并log-reporter.js
    if (!window.reportObserver) {
      getScript('//s1.hdslb.com/bfs/seed/log/report/log-reporter.js')
    }
  },
  mounted() {},
}
</script>

<style lang="less">
@import './assets/style/base.less';

.international-header {
  min-width: 999px;
  min-height: 56px;
}

.b-wrap {
  width: 1630px;
  margin: 0 auto;
}

@media screen and (max-width: 1870px) {
  .b-wrap {
    width: 1414px;
    .page-tab .con li {
      width: 58px;
      .channel-name {
        width: 58px !important;
      }
    }
    .friendship-link {
      width: 242px;
    }
  }
}

@media screen and (max-width: 1654px) {
  .b-wrap {
    width: 1198px;
    .page-tab .con li {
      width: 50px !important;
      .channel-name {
        width: 50px !important;
      }
    }
    .tab-line-itnl {
      margin: 0 8px;
      &.none {
        margin: 0 12px 0 0;
      }
    }
    .friendship-link {
      width: 220px;
    }
  }
}

@media screen and (max-width: 1438px) {
  .b-wrap {
    width: 999px;
    .channel-menu-itnl {
      .item {
        &.hide {
          display: none;
        }
      }
    }
    .page-tab .con li {
      width: 50px;
      .channel-name {
        width: 50px !important;
      }
    }
    .tab-line-itnl {
      margin: 0 8px;
    }
  }
}

.international-header.fixed-top {
  .mini-header {
    position: fixed;
    top: 0;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    .bili-icon_dingdao_xiazaiapp,
    .bili-icon_dingdao_zhuzhan {
      color: #00a1d6;
    }
  }
  .mini-type .nav-link .nav-link-ul .nav-link-item .link,
  .mini-type .nav-user-center .user-con .item .name {
    color: #212121;
  }
  .nav-link .nav-link-ul.mini .bili-icon_dingdao_xiazaiapp {
    color: #00a1d6;
  }
}
</style>

