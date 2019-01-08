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
    redirect: { name: 'ggtiser'},
    component: () => import('./views/finance/capital/index.vue'),
    children: [
      {
        path: 'ggtiser',
        name: 'ggtiser',
        component: () => import('./views/finance/capital/ggtiser.vue'),
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('./views/finance/capital/resource.vue'),
      },
      {
        path: 'rechargeNum/:companyId/:title',
        name: 'rechargeNum',
        component: () => import('./views/finance/capital/rechargeNum.vue'),
        meta: {
          title: '充值记录'
        }
      },
      {
        path: 'payRank',
        name: 'payRank',
        component: () => import('./views/finance/capital/payRank.vue'),
        meta: {
          title: '消费记录'
        }
      },
      {
        path: 'withdraw/:companyId/:title',
        name: 'withdraw',
        component: () => import('./views/finance/capital/withdraw.vue'),
        meta: {
          title: '提现记录'
        }
      },
      {
        path: 'consume',
        name: 'consume',
        component: () => import('./views/finance/capital/consume.vue'),
        meta: {
          title: '结算记录'
        }
      },
      {
        path: 'withdrawDetail/:id',
        name: 'withdrawDetail',
        component: () => import('./views/finance/capital/withdrawDetail.vue'),
        meta: {
          title: '提现详情'
        }
      },
      {
        path: 'withdrawalBill/:id',
        name: 'withdrawalBill',
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
    path: '/finance/examine/detail/:id?',
    name: 'finance-examine-detail',
    component: () => import('./views/finance/examine/detail.vue')
  },
  {
    path: '/finance/examine/edit/:id?',
    name: 'finance-examine-edit',
    component: () => import('./views/finance/examine/edit.vue')
  },
] as any[]
