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
    path: '/client/account/viewLog/:id?',
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
    path: '/client/order/',
    name: 'client-order',
    component: () => import('./views/client/order/index.vue')
  },
  {
    path: '/client/order/detail/:id?',
    name: 'client-order-detail',
    component: () => import('./views/client/order/detail.vue')
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
    redirect: { name: 'data-cinema' },
    component: () => import('./components/tabLayout'),
    children: [
      {
        path: '/data/cinema/',
        name: 'data-cinema',
        component: () => import('./views/data/cinema/index.vue'),
        meta: {
          title: '影院管理',
          fixed: true,
        }
      },
      {
        path: '/data/cinema-hall/:id',
        name: 'data-cinema-hall',
        component: () => import('./views/data/cinema-hall/index.vue'),
        meta: {
          title: '影厅列表',
        }
      },
    ]
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
  },

  {
    path: '/contract/list/',
    name: 'contract-list',
    component: () => import('./views/contract/list/index.vue')
  },
  {
    path: '/contract/list/edit/:id?',
    name: 'contract-list-edit',
    component: () => import('./views/contract/list/edit.vue')
  },
  {
    path: '/contract/list/detail/:id?',
    name: 'contract-list-detail',
    component: () => import('./views/contract/list/detail.vue')
  },

  {
    path: '/finance/capital/',
    name: 'finance-capital',
    redirect: { name: 'finance-capital-ggtiser' },
    component: () => import('./components/tabLayout'),
    children: [
      {
        path: 'ggtiser',
        name: 'finance-capital-ggtiser',
        component: () => import('./views/finance/capital/ggtiser.vue'),
        meta: {
          title: '广告主系统',
          fixed: true,
        }
      },
      {
        path: 'resource',
        name: 'finance-capital-resource',
        component: () => import('./views/finance/capital/resource.vue'),
        meta: {
          title: '资源方系统',
          fixed: true,
        }
      },
      {
        path: 'rechargeNum/:companyId/:title',
        name: 'finance-capital-rechargeNum',
        component: () => import('./views/finance/capital/rechargeNum.vue'),
        meta: {
          title: '充值记录'
        }
      },
      {
        path: 'payRank/:companyId/:title',
        name: 'finance-capital-payRank',
        component: () => import('./views/finance/capital/payRank.vue'),
        meta: {
          title: '消费记录'
        }
      },
      {
        path: 'withdraw/:companyId/:title',
        name: 'finance-capital-withdraw',
        component: () => import('./views/finance/capital/withdraw.vue'),
        meta: {
          title: '提现记录'
        }
      },
      {
        path: 'consume/:companyId/:title',
        name: 'finance-capital-consume',
        component: () => import('./views/finance/capital/consume.vue'),
        meta: {
          title: '结算记录'
        }
      },
      {
        path: 'withdrawDetail/:id',
        name: 'finance-capital-withdrawDetail',
        component: () => import('./views/finance/capital/withdrawDetail.vue'),
        meta: {
          title: '提现详情'
        }
      },
      {
        path: 'withdrawalBill/:id/:show',
        name: 'finance-capital-withdrawalBill',
        component: () => import('./views/finance/capital/withdrawalBill.vue'),
        meta: {
          title: '添加提现账单'
        }
      }
    ]
  },

  {
    path: '/finance/examine/',
    name: 'finance-examine',
    component: () => import('./views/finance/examine/index.vue')
  },
  {
    path: '/finance/examine/detail/:id',
    name: 'finance-examine-detail',
    component: () => import('./views/finance/examine/detail.vue')
  },
  {
    path: '/finance/examine/edit/:id?',
    name: 'finance-examine-edit',
    component: () => import('./views/finance/examine/edit.vue')
  },
  {
    path: '/plan/ggtising',
    name: 'ggtising-plan',
    component: () => import('./views/plan/plan/index.vue')
  },
  {
    path: '/plan/ggtising/edit/:edit/:id',
    name: 'ggtising-plan-edit',
    component: () => import('./views/plan/plan/detail.vue')
  },
  {
    path: '/plan/ggtising/cinema/:id',
    name: 'ggtising-plan-cinema',
    component: () => import('./views/plan/plan/cinema.vue')
  },
  {
    path: '/gg/film',
    name: 'gg-film',
    component: () => import('./views/plan/film/index.vue')
  },
  {
    path: '/gg/film/detail/:id/:status',
    name: 'gg-film-detail',
    component: () => import('./views/plan/film/detail.vue')
  },

  // 刊例价管理
  {
    path: '/resource/management',
    name: 'resource-management',
    redirect: { name: 'resource-management-platform' },
    component: () => import('./components/tabLayout'),
    children: [
      {
        path: 'platform',
        name: 'resource-management-platform',
        component: () => import('./views/resource/management/platform.vue'),
        meta: {
          title: '平台刊例价',
          fixed: true,
        }
      },
      {
        path: 'corp',
        name: 'resource-management-corp',
        component: () => import('./views/resource/management/corp.vue'),
        meta: {
          title: '公司刊例价',
          fixed: true,
        }
      },
      {
        path: 'realtime',
        name: 'resource-management-realtime',
        component: () => import('./views/resource/management/realtime.vue'),
        meta: {
          title: '实时刊例价查询',
          fixed: true,
        }
      },
    ]
  },

  {
    path: '/resource/management/edit/:id?',
    name: 'resource-management-edit',
    component: () => import('./views/resource/management/edit.vue')
  },
  {
    path: '/system/setup',
    name: 'system-setup',
    component: () => import('./views/system/setup/index.vue')
  },
  {
    path: '/order/list',
    name: 'order-list',
    component: () => import('./views/order/list/index.vue')
  },
  {
    path: '/order/list/:id/:status',
    name: 'order-list-detail',
    component: () => import('./views/order/list/detail.vue')
  },
] as any[]
