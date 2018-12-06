/**
 * !! 警告：该文件使用 yarn uproute 自动生成，不要手动维护 !!
 */

export default [
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ './views/about.vue')
  },
  {
    path: '/client/corp/detail/:id?',
    name: 'client-corp-detail',
    component: () => import(/* webpackChunkName: "client-corp-detail" */ './views/client/corp/detail.vue')
  },
  {
    path: '/client/corp/edit/:id?',
    name: 'client-corp-edit',
    component: () => import(/* webpackChunkName: "client-corp-edit" */ './views/client/corp/edit.vue')
  },
  {
    path: '/client/corp/',
    name: 'client-corp',
    component: () => import(/* webpackChunkName: "client-corp" */ './views/client/corp/index.vue')
  },
  {
    path: '/client/account/detail/:id?',
    name: 'client-account-detail',
    component: () => import(/* webpackChunkName: "client-account-detail" */ './views/client/account/detail.vue')
  },
  {
    path: '/client/account/verify/:id?',
    name: 'client-account-verify',
    component: () => import(/* webpackChunkName: "client-account-verify" */ './views/client/account/dlgVerify.vue')
  },
  {
    path: '/client/account/viewlog/:id?',
    name: 'client-account-viewlog',
    component: () => import(/* webpackChunkName: "client-account-viewlog" */ './views/client/account/viewLog.vue')
  },
  {
    path: '/client/account/',
    name: 'client-account',
    component: () => import(/* webpackChunkName: "client-account" */ './views/client/account/index.vue')
  },
  {
    path: '/client/verify/',
    name: 'client-verify',
    component: () => import(/* webpackChunkName: "client-verify" */ './views/client/verify/index.vue')
  },
  {
    path: '/data/calendar/',
    name: 'data-calendar',
    component: () => import(/* webpackChunkName: "data-calendar" */ './views/data/calendar/index.vue')
  },
  {
    path: '/data/area/',
    name: 'data-area',
    component: () => import(/* webpackChunkName: "data-area" */ './views/data/area/index.vue')
  },
  {
    path: '/data/cinema/',
    name: 'data-cinema',
    component: () => import(/* webpackChunkName: "data-cinema" */ './views/data/cinema/index.vue')
  },
  {
    path: '/data/cinema-chain/',
    name: 'data-cinema-chain',
    component: () => import(/* webpackChunkName: "data-cinema-chain" */ './views/data/cinema-chain/index.vue')
  },
  {
    path: '/data/cinema-hall/',
    name: 'data-cinema-hall',
    component: () => import(/* webpackChunkName: "data-cinema-hall" */ './views/data/cinema-hall/index.vue')
  },
  {
    path: '/data/dict/',
    name: 'data-dict',
    component: () => import(/* webpackChunkName: "data-dict" */ './views/data/dict/index.vue')
  },
  {
    path: '/data/dict/viewDictionary/:id?',
    name: 'data-dict-viewDictionary',
    component: () => import(/* webpackChunkName: "data-dict-viewDictionary" */ './views/data/dict/viewDictionary.vue')
  },
  {
    path: '/data/film/',
    name: 'data-film',
    component: () => import(/* webpackChunkName: "data-film" */ './views/data/film/index.vue')
  },
  {
    path: '/data/dict-category/',
    name: 'data-dict-category',
    component: () => import(/* webpackChunkName: "data-dict-category" */ './views/data/dict-category/index.vue')
  }
] as any[]
