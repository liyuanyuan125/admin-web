// NOTE: hooks 必须放在任何 vue 代码之前才有效
import '@/util/hooks'
import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import app from './app.vue'
import Router from 'vue-router'
import home from './views/Home.vue'
import routers from './routers'
import locale from 'iview/dist/locale/zh-CN'
import event from './fn/event'
import { alert } from './ui/modal'
import LazyInput from '@/components/LazyInput'

Vue.use(Router)

// 设置星期一为一周开始
locale.i.datepicker.weekStartDay = '1'
Vue.use(iView, { locale })

// 全局注册一些常用组件
Vue.component('LazyInput', LazyInput)

Vue.config.productionTip = false

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  // 手动维护的 router 放在这里，routers 中的是工具自动生成的
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
    },
  ].concat(routers)
})

iView.LoadingBar.config({
  color: '#f80',
  width: 6,
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
  // if (!store.getters.hasLogin && to.name !== 'login') {
  //   next({ name: 'login' })
  // } else if (!store.getters.canSee(to.name)) {
  //   next({ name: '403' })
  // } else {
  //   next()
  // }
})

router.afterEach((to, from) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

event.on({
  ajax401(ev: any) {
      ev.handled = true
      alert('需要登录')
      // router.push({ name: 'login' })
  },

  ajax403(ev: any) {
      ev.handled = true
      alert('权限不足')
  }
})

new Vue({
  router,
  render: h => h(app),
}).$mount('#app')
