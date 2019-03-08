// NOTE: hooks 必须放在任何 vue 代码之前才有效
import '@/util/hooks'

import Vue from 'vue'
import Router from 'vue-router'

// iView
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import locale from 'iview/dist/locale/zh-CN'

// 全局权限控制指令
import '@/util/authDirective'

// 全局组件
import LazyInput from '@/components/LazyInput'

import app from './app.vue'
import event from './fn/event'

import { alert } from './ui/modal'
import { hasLogin, hasRoutePerm } from './store'

import routes from './routes'
import { devError, devWarn } from './util/dev'

import moment from 'moment'
import 'moment/locale/zh-cn'

// iview 配置
Vue.use(iView, { locale })

iView.LoadingBar.config({
  color: '#f80',
  width: 6,
})

// 路由配置
Vue.use(Router)

const router = new Router({ mode: 'history', routes })

router.beforeEach(async (to, from, next) => {
  iView.LoadingBar.start()
  if (!to.meta.unauth && !hasLogin()) {
    next({ name: 'login' })
  } else {
    const has = await hasRoutePerm(to)
    event.emit('route-perm', { has, to, from })
    next()
  }
})

router.afterEach((to, from) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

// 全局注册一些常用组件
Vue.component('LazyInput', LazyInput)

Vue.config.productionTip = false

// 设置周开始为周日（默认为周一）
moment.updateLocale('zh-cn', { week: { dow: 0 } } as any)
// 设置 moment 的语言为简体中文
moment.locale('zh-cn')

// 全局事件监听
// 采用低优先级监听 ajax*** 事件，以便其他地方可以拦截取消
event.on({
  ajax401() {
    router.push({ name: 'login' })
  },

  ajax403() {
    alert('权限不足')
  }
}, false)

new Vue({
  router,
  render: h => h(app),
}).$mount('#app')
