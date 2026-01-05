import 'g-public/js/polyfill'
import Vue from 'vue'
import App from './App.vue'

import { CommonFilter, TrackingReport } from '@bilibili/sentry-integrations'

if (window.Sentry) {
  // sentry start
  const { BrowserClient } = Sentry
  const appClient = new BrowserClient({
    dsn: `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://af2935c270b74b88b0db9e65acb4477f@api.bilibili.com/x/traceback/63`,
    debug: process.env.NODE_ENV !== 'production',
    release: process.env.COMMIT_ID,
    environment: process.env.NODE_ENV,
    sampleRate: process.env.NODE_ENV === 'proudction' ? 0.01: 1,
    integrations: [
      new TrackingReport({env: process.env.NODE_ENV}),
      new CommonFilter({
        ignoreMessageList: ['app.match', 'obj.runBridge'],
        ignoreFileNameList: ['https://ad3.789zuhao.cn/'], // 忽略 第三方的上报
      }),
      // new Integrations.Vue({
      //   Vue,
      //   attachProps: true,
      //   logErrors: process.env.NODE_ENV !== 'production',
      // }),
    ],
  })
  // https://github.com/getsentry/sentry-javascript/issues/1854#issuecomment-510379723
  Sentry.getCurrentHub().bindClient(appClient)
  // sentry end

}

const getEl = () => document.querySelector('#biliMainHeader') || document.querySelector('.z-top-container')
const initVue = () => {
  const el = getEl()
  const type = (() => {
    switch(el.getAttribute('type')) {
      case 'all':
        return 1
      case 'mask':
        return 2
      default:
        return 0
    }
  })()
  const disableSticky = el.getAttribute('disable-sticky') || el.getAttribute('disable-sticky') === ''
  new Vue({
    components:{ App },
    template: `<App :navType="${type}" :disableSticky="${disableSticky}"/>`,
    el,
  })
}

if(getEl()) {
  initVue()
}else {
  document.addEventListener('DOMContentLoaded', () => {
    initVue()
  })
}
