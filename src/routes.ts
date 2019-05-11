import home from './views/home.vue'
import login from './views/login.vue'
import MainLayout from './views/layout/MainLayout.vue'
import Error from './views/error/index.vue'

import { RouteConfig, Route } from 'vue-router'
import { devInfo, devError } from './util/dev'

/**
 * meta 类型：基础类型，可以放一些别的成员
 */
// tslint:disable-next-line:no-empty-interface
interface RouteMetaBase {
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

  // 基础数据 - 日历设置 - 列表
  {
    path: '/data/calendar/',
    name: 'data-calendar',
    component: () => import('./views/data/calendar/index.vue'),
    meta: {
      authKey: 'basis.calendars:list'
    }
  },

  // 基础数据 - 院线管理 - 列表
  {
    path: '/data/cinema-chain/',
    name: 'data-cinema-chain',
    component: () => import('./views/data/cinema-chain/index.vue'),
    meta: {
      authKey: 'theater.chains:list'
    }
  },

  // 基础数据 - 影院管理 - 列表
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
          authKey: 'theater.cinemas:list',
          title: '影院管理',
          fixed: true,
        }
      },
      {
        path: '/data/cinema-hall/:id',
        name: 'data-cinema-hall',
        component: () => import('./views/data/cinema-hall/index.vue'),
        meta: {
          authKey: 'theater.halls:list',
          title: '影厅列表',
        }
      },
    ]
  },

  // 基础数据 - 影片管理 - 列表
  {
    path: '/data/film/',
    name: 'data-film',
    component: () => import('./views/data/film/index.vue'),
    meta: {
      authKey: 'theater.movies:list'
    }
  },

  // 基础数据 - 影片管理 - 详情
  {
    path: '/data/film/detail/:id',
    name: 'data-film-detail',
    component: () => import('./views/data/film/detail.vue'),
    meta: {
      authKey: 'theater.movies:info'
    }
  },

  // 基础数据 - 地区信息 - 列表
  {
    path: '/data/area/',
    name: 'data-area',
    component: () => import('./views/data/area/index.vue'),
    meta: {
      authKey: 'basis.districts:list'
    }
  },

  // 财务管理 - 充值审核 - 列表
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
      authKey: 'finance.recharges:list'
    }
  },

  // 财务管理 - 充值审核 - 详情
  {
    path: '/contract/list/detail/:id/:approveStatus/:edi?',
    name: 'contract-list-detail',
    component: () => import('./views/contract/list/detail.vue'),
    meta: {
      authKey: 'finance.recharges:info'
    }
  },

  // 财务管理 - 充值审核 - 新建充值
  // TODO: id 不应该存在！
  {
    path: '/finance/examine/edit/:id?',
    name: 'finance-examine-edit',
    component: () => import('./views/finance/examine/edit.vue'),
    meta: {
      authKey: 'finance.recharges:add'
    }
  },

  // 资金管理
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
          authKey: 'finance.advertiser:statistics',
          title: '广告主系统',
          fixed: true,
        }
      },
      {
        path: 'resource',
        name: 'finance-capital-resource',
        component: () => import('./views/finance/capital/resource.vue'),
        meta: {
          authKey: 'finance.resource:statistics',
          title: '资源方系统',
          fixed: true,
        }
      },
      {
        path: 'rechargeNum/:companyId/:title',
        name: 'finance-capital-rechargeNum',
        component: () => import('./views/finance/capital/rechargeNum.vue'),
        meta: {
          authKey: 'finance.recharges:list',
          title: '充值记录'
        }
      },
      {
        path: 'payRank/:companyId/:title',
        name: 'finance-capital-payRank',
        component: () => import('./views/finance/capital/payRank.vue'),
        meta: {
          authKey: 'finance.advertiser:consumes',
          title: '消费记录'
        }
      },
      {
        path: 'consume/:companyId/:title',
        name: 'finance-capital-consume',
        component: () => import('./views/finance/capital/consume.vue'),
        meta: {
          authKey: 'finance.resource:settlements-list',
          title: '结算记录'
        }
      },
      {
        path: 'withdraw/:companyId/:title',
        name: 'finance-capital-withdraw',
        component: () => import('./views/finance/capital/withdraw.vue'),
        meta: {
          authKey: 'finance.resource:withdrawals-list',
          title: '提现记录'
        }
      },
      {
        path: 'withdrawDetail/:id',
        name: 'finance-capital-withdrawDetail',
        component: () => import('./views/finance/capital/withdrawDetail.vue'),
        meta: {
          authKey: 'finance.resource:withdrawals-info',
          title: '提现详情'
        }
      },
      {
        path: 'withdrawalBill/:id/:show',
        name: 'finance-capital-withdrawalBill',
        component: () => import('./views/finance/capital/withdrawalBill.vue'),
        meta: {
          authKey: 'finance.resource:withdrawals',
          title: '添加提现账单'
        }
      }
    ]
  },

  // 合同管理 - 合同列表
  {
    path: '/contract/list/',
    name: 'contract-list',
    component: () => import('./views/contract/list/index.vue'),
    meta: {
      authKey: 'customer.contracts:list'
    }
  },

  // 合同管理 - 新建、编辑合同
  {
    path: '/finance/examine/detail/:id/:approvalStatus',
    name: 'finance-examine-detail',
    component: () => import('./views/finance/examine/detail.vue'),
    meta: {
      authKey(route) {
        const isEdit = parseInt(route.params.id, 10) > 0
        return isEdit ? 'customer.contracts:modify' : 'customer.contracts:add'
      }
    }
  },

  // 合同管理 - 详情
  {
    path: '/contract/list/detail/:id?',
    name: 'contract-list-detail',
    component: () => import('./views/contract/list/detail.vue'),
    meta: {
      authKey: 'customer.contracts:info'
    }
  },

  // 广告管理 - 计划管理
  {
    path: '/plan/ggtising',
    name: 'plan-ggtising',
    component: () => import('./views/plan/plan/index.vue'),
    meta: {
      authKey: 'advert.plans:list'
    }
  },

  // 广告管理 - 计划管理 - 详情、审核
  {
    path: '/plan/ggtising/edit/:edit/:id',
    name: 'plan-ggtising-edit',
    component: () => import('./views/plan/plan/detail.vue'),
    meta: {
      authKey(route) {
        const isDetail = route.params.edit == 'detail'
        return isDetail ? 'advert.plans:info' : 'advert.plans:approval'
      }
    }
  },

  // TODO: 可能没用，应该删掉
  {
    path: '/plan/ggtising/cinema/:id',
    name: 'plan-ggtising-cinema',
    component: () => import('./views/plan/plan/cinema.vue'),
    meta: {
      authKey: ''
    }
  },

  // 广告管理 - 广告片管理 - 列表
  {
    path: '/gg/film',
    name: 'gg-film',
    component: () => import('./views/plan/film/index.vue'),
    meta: {
      authKey: 'advert.videos:list'
    }
  },

  // 广告片管理 - 列表
  {
    path: '/gg/film/detail/:id/:status',
    name: 'gg-film-detail',
    component: () => import('./views/plan/film/detail.vue'),
    meta: {
      authKey(route) {
        // 只有 1 才是待审核，才需要审核
        const isDetail = parseInt(route.params.status, 10) > 1
        return isDetail ? 'advert.videos:info' : 'advert.videos:approval'
      }
    }
  },

  // 刊例价管理 - 列表
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
          authKey: 'advert.cpms:list-for-platform',
          title: '平台刊例价',
          fixed: true,
        }
      },
      {
        path: 'corp',
        name: 'resource-management-corp',
        component: () => import('./views/resource/management/corp.vue'),
        meta: {
          authKey: 'advert.cpms:list-for-company',
          title: '公司刊例价',
          fixed: true,
        }
      },
      {
        path: 'realtime',
        name: 'resource-management-realtime',
        component: () => import('./views/resource/management/realtime.vue'),
        meta: {
          authKey: 'advert.cpms:lowest',
          title: '实时刊例价查询',
          fixed: true,
        }
      },
    ]
  },

  // 刊例价管理 - 添加、编辑
  {
    path: '/resource/management/edit/:id?',
    name: 'resource-management-edit',
    component: () => import('./views/resource/management/edit.vue'),
    meta: {
      authKey(route) {
        const isEdit = parseInt(route.params.id, 10) > 0
        return isEdit ? 'customer.contracts:modify' : 'customer.contracts:add'
      }
    }
  },

  // 系统设置 - 财务设置
  {
    path: '/system/setup',
    name: 'system-setup',
    component: () => import('./views/system/setup/index.vue'),
    meta: {
      authKey: 'finance.settings:default'
    }
  },

  // 订单管理 - 订单列表
  {
    path: '/order/list',
    name: 'order-list',
    component: () => import('./views/order/list/index.vue'),
    meta: {
      authKey: 'advert.executeOrder:list'
    }
  },

  // 订单管理 - 详情
  {
    path: '/order/list/:id/:status',
    name: 'order-list-detail',
    component: () => import('./views/order/list/detail.vue'),
    meta: {
      authKey: 'advert.executeOrder:info'
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
