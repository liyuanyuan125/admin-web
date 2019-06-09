import home from './views/home.vue'
import login from './views/login.vue'
import MainLayout from '@/components/mainLayout'
import Error from './views/error/index.vue'

import { RouteConfig, Route } from 'vue-router'
import { devInfo, devError } from './util/dev'

/**
 * meta对象 title属性参数 新建和编辑切换
 */
// export type editFunction = (route: Route) => string

/**
 * meta 类型：基础类型，可以放一些别的成员
 */
// tslint:disable-next-line:no-empty-interface
interface RouteMetaBase {
  /** 页面标题 */
  title?: string | ((route: Route) => string)
  [key: string]: any
}

/**
 * meta 类型成员，标记是否不需要登录，与 authKey 互斥
 */
export interface RouteMetaUnauth extends RouteMetaBase {
  /**
   * 标记是否不需要登录（注意不是不需要验证）
   */
  unauth: true
}

/**
 * RouteMetaAuth 中 authKey 也可以为函数，该函数即是它的签名
 * @param route 当前页面的 route
 * @returns 权限字符串
 */
export type AuthKeyFunction = (route: Route) => string

/**
 * meta 类型成员，标记权限对应的 key，与 unauth 互斥
 */
export interface RouteMetaAuth extends RouteMetaBase {
  /**
   * 权限对应的全路径 key，用来权限控制
   */
  authKey: string | AuthKeyFunction
}

/** 标记不需要登录 */
const unauth: RouteMetaUnauth = {
  unauth: true
}

/** 占位，不需要验证 */
const emptyAuth: RouteMetaAuth = {
  authKey: ''
}

/** 标准化 Meta 的类型 */
export type RouteMeta = RouteMetaUnauth | RouteMetaAuth

/**
 * 重新定义 meta，使 meta 的类型更具体
 */
export interface RouteConfigEnhance extends RouteConfig {
  /** 附加信息，完善类型 */
  meta?: RouteMeta
  /** 增强 children 的类型 */
  children?: RouteConfigEnhance[]
}



/**
 * 单独的 routes
 *
 * 请注意，相似的路径写在一起，并用「一个」空行隔开
 */
const singleRoutes: RouteConfigEnhance[] = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: unauth
  }
] // end of singleRoutes

/**
 * 放在 mainLayout 中的 routes
 *
 * 请注意，相似的路径写在一起，并用「一个」空行隔开
 *
 * TODO: 所有页面均要平坦化，不要使用 children
 * 若需要使用 children，下面注入「没有权限」的代码也需要修改
 */
