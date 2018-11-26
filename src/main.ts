// NOTE: hooks 必须放在任何 vue 代码之前才有效
import '@/util/hooks'
import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import app from './app.vue'
import Router from 'vue-router'
import home from './views/home.vue'
import routers from './routers'

Vue.use(Router)
Vue.use(iView)

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

new Vue({
  router,
  render: h => h(app),
}).$mount('#app')
