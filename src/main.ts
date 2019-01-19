// NOTE: hooks 必须放在任何 vue 代码之前才有效
import '@/util/hooks'
import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import app from './app.vue'
import Router from 'vue-router'
import home from './views/home.vue'
import login from './views/login.vue'
import MainLayout from './views/layout/MainLayout.vue'
import routes from './routes'
import locale from 'iview/dist/locale/zh-CN'
import event from './fn/event'
import { alert } from './ui/modal'
import LazyInput from '@/components/LazyInput'
import { hasLogin } from './store'

Vue.use(Router)

// 设置星期一为一周开始
locale.i.datepicker.weekStartDay = '1'
Vue.use(iView, { locale })

// 全局注册一些常用组件
Vue.component('LazyInput', LazyInput)

Vue.config.productionTip = false

const router = new Router({
  mode: 'history',
  // 非 MainLayout 页面放在这里，MainLayout 页面放在 routes 里
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        unauth: true
      }
    },
    {
      path: '/',
      component: MainLayout,
      children: [{
        path: '/',
        name: 'home',
        component: home,
      }].concat(routes),
    }
  ]
})

iView.LoadingBar.config({
  color: '#f80',
  width: 6,
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if (!to.meta.unauth && !hasLogin()) {
    next({ name: 'login' })
  // } else if (!store.getters.canSee(to.name)) {
  //   next({ name: '403' })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

// 采用低优先级监听 ajax*** 事件，以便其他地方可以拦截取消
event.on({
  ajax401(ev: any) {
    router.push({ name: 'login' })
  },

  ajax403(ev: any) {
    alert('权限不足')
  }
}, false as any)

new Vue({
  router,
  render: h => h(app),
}).$mount('#app')