const mainLayoutRoutes: RouteConfigEnhance[] = [
  // 首页
  {
    path: '/',
    name: 'home',
    component: home,
    meta: emptyAuth,
  },

  // 示例，没有实际用处
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */'./views/about.vue'),
    meta: emptyAuth,
  },

  // 客户管理 - 账号管理 - 列表
  {
    path: '/client/account/',
    name: 'client-account',
    component: () => import('./views/client/account/index.vue'),
    meta: {
      authKey: 'customer.accounts:list'
    }
  },

  // 客户管理 - 账号管理 - 详情
  {
    path: '/client/account/detail/:id?',
    name: 'client-account-detail',
    component: () => import('./views/client/account/detail.vue'),
    meta: {
      authKey: 'customer.accounts:info'
    }
  },

  // 客户管理 - 账号管理 - 查看操作日志
  {
    path: '/client/account/viewLog/:id?',
    name: 'client-account-viewLog',
    component: () => import('./views/client/account/viewLog.vue'),
    meta: emptyAuth
  },

  // 客户管理 - 公司管理 - 列表
  {
    path: '/client/corp/',
    name: 'client-corp',
    component: () => import('./views/client/corp/index.vue'),
    meta: {
      authKey: 'customer.companies:list'
    }
  },

  // 客户管理 - 公司管理 - 添加、编辑
  {
    path: '/client/corp/edit/:id?',
    name: 'client-corp-edit',
    component: () => import('./views/client/corp/edit.vue'),
    meta: {
      authKey(route) {
        const isEdit = parseInt(route.params.id, 10) > 0
        return isEdit ? 'customer.companies:modify' : 'customer.companies:add'
      }
    }
  },

  // 客户管理 - 公司管理 - 详情
  {
    path: '/client/corp/detail/:id?',
    name: 'client-corp-detail',
    component: () => import('./views/client/corp/detail.vue'),
    meta: {
      authKey: 'customer.companies:info'
    }
  },

  // 客户管理 - 变更工单 - 列表
  {
    path: '/client/order/',
    name: 'client-order',
    component: () => import('./views/client/order/index.vue'),
    meta: {
      authKey: 'customer.workorders:list'
    }
  },

  // 客户管理 - 变更工单 - 详情、审核
  {
    path: '/client/order/detail/:id?',
    name: 'client-order-detail',
    component: () => import('./views/client/order/detail.vue'),
    meta: {
      authKey: 'customer.workorders:info'
    }
  },

  // 客户管理 - 影片关联 - 列表
  {
    path: '/client/film/',
    name: 'client-film',
    component: () => import('./views/client/film/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 客户管理 - 影片关联 - 添加
  {
    path: '/client/film/edit',
    name: 'client-film-edit',
    component: () => import('./views/client/film/detail.vue'),
    meta: {
      authKey: ''
    }
  },

  // 客户管理 - 影片关联 - 详情
  {
    path: '/client/film/detail/:id?',
    name: 'client-film-detail',
    component: () => import('./views/client/film/detail.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - 系统字典 - 分类列表
  {
    path: '/data/dict/',
    name: 'data-dict',
    component: () => import('./views/data/dict/index.vue'),
    meta: {
      authKey: 'basis.dictionarys:categorie-list'
    }
  },

  // 基础数据 - 系统字典 - 查看字典
  {
    path: '/data/dict/viewDictionary/:id?',
    name: 'data-dict-viewDictionary',
    component: () => import('./views/data/dict/viewDictionary.vue'),
    meta: {
      authKey: 'basis.dictionarys:list'
    }
  },

  {
    path: '/data/area/',
    name: 'data-area',
    component: () => import('./views/data/area/index.vue'),
    meta: {
      authKey: ''
    }
  },

  {
    path: '/data/calendar/',
    name: 'data-calendar',
    component: () => import('./views/data/calendar/index.vue'),
    meta: {
      authKey: ''
    }
  },

  {
    path: '/data/cinema-chain/',
    name: 'data-cinema-chain',
    component: () => import('./views/data/cinema-chain/index.vue'),
    meta: {
      authKey: ''
    }
  },

  {
    path: '/data/cinema/',
    name: 'data-cinema',
    component: () => import('./views/data/cinema/index.vue'),
    meta: {
      authKey: 'theater.cinemas:list',
      title: '影院管理',
      fixed: true,
    }
  },

  // 基础数据 - 影院管理 - 影厅列表
  {
    path: '/data/cinema-hall/:id',
    name: 'data-cinema-hall',
    component: () => import('./views/data/cinema-hall/index.vue'),
    props: true,
    meta: {
      authKey: 'theater.halls:list',
      title: '影厅列表',
    }
  },
  // 基础数据 - 影片管理（修改原有功能）
  {
    path: '/data/film/',
    name: 'data-film',
    component: () => import('./views/data/film/index.vue'),
    meta: {
      authKey: '',
      title: '影片管理'
    }
  },
  {
    path: '/data/film/detail/:id',
    name: 'data-film-detail',
    component: () => import('./views/data/film/detail.vue'),
    meta: {
      authKey: '',
      title: '详情'
    }
  },
  {
    path: 'data/film/edit/:id',
    name: 'data-film-edit',
    component: () => import('./views/data/film/edit.vue'),
    meta: {
      authKey: '',
      title: '编辑'
    }
  },

  // 基础数据 - 影人管理
  {
    path: 'data/person',
    name: 'data-person',
    component: () => import('./views/data/person/index.vue'),
    meta: {
      authKey: '',
      title: '影人管理'
    }
  },

  // 基础数据 - 影人管理 - 详情
  {
    path: 'data/person/detail/:id',
    name: 'data-person-detail',
    component: () => import('./views/data/person/detail.vue'),
    meta: {
      authKey: '',
      title: '查看'
    }
  },

  // 基础数据 - 影人管理 - 编辑
  {
    path: 'data/person/edit/:id',
    name: 'data-person-edit',
    component: () => import('./views/data/person/edit.vue'),
    meta: {
      authKey: '',
      title: '编辑'
    }
  },


  {
    path: '/data/kol-account/',
    name: 'kol-account-list',
    component: () => import('./views/data/kol-account/index.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/data/kol-account/detail/:id/:status',
    name: 'kol-account-detail',
    component: () => import('./views/data/kol-account/detail.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/contract/list/',
    name: 'contract-list',
    component: () => import('./views/contract/list/index.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/contract/list/edit/:id?',
    name: 'contract-list-edits',
    component: () => import('./views/contract/list/edit.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/contract/list/edit/:id/:copy?',
    name: 'contract-list-edit',
    component: () => import('./views/contract/list/edit.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/contract/list/detail/:id/:approveStatus/:edi?',
    name: 'contract-list-detail',
    component: () => import('./views/contract/list/detail.vue'),
    meta: {
      authKey: ''
    }
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
          authKey: '',
          title: '广告主系统',
          fixed: true,
        }
      },
      {
        path: 'resource',
        name: 'finance-capital-resource',
        component: () => import('./views/finance/capital/resource.vue'),
        meta: {
          authKey: '',
          title: '资源方系统',
          fixed: true,
        }
      },
      {
        path: 'rechargeNum/:companyId/:title',
        name: 'finance-capital-rechargeNum',
        component: () => import('./views/finance/capital/rechargeNum.vue'),
        meta: {
          authKey: '',
          title: '充值记录'
        }
      },
      {
        path: 'payRank/:companyId/:title',
        name: 'finance-capital-payRank',
        component: () => import('./views/finance/capital/payRank.vue'),
        meta: {
          authKey: '',
          title: '消费记录'
        }
      },
      {
        path: 'withdraw/:companyId/:title',
        name: 'finance-capital-withdraw',
        component: () => import('./views/finance/capital/withdraw.vue'),
        meta: {
          authKey: '',
          title: '提现记录'
        }
      },
      {
        path: 'consume/:companyId/:title',
        name: 'finance-capital-consume',
        component: () => import('./views/finance/capital/consume.vue'),
        meta: {
          authKey: '',
          title: '结算记录'
        }
      },
      {
        path: 'withdrawDetail/:id',
        name: 'finance-capital-withdrawDetail',
        component: () => import('./views/finance/capital/withdrawDetail.vue'),
        meta: {
          authKey: '',
          title: '提现详情'
        }
      },
      {
        path: 'withdrawalBill/:id/:show',
        name: 'finance-capital-withdrawalBill',
        component: () => import('./views/finance/capital/withdrawalBill.vue'),
        meta: {
          authKey: '',
          title: '添加提现账单'
        }
      }
    ]
  },

  {
    path: '/finance/examine/',
    name: 'finance-examine',
    component: () => import('./views/finance/examine/index.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/finance/examine/detail/:id/:approvalStatus',
    name: 'finance-examine-detail',
    component: () => import('./views/finance/examine/detail.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/finance/examine/edit/:id?',
    name: 'finance-examine-edit',
    component: () => import('./views/finance/examine/edit.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/plan/ggtising',
    name: 'plan-ggtising',
    component: () => import('./views/plan/plan/index.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/plan/ggtising/edit/:edit/:id',
    name: 'plan-ggtising-edit',
    component: () => import('./views/plan/plan/detail.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/plan/ggtising/cinema/:id',
    name: 'plan-ggtising-cinema',
    component: () => import('./views/plan/plan/cinema.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/gg/film',
    name: 'gg-film',
    component: () => import('./views/plan/film/index.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/gg/film/detail/:id/:status',
    name: 'gg-film-detail',
    component: () => import('./views/plan/film/detail.vue'),
    meta: {
      authKey: ''
    }
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
          authKey: '',
          title: '平台刊例价',
          fixed: true,
        }
      },
      {
        path: 'corp',
        name: 'resource-management-corp',
        component: () => import('./views/resource/management/corp.vue'),
        meta: {
          authKey: '',
          title: '公司刊例价',
          fixed: true,
        }
      },
      {
        path: 'realtime',
        name: 'resource-management-realtime',
        component: () => import('./views/resource/management/realtime.vue'),
        meta: {
          authKey: '',
          title: '实时刊例价查询',
          fixed: true,
        }
      },
    ]
  },
  {
    path: '/resource/management/edit/:id?',
    name: 'resource-management-edit',
    component: () => import('./views/resource/management/edit.vue'),
    meta: {
      authKey: ''
    }
  },

  // kol平台账号资源管理
  {
    path: '/resource/kolplatform/list',
    name: 'resource-kolplatform-list',
    component: () => import('./views/resource/kolPlatform/index.vue'),
    meta: {
      authKey: '',
      title: 'KOL平台账号资源管理',
      fixed: true
    }
  },

  //  kol平台账号资源管理 - 查看
  {
    path: '/resource/kolplatform/detail/:id',
    name: 'resource-kolplatform-list-detail',
    component: () => import('./views/resource/kolPlatform/details.vue'),
    meta: {
      authKey: '',
      title: '查看',
    }
  },

  //  kol平台账号资源管理 - 审核
  {
    path: '/resource/kolplatform/audit/:id',
    name: 'resource-kolplatform-list-audit',
    component: () => import('./views/resource/kolPlatform/audit.vue'),
    meta: {
      authKey: '',
      title: '审核',
    }
  },

  // 影片资源管理
  {
    path: '/resource/film/index',
    name: 'resource-film-index',
    component: () => import('./views/resource/film/index.vue'),
    meta: {
      authKey: '',
      title: '影片资源管理'
    }
  },

  // 影片资源管理 新建 和编辑
  {
    path: '/resource/film/edit/:id?',
    name: 'resource-film-index-edit',
    component: () => import('./views/resource/film/edit.vue'),
    meta: {
      authKey: '',
      title({params}) {
        return params.id as any > 0 ? '编辑' : '新建'
      }
    }
  },
  // 影片资源管理 - 查看 和 审核
  {
    path: '/resource/film/detail/:id/:audit?',
    name: 'resource-film-index-detail',
    component: () => import('./views/resource/film/detail.vue'),
    meta: {
      authKey: '',
      title({params}) {
        return params.audit ? '审核' : '查看'
      }
    }
  },

  // 影片资源管理 - 审核
  // {
  //   path: '/resource/film/audit',
  //   name: 'resource-film-index-audit',
  //   component: () => import('./views/resource/film/audit.vue'),
  //   meta: {
  //     authKey: '',
  //     title: '审核'
  //   }
  // },

  {
    path: '/system/setup',
    name: 'system-setup',
    component: () => import('./views/system/setup/index.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/order/list',
    name: 'order-list',
    component: () => import('./views/order/list/index.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/order/list/:id/:status',
    name: 'order-list-detail',
    component: () => import('./views/order/list/detail.vue'),
    meta: {
      authKey: ''
    }
  },
  // 订单列表 - kol
  {
    path: '/order/kollist',
    name: 'order-kollist',
    component: () => import('./views/order/kollist/index.vue'),
    meta: {
      authKey: ''
    }
  },
  // 订单列表详情 - kol
  {
    path: '/order/kollist/detail/:id/:orders',
    name: 'order-kollist-detail',
    component: () => import('./views/order/kollist/detail.vue'),
    meta: {
      authKey: ''
    }
  },
  // 退款订单列表 - kol
  {
    path: '/order/refund',
    name: 'order-refund',
    component: () => import('./views/order/refund/index.vue'),
    meta: {
      authKey: ''
    }
  },
   // 退款订单添加/详情 - kol
  {
    path: '/order/refund/detail/:id/:order',
    name: 'order-refund-detail',
    component: () => import('./views/order/refund/detail.vue'),
    meta: {
      authKey: ''
    }
  },
  // 影片资源合作订单 - 列表
  {
    path: '/order/filmorder',
    name: 'order-filmorder',
    component: () => import('./views/order/filmorder/index.vue'),
    meta: {
      authKey: ''
    }
  },
  // 影片资源合作订单 - 上传资源
  {
    path: '/order/filmorder/addfile',
    name: 'order-filmorder-addfile',
    component: () => import('./views/order/filmorder/addfile.vue'),
    meta: {
      authKey: ''
    }
  },
  // 付款单管理 - 列表
  {
    path: '/payment/order',
    name: 'payment-order',
    component: () => import('./views/payment/order/index.vue'),
    meta: {
      authKey: ''
    }
  },
  // 影片资源合作订单 - 影片审核/详情
  {
    path: '/order/filmorder/filmexamine/:id/:status',
    name: 'order-filmorder-filmexamine',
    component: () => import('./views/order/filmorder/filmexamine.vue'),
    meta: {
      authKey: ''
    }
  },
  // 付款单管理 - 收款 详情
  {
    path: '/payment/order/:edit/:id',
    name: 'payment-order-edit',
    component: () => import('./views/payment/order/edit.vue'),
    meta: {
      authKey: ''
    }
  },
  // 映前广告计划 - 列表
  {
    path: '/order/beforeplan',
    name: 'order-beforeplan',
    component: () => import('./views/order/beforeplan/index.vue'),
    meta: {
      authKey: ''
    }
  },
  // 映前广告计划 - 详情
  {
    path: '/order/beforeplan/detail/:id/:status',
    name: 'order-beforeplan-detail',
    component: () => import('./views/order/beforeplan/detail.vue'),
    meta: {
      authKey: ''
    }
  },
  // 映前广告监播 - 列表
  {
    path: '/order/supervision',
    name: 'order-supervision',
    component: () => import('./views/order/supervision/index.vue'),
    meta: {
      authKey: ''
    }
  },
  // 映前广告监播 - 列表详情
  {
    path: '/order/supervision/detail/:id',
    name: 'order-supervision-detail',
    component: () => import('./views/order/supervision/detail.vue'),
    meta: {
      authKey: ''
    }
  },
] // end of mainLayoutRoutes

const errorRoutes: RouteConfigEnhance[] = [
  {
    path: '*',
    name: '404',
    component: Error,
    props: { code: 404 },
    meta: unauth
  }
]

// 将「没有权限」注入到 routes
const take403 = (list: RouteConfigEnhance[]) => {
  const routesWith403 = list.map(it => {
    // 暂时不对含有 components 的组件进行操作
    if (it.components != null) {
      devError(`[config] ${it.name} has components, pass`)
      return it
    }

    const components: any = {
      default: it.component,
      403: Error,
    }

    const result: RouteConfigEnhance = {
      ...it,
      components,
      props: {
        default: it.props || {},
        403: { code: 403 }
      }
    }
    delete result.component

    // 处理子级
    if (it.children && it.children.length > 0) {
      result.children = take403(it.children)
    }

    return result
  })

  return routesWith403
}

// 将「没有权限」注入到 mainLayoutRoutes 中
const mainLayoutRoutesWith403 = take403(mainLayoutRoutes)

const routes: RouteConfig[] = [
  ...singleRoutes,
  {
    path: '/',
    component: MainLayout,
    children: mainLayoutRoutesWith403
  },
  ...errorRoutes,
]

export default routes
