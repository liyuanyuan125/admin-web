/**
 * 该文件改为手动维护，但请注意，相似的路径写在一起
 */
export default [
  {
    path: '/about',
    name: 'about',
    component: () => import('./views/about.vue')
  },

  {
    path: '/client/account/',
    name: 'client-account',
    component: () => import('./views/client/account/index.vue')
  },
  {
    path: '/client/account/detail/:id?',
    name: 'client-account-detail',
    component: () => import('./views/client/account/detail.vue')
  },
  {
    path: '/client/account/detail/viewLog/:id',
    name: 'client-account-viewLog',
    component: () => import('./views/client/account/viewLog.vue')
  },
  {
    path: '/client/corp/',
    name: 'client-corp',
    component: () => import('./views/client/corp/index.vue')
  },
  {
    path: '/client/corp/detail/:id?',
    name: 'client-corp-detail',
    component: () => import('./views/client/corp/detail.vue')
  },
  {
    path: '/client/corp/edit/:id?',
    name: 'client-corp-edit',
    component: () => import('./views/client/corp/edit.vue')
  },

  {
    path: '/client/verify/',
    name: 'client-verify',
    component: () => import('./views/client/verify/index.vue')
  },
  {
    path: '/data/area/',
    name: 'data-area',
    component: () => import('./views/data/area/index.vue')
  },
  {
    path: '/data/calendar/',
    name: 'data-calendar',
    component: () => import('./views/data/calendar/index.vue')
  },

  {
    path: '/data/cinema-chain/',
    name: 'data-cinema-chain',
    component: () => import('./views/data/cinema-chain/index.vue')
  },

  {
    path: '/data/cinema/',
    name: 'data-cinema',
    component: () => import('./views/data/cinema/index.vue')
  },
  {
    path: '/data/cinema-hall/:id',
    name: 'data-cinema-hall',
    component: () => import('./views/data/cinema-hall/index.vue')
  },

  {
    path: '/data/dict/',
    name: 'data-dict',
    component: () => import('./views/data/dict/index.vue')
  },
  {
    path: '/data/dict/viewDictionary/:id?',
    name: 'data-dict-viewDictionary',
    component: () => import('./views/data/dict/viewDictionary.vue')
  },

  {
    path: '/data/film/',
    name: 'data-film',
    component: () => import('./views/data/film/index.vue')
  },
  {
    path: '/data/film/detail/:id',
    name: 'data-film-detail',
    component: () => import('./views/data/film/detail.vue')
  },

  {
    path: '/data/dict-category/',
    name: 'data-dict-category',
    component: () => import('./views/data/dict-category/index.vue')
  }
] as any[]
