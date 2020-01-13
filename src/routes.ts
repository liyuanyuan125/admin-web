import home from './views/home.vue'
import login from './views/login.vue'
import MainLayout from '@/components/mainLayout'
import Error from './views/error/index.vue'
import { MapType } from '@/util/types'
import { stringToBoolean, castArray } from '@/fn/typeCast'
import { RouteConfig, Route } from 'vue-router'
import { parse } from '@/fn/array'
import { devInfo, devError } from './util/dev'

/**
 * 处理 route 中的参数类型
 * @param config 配置
 */
const paramTypes = (
  config: MapType<NumberConstructor | BooleanConstructor | StringConstructor | ArrayConstructor>
) => {
  return ({ params }: Route) => {
    const props = Object.entries(config)
    .reduce((map, [key, type]) => {
      const strVal = params[key]
      const value = type === Number
        ? (+strVal || 0)
        : type === Boolean
        ? stringToBoolean(strVal)
        : type === Array
        ? castArray(parse(strVal))
        : strVal
      map[key] = value
      return map
    }, {} as MapType<any>)
    return props
  }
}

const idProps = paramTypes({ id: Number })

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
  /**
   * 面包屑导航 route name 列表
   * 只需设置中间的 route name 就行，页面本身与主导航，会自动添加
   */
  breadcrumbs?: string[]
  /**
   * 侧栏菜单选中的菜单项，若自动判断不能起作用，可设置该项
   */
  siderNav?: string
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
    path: '/client/account',
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
    path: '/client/corp',
    name: 'client-corp',
    component: () => import('./views/client/corp/index.vue'),
    meta: {
      authKey: 'customer.companies:list'
    }
  },

  // 客户管理 - 广告主管理 - 列表
  {
    path: '/client/ggiser',
    name: 'client-ggiser',
    component: () => import('./views/client/ggiser/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 客户管理 - 广告主管理 - 审核
  {
    path: '/client/ggiser/edit/:id?',
    name: 'client-ggiser-edit',
    component: () => import('./views/client/ggiser/edit.vue'),
    meta: {
      authKey: ''
    }
  },

    // 客户管理 - 广告主管理 - 详情
  {
    path: '/client/ggiser/detail/:id?',
    name: 'client-ggiser-detail',
    component: () => import('./views/client/ggiser/detail.vue'),
    meta: {
      authKey: ''
    }
  },

  // 客户管理 - 资源方管理 - 列表
  {
    path: '/client/resource',
    name: 'client-resource',
    component: () => import('./views/client/resource/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 客户管理 - 资源方管理 - 编辑
  {
    path: '/client/resource/edit/:id?',
    name: 'client-resource-edit',
    component: () => import('./views/client/resource/edit.vue'),
    meta: {
      authKey: ''
    }
  },

    // 客户管理 - 资源方管理 - 详情
  {
    path: '/client/resource/detail/:id?',
    name: 'client-resource-detail',
    component: () => import('./views/client/resource/detail.vue'),
    meta: {
      authKey: ''
    }
  },

  // 客户管理 - 片商管理 - 列表
  {
    path: '/client/producers',
    name: 'client-producers',
    component: () => import('./views/client/producers/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 客户管理 - 片商管理 - 编辑
  {
    path: '/client/producers/edit/:id?',
    name: 'client-producers-edit',
    component: () => import('./views/client/producers/edit.vue'),
    meta: {
      authKey: ''
    }
  },

    // 客户管理 - 片商管理 - 详情
  {
    path: '/client/producers/detail/:id?',
    name: 'client-producers-detail',
    component: () => import('./views/client/producers/detail.vue'),
    meta: {
      authKey: ''
    }
  },

   // 客户管理 - 区代管理 - 列表
   {
    path: '/client/replace',
    name: 'client-replace',
    component: () => import('./views/client/replace/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 客户管理 - 区代管理 - 编辑
  {
    path: '/client/replace/edit/:id?',
    name: 'client-replace-edit',
    component: () => import('./views/client/replace/edit.vue'),
    meta: {
      authKey: ''
    }
  },

    // 客户管理 - 区代管理 - 详情
  {
    path: '/client/replace/detail/:id?',
    name: 'client-replace-detail',
    component: () => import('./views/client/replace/detail.vue'),
    meta: {
      authKey: ''
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
    path: '/client/order',
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
    path: '/client/film',
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

  // 客户管理 - 品牌关联
  {
    path: '/client/brand',
    name: 'client-brand',
    component: () => import('./views/client/brand/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 客户管理 - 品牌关联 - 详情&审核
  {
    path: '/client/brand/detail/:id',
    name: 'client-brand-detail',
    component: () => import('./views/client/brand/detail.vue'),
    props: true,
    meta: {
      authKey: ''
    }
  },

  // 客户管理 - 留言本
  {
    path: '/client/message',
    name: 'client-message',
    component: () => import('./views/client/message/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 客户管理 - 签约影院
  {
    path: '/client/signedCinema',
    name: 'client-signed-cinema',
    component: () => import('./views/client/signed-cinema/index.vue'),
    meta: {
      authKey: '',
      title: '签约影院管理'
    }
  },

  // 基础数据 - 系统字典 - 分类列表
  {
    path: '/data/dict',
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

  // 基础数据 - 品牌管理 - 品牌列表
  {
    path: '/data/brand',
    name: 'data-brand',
    component: () => import('./views/data/brand/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - 品牌管理 - 编辑社交平台
  {
    path: '/data/brand/platformedit/:brandId',
    name: 'data-brand-platformedit',
    component: () => import('./views/data/brand/platformedit.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - 品牌管理 - 查看社交平台
  {
    path: '/data/brand/platformdetail/:brandId',
    name: 'data-brand-platformdetail',
    component: () => import('./views/data/brand/platformdetail.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - 品牌管理 - 新建品牌
  {
    path: '/data/brand/brandedit/:id?',
    name: 'data-brand-brandedit',
    component: () => import('./views/data/brand/brandedit.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - 品牌管理 - 编辑品牌
  {
    path: '/data/brand/brandetail/:brandId?',
    name: 'data-brand-brandetail',
    component: () => import('./views/data/brand/brandDetail.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - 品牌管理 - 查看门店
  {
    path: '/data/brand/shopdetail/:brandId',
    name: 'data-brand-shopdetail',
    component: () => import('./views/data/brand/shopdetail.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - 品牌管理 - 编辑门店
  {
    path: '/data/brand/shopedit/:brandId',
    name: 'data-brand-shopedit',
    component: () => import('./views/data/brand/shopedit.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - 品牌管理 - 产品 - 查看 - 列表
  {
    path: '/data/brand/product/viewlist/:brandId',
    name: 'data-brand-product-view-list',
    component: () => import('./views/data/brand/product/viewList.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - 品牌管理 - 产品 - 编辑 - 列表
  {
    path: '/data/brand/product/modifylist/:brandId',
    name: 'data-brand-product-modify-list',
    component: () => import('./views/data/brand/product/modifyList.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - 品牌管理 - 产品 - 编辑 - 详情
  {
    path: '/data/brand/product/detail/:id?/:brandId/:action',
    name: 'data-brand-product-detail',
    component: () => import('./views/data/brand/product/detail.vue'),
    meta: {
      authKey: '',
      title({ params: { action } }) {
        switch (action) {
          case 'view':
            return '查看'
          case 'edit':
            return '编辑'
          default:
            return '添加新产品'
        }
      }
    },
    props: paramTypes({ id: Number, brandId: Number, action: String })
  },

  // 基础数据 - kol平台关联 - 列表
  {
    path: '/data/kol/associated',
    name: 'data-kol-associated',
    component: () => import('./views/data/kol/associated.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - kol平台关联 - 列表
  {
    path: '/data/kol/associated/edit/:id?',
    name: 'data-kol-associated-edit',
    component: () => import('./views/data/kol/edit.vue'),
    meta: {
      authKey: ''
    }
  },

  // 基础数据 - kol平台关联 - 列表
  {
    path: '/data/kol/associated/detail/:id?',
    name: 'data-kol-associated-detail',
    component: () => import('./views/data/kol/detail.vue'),
    meta: {
      authKey: ''
    }
  },

  {
    path: '/data/area',
    name: 'data-area',
    component: () => import('./views/data/area/index.vue'),
    meta: {
      authKey: ''
    }
  },

  {
    path: '/data/calendar',
    name: 'data-calendar',
    component: () => import('./views/data/calendar/index.vue'),
    meta: {
      authKey: ''
    }
  },

  {
    path: '/data/cinema-chain',
    name: 'data-cinema-chain',
    component: () => import('./views/data/cinema-chain/index.vue'),
    meta: {
      authKey: ''
    }
  },

  {
    path: '/data/cinema',
    name: 'data-cinema',
    component: () => import('./views/data/cinema/index.vue'),
    meta: {
      authKey: 'theater.cinemas:list',
      title: '影院管理',
      fixed: true,
    }
  },

  {
    path: '/data/cinema/:action(new|edit|view)/:id?',
    name: 'data-cinema-edit',
    component: () => import('./views/data/cinema/edit.vue'),
    meta: {
      authKey({ params: { action } }) {
        const authMap: MapType = {
          new: 'theater.cinemas:add',
          edit: 'theater.cinemas:modify',
          view: '',
        }
        return authMap[action]
      },
      title({ params: { action } }) {
        const titleMap: MapType = {
          new: '新建',
          edit: '编辑',
          view: '查看',
        }
        return titleMap[action]
      },
      fixed: true,
    },
    props: paramTypes({ id: Number, action: String })
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
    path: '/data/film',
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
    },
    props: idProps
  },
  {
    path: 'data/film/edit/:id',
    name: 'data-film-edit',
    component: () => import('./views/data/film/edit.vue'),
    meta: {
      authKey: '',
      title: '编辑'
    },
    props: idProps
  },

  // 商务管理
  {
    path: 'data/business',
    name: 'data-business',
    component: () => import('./views/data/business/index.vue'),
    meta: {
      authKey: '',
      title: '商务管理'
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
    },
    props: idProps
  },

  // 基础数据 - 影人管理 - 编辑
  {
    path: 'data/person/edit/:id',
    name: 'data-person-edit',
    component: () => import('./views/data/person/edit.vue'),
    meta: {
      authKey: '',
      title: '编辑'
    },
    props: idProps
  },

  // KOL 平台账号
  {
    path: '/data/kol-account/:channel?',
    name: 'data-kol-account',
    component: () => import('./views/data/kol-account/index.vue'),
    meta: {
      authKey: ''
    },
    props: true,
  },

  // KOL 平台账号 - 编辑、审核
  {
    path: '/data/kol-account/edit/:id/:channel/:action',
    name: 'data-kol-account-edit',
    component: () => import('./views/data/kol-account/edit.vue'),
    meta: {
      authKey: '',
      title({ params: { action } }) {
        return action == 'view' ? '查看' : (action == 'edit' ? '编辑' : '审核')
      }
    },
    props: paramTypes({ id: Number, channel: String, action: String })
  },

  // 合同列表
  {
    path: '/contract/list',
    name: 'contract-list',
    component: () => import('./views/contract/list/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 合同编辑、审批、复制、详情
  {
    path: '/contract/:action(new|edit|view|audit|copy)/:id?',
    name: 'contract-edit',
    component: () => import('./views/contract/list/edit.vue'),
    meta: {
      authKey: '',
      title({ params: { action } }) {
        const actionTextMap: MapType = {
          new: '新建',
          edit: '编辑',
          view: '查看',
          audit: '审核',
          copy: '复制',
        }
        return actionTextMap[action]
      },
      breadcrumbs: [
        'contract-list'
      ]
    },
    props: paramTypes({ id: Number, action: String })
  },

  {
    path: '/contract/old',
    name: 'contract-list-old',
    component: () => import('./views/contract/list/old.vue'),
    meta: {
      authKey: ''
    }
  },

  {
    path: '/contract/list/edit/:id?',
    name: 'contract-list-edits',
    component: () => import('./views/contract/list/editold.vue'),
    meta: {
      authKey: ''
    }
  },
  {
    path: '/contract/list/edit/:id/:copy?',
    name: 'contract-list-edit',
    component: () => import('./views/contract/list/editold.vue'),
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
    path: '/finance/capital',
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

  // 财务管理 - 账号余额管理
  {
    path: '/finance/account/balance',
    name: 'finance-account-balance',
    component: () => import('./views/finance/account/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 财务管理 - 账号余额管理次数
  {
    path: '/finance/account/balance/detail/:time/:companyId/:transactionTypes',
    name: 'finance-account-balance-detail',
    component: () => import('./views/finance/account/detail.vue'),
    meta: {
      authKey: '',
      title({ params: { transactionTypes } }) {
        const title = ['查看充值明细', '查看消费明细', '查看退款明细', '查看提现明细']
        return title[(transactionTypes as any) - 1]
      }
    }
  },

   // 财务管理 - 账号余额充值
   {
    path: '/finance/account/balance/edit/:companyId',
    name: 'finance-account-balance-edit',
    component: () => import('./views/finance/account/edit.vue'),
    meta: {
      authKey: ''
    }
  },


  // 财务管理 - 账号余额管理
  {
    path: '/finance/balance/withdrawal',
    name: 'finance-balance-withdrawal',
    component: () => import('./views/finance/withdrawal/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 财务管理 - 账号余额审核汇款详情
  {
    path: '/finance/balance/withdrawal/:id/:status?',
    name: 'finance-balance-withdrawal-status',
    component: () => import('./views/finance/withdrawal/detail.vue'),
    meta: {
      authKey: ''
    }
  },


  // 财务管理 - 充值审核
  // {
  //   path: '/finance/examine',
  //   name: 'finance-examine',
  //   component: () => import('./views/finance/examine/index.vue'),
  //   meta: {
  //     authKey: ''
  //   }
  // },

  {
    path: '/finance/examine/newindex/:pay?',
    name: 'finance-examine',
    component: () => import('./views/finance/examine/newindex.vue'),
    meta: {
      authKey: ''
    },
    props: true,
  },

  // 财务管理 - 请款单管理
  {
    path: '/finance/payroll/:type?',
    name: 'finance-payroll',
    component: () => import('./views/finance/payroll/index.vue'),
    meta: {
      authKey: ''
    },
    props: true
  },

  // 财务管理 - 请款单管理
  {
    path: '/finance/payroll/detail/:id',
    name: 'finance-payroll-detail',
    component: () => import('./views/finance/payroll/auditdetail.vue'),
    meta: {
      authKey: ''
    },
    props: true
  },

  // 财务管理 - 账单余额管理
  {
    path: '/finance/balance',
    name: 'finance-balance',
    component: () => import('./views/finance/balance/index.vue'),
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

  // 财务管理 - 发票管理 - 销售发票
  {
    path: '/finance/invoice/sale',
    name: 'finance-invoice-sale',
    component: () => import('./views/finance/invoice/sale.vue'),
    meta: {
      authKey: '',
      title: '销售发票'
    },
    props: true,
  },

  // 财务管理 - 发票管理 - 销售发票 - 查看、编辑、审核
  {
    path: '/finance/invoice/sale/:action(new|view|audit)/:id?',
    name: 'finance-invoice-sale-edit',
    component: () => import('./views/finance/invoice/saleEdit.vue'),
    meta: {
      authKey: '',
      title({ params: { action } }) {
        const actionTextMap: MapType = {
          new: '开票',
          view: '查看',
          audit: '商务审核',
        }
        return actionTextMap[action]
      },
    },
    props: paramTypes({ action: String, id: Number })
  },

  // 财务管理 - 发票管理 - 采购发票
  {
    path: '/finance/invoice/purchase',
    name: 'finance-invoice-purchase',
    component: () => import('./views/finance/invoice/purchase.vue'),
    meta: {
      authKey: '',
      title: '采购发票'
    },
    props: true,
  },

  // 财务管理 - 发票管理 - 销售发票 - 查看
  {
    path: '/finance/invoice/purchase/view/:ids',
    name: 'finance-invoice-purchase-view',
    component: () => import('./views/finance/invoice/purchaseEdit.vue'),
    meta: {
      authKey: '',
      title: '查看',
    },
    props: paramTypes({ ids: Array })
  },

  // 财务管理 - 发票管理 - 销售发票 - 发票登记
  {
    path: '/finance/invoice/purchase/:action(new)/:ids/:businessType',
    name: 'finance-invoice-purchase-new',
    component: () => import('./views/finance/invoice/purchaseEdit.vue'),
    meta: {
      authKey: '',
      title: '发票登记'
    },
    // 当 action 为 view 时，是发票 ID，
    // 当 action 为 new 时，是数据 ID 列表
    // businessType: 业务类型：1 kol、2 映前广告
    props: paramTypes({ action: String, ids: Array, businessType: Number })
  },

  // 财务管理 - KOL付款单管理
  {
    path: '/finance/kol-payment/:channel?',
    name: 'finance-kol-payment',
    component: () => import('./views/finance/kol-payment/index.vue'),
    meta: {
      authKey: ''
    },
    props: true,
  },

  // 财务管理 - KOL付款单管理 - 查看、登记、付款
  {
    path: '/finance/kol-payment/edit/:id/:action',
    name: 'finance-kol-payment-edit',
    component: () => import('./views/finance/kol-payment/edit.vue'),
    meta: {
      authKey: '',
      title({ params: { action } }) {
        return action == 'view' ? '查看' : '财务付款'
      }
    },
    props: paramTypes({ id: Number, action: String })
  },

  // 财务管理 - 映前广告资源方账单管理 list
  {
    path: '/finance/billmanage',
    name: 'finance-billmanage',
    component: () => import('./views/finance/bill-manage/index.vue'),
    meta: {
      authKey: '',
      title: '资源方账单管理'
    }
  },
  // 财务管理 - 映前广告资源方账单管理 detail
  {
    path: '/finance/billmanage/detail/:id/:audit?',
    name: 'finance-billmanage-detail',
    component: () => import('./views/finance/bill-manage/detail.vue'),
    meta: {
      authKey: '',
      title({ params: { audit } }) {
        return !audit ? '查看' : '审核'
      }
    },
    props: paramTypes({ id: Number, audit: Number })
  },

  // 财务管理 - 映前广告资源方账单管理 - 运营确定账单
  {
    path: '/finance/billmanage/confirmbill/:id',
    name: 'finance-billmanage-confirmbill',
    component: () => import('./views/finance/bill-manage/confirmBill.vue'),
    meta: {
      authKey: '',
      title: '运营确定账单'
    },
    props: idProps,
  },

  // 映前广告付款单管理 - 列表
  {
    path: '/finance/payment/:status?',
    name: 'finance-payment',
    component: () => import('./views/finance/payment/index.vue'),
    meta: {
      authKey: '',
      title: '映前广告付款单列表'
    },
    props: true
  },

  // 财务管理 - 支付流水管理
  {
    path: '/finance/paymentflow',
    name: 'finance-paymentflow',
    component: () => import('./views/finance/payment-flow/index.vue'),
    meta: {
      authKey: '',
      title: '支付流水'
    },
    props: true,
  },

  // 财务管理 - 退款单管理
  {
    path: '/finance/refundOrder',
    name: 'finance-refund-order',
    component: () => import('./views/finance/refund-order/index.vue'),
    meta: {
      authKey: '',
      title: '退款单管理'
    },
    props: true
  },

  // 财务管理 - 应收应付统计表
  {
    path: '/finance/accrual',
    name: 'finance-accrual',
    component: () => import('./views/finance/accrual/index.vue'),
    meta: {
      authKey: '',
      title: '应收应付统计表'
    }
  },

  // 财务管理 - 应收应付统计表 - 应收金额
  {
    path: '/finance/accrual/receive/:id',
    name: 'finance-accrual-receive',
    component: () => import('./views/finance/accrual/receive.vue'),
    meta: {
      authKey: '',
      title: '应收金额'
    },
    props: idProps
  },

  // 财务管理 - 应收应付统计表 - 应付金额
  {
    path: '/finance/accrual/pay/:id',
    name: 'finance-accrual-pay',
    component: () => import('./views/finance/accrual/pay.vue'),
    meta: {
      authKey: '',
      title: '应付金额'
    },
    props: idProps
  },

  // 财务管理 - 应收应付统计表 - 应收-应付
  {
    path: '/finance/accrual/receive-pay/:id',
    name: 'finance-accrual-receive-pay',
    component: () => import('./views/finance/accrual/receivePay.vue'),
    meta: {
      authKey: '',
      title: '应收-应付',
      breadcrumbs: [
        'finance-accrual'
      ]
    },
    props: idProps,
  },

   // 财务管理 - 已下刊广告计划核对
   {
    path: '/finance/next/issue',
    name: 'finance-next-issue',
    component: () => import('./views/finance/next-issue/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 财务管理 - 已下刊广告计划核对 - 查看 修改 核对
  {
    path: '/finance/nextissue/detail/:id/:status/:detail?',
    name: 'finance-next-issue-detail',
    component: () => import('./views/finance/next-issue/detail.vue'),
    meta: {
      authKey: '',
      title({ params: { status } }) {
        return status == '1' ? '核对' : '详情'
      }
    },
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
    path: '/resource/kolplatform/list/:channel?',
    name: 'resource-kolplatform-list',
    component: () => import('./views/resource/kolPlatform/index.vue'),
    meta: {
      authKey: '',
      title: 'KOL平台账号资源管理',
      fixed: true
    },
    props: true,
  },

  //  kol平台账号资源管理 - 查看
  {
    path: '/resource/kolplatform/detail/:code/:id/:type?',
    name: 'resource-kolplatform-list-detail',
    component: () => import('./views/resource/kolPlatform/details.vue'),
    meta: {
      authKey: '',
      title({params}) {
        return params.type ? '审核' : '查看'
      }
    },
    props: paramTypes({ id: Number, code: String, type: Number})
  },

  //  kol平台账号资源管理 - 审核
  // {
  //   path: '/resource/kolplatform/audit/:code/:id',
  //   name: 'resource-kolplatform-list-audit',
  //   component: () => import('./views/resource/kolPlatform/audit.vue'),
  //   meta: {
  //     authKey: '',
  //     title: '审核',
  //   }
  // },

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
    },
    props: idProps
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
    },
    props: idProps
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

  // 促销活动 - 广告计划营销活动 - 列表
  {
    path: '/promotion/cpm',
    name: 'promotion-cpm',
    component: () => import('./views/promotion/cpm/list.vue'),
    meta: {
      authKey: '',
      title: '广告计划营销活动'
    }
  },

  // 促销活动 - 广告计划营销活动 - 详情 - 编辑 - 新建
  {
    path: '/promotion/cpm/detail/:id?/:action',
    name: 'promotion-cpm-detail',
    component: () => import('./views/promotion/cpm/detail.vue'),
    meta: {
      authKey: '',
      title({ params: { action } }) {
        switch (action) {
          case 'view':
            return '查看'
          case 'edit':
            return '编辑'
          case 'audit':
            return '审批'
          default:
            return '添加新活动'
        }
      }
    },
    props: paramTypes({ id: Number, action: String })
  },

  // 促销活动 - 广告片营销活动 - 列表
  {
    path: '/promotion/xadvert',
    name: 'promotion-xadvert',
    component: () => import('./views/promotion/xadvert/list.vue'),
    meta: {
      authKey: '',
      title: '广告片营销活动'
    }
  },

  // 促销活动 - 广告片营销活动 - 详情 - 新建 - 编辑 - 审批
  {
    path: '/promotion/xadvert/detail/:id?/:action',
    name: 'promotion-xadvert-detail',
    component: () => import('./views/promotion/xadvert/detail.vue'),
    meta: {
      authKey: '',
      title({ params: { action } }) {
        switch (action) {
          case 'view':
            return '查看'
          case 'edit':
            return '编辑'
          case 'audit':
            return '审批'
          default:
            return '添加新活动'
        }
      }
    },
    props: paramTypes({ id: Number, action: String })
  },

  // 内容管理 - 推荐位管理 - 列表
  {
    path: '/content/recommendPost/list',
    name: 'content-recommend-post',
    component: () => import('./views/content/recommend-post/list.vue'),
    meta: {
      authKey: '',
      title: '推荐位管理'
    }
  },

  // 内容管理 - 推荐位管理 - 详情 - 新建 - 编辑
  {
    path: '/content/recommendPost/detail/:id?/:action',
    name: 'content-recommend-post-detail',
    component: () => import('./views/content/recommend-post/detail.vue'),
    meta: {
      authKey: '',
      title({ params: { action } }) {
        switch (action) {
          case 'view':
            return '查看'
          case 'edit':
            return '编辑'
          default:
            return '新增推荐位'
        }
      },
      breadcrumbs: [
        'content-recommend-post'
      ],
      siderNav: 'content-recommend'
    },
    props: paramTypes({ id: Number, action: String })
  },

  // 内容管理 - 推荐位数据 - 列表
  {
    path: '/content/recommendData/:postId/list',
    name: 'content-recommend-data',
    component: () => import('./views/content/recommend-data/list.vue'),
    meta: {
      authKey: '',
      title: '推荐数据',
      breadcrumbs: [
        'content-recommend-post'
      ],
      siderNav: 'content-recommend-post'
    }
  },

  // 内容管理 - 推荐数据 - 详情 - 新建 - 编辑
  {
    path: '/content/recommendData/detail/:postId?/:id?/:action',
    name: 'content-recommend-data-detail',
    component: () => import('./views/content/recommend-data/detail.vue'),
    meta: {
      authKey: '',
      title({ params: { action } }) {
        switch (action) {
          case 'view':
            return '查看'
          case 'edit':
            return '编辑'
          default:
            return '新增推荐数据'
        }
      },
      breadcrumbs: [
        'content-recommend-post',
        'content-recommend-data'
      ],
      siderNav: 'content-recommend-post'
    },
    props: paramTypes({ id: Number, action: String })
  },

  // 内容管理 - 行业分类管理 - 列表
  {
    path: '/content/industry',
    name: 'content-industry',
    component: () => import('./views/content/industry/index.vue'),
    meta: {
      authKey: '',
      title: '行业管理列表'
    }
  },

  {
    path: '/system/setup',
    name: 'system-setup',
    component: () => import('./views/system/setup/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // 下刊触发
  {
    path: '/system/issue',
    name: 'system-issue',
    component: () => import('./views/system/issue/index.vue'),
    meta: {
      authKey: ''
    }
  },

  // TOP城市设置
  {
    path: '/system/topcities',
    name: 'system-topcities',
    component: () => import('./views/system/topcities/index.vue'),
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
      authKey: '',
      title: 'kol订单列表'
    }
  },
  // 订单列表详情 - kol
  {
    path: '/order/kollist/detail/:id/:orders',
    name: 'order-kollist-detail',
    component: () => import('./views/order/kollist/detail.vue'),
    meta: {
      authKey: '',
      title({params}) {
        return params.orders as any > 0 ? '审核信息' : '查看详情'
      }
    }
  },
  // 退款订单列表 - kol
  {
    path: '/order/refund',
    name: 'order-refund',
    component: () => import('./views/order/refund/index.vue'),
    meta: {
      authKey: '',
      title: 'kol退款单列表'
    }
  },
   // 退款订单添加/详情 - kol
  {
    path: '/order/refund/detail/:id/:order',
    name: 'order-refund-detail',
    component: () => import('./views/order/refund/detail.vue'),
    meta: {
      authKey: '',
      title({params}) {
        return params.id as any <= 0 ? '创建退款单' : '查看详情'
      }
    }
  },
  // 影片资源合作订单 - 列表
  {
    path: '/order/filmorder',
    name: 'order-filmorder',
    component: () => import('./views/order/filmorder/index.vue'),
    meta: {
      authKey: '',
      title: '影片资源合作订单列表'
    }
  },
  // // 影片资源合作订单 - 上传资源
  // {
  //   path: '/order/filmorder/addfile',
  //   name: 'order-filmorder-addfile',
  //   component: () => import('./views/order/filmorder/addfile.vue'),
  //   meta: {
  //     authKey: ''
  //   }
  // },
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
      authKey: '',
      title({params}) {
        return params.status as any > 0 ? '审核' : '查看详情'
      }
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
  // // 映前广告计划 - 列表
  // {
  //   path: '/order/beforeplan',
  //   name: 'order-beforeplan',
  //   component: () => import('./views/order/beforeplan/index.vue'),
  //   meta: {
  //     authKey: '',
  //     title: '映前广告计划列表'
  //   }
  // },

  // 映前广告计划 - 列表
  {
    path: '/order/beforeplan/newindex/:pay?',
    name: 'order-beforeplan',
    component: () => import('./views/order/beforeplan/newindex.vue'),
    meta: {
      authKey: '',
      title: '映前广告计划列表'
    },
    props: true,
  },

  // 映前广告计划 - 审批 - 列表
  {
    path: '/order/beforeplan/audit/:status?',
    name: 'order-beforeplanaudit',
    component: () => import('./views/order/beforeplan/beforeplan-audit-list.vue'),
    meta: {
      authKey: '',
      title: '广告计划审批管理'
    },
    props: true
  },

  // 映前广告计划 - 审批 - 详情 ifs 0 为详情查看页面 1为非详情查看页面
  {
    path: '/order/beforeplan/audit/detail/:id/:status?/:ifs',
    name: 'order-beforeplanAudit-detail',
    component: () => import('./views/order/beforeplan/beforeplan-audit-detail.vue'),
    meta: {
      authKey: '',
      title: '审批'
    },
    props: true
  },

  // {
  //   path: '/finance/kol-payment/:channel?',
  //   name: 'finance-kol-payment',
  //   component: () => import('./views/finance/kol-payment/index.vue'),
  //   meta: {
  //     authKey: ''
  //   },
  //   props: true,
  // },

  // 映前广告计划 - 添加广告计划
  // {
  //   path: '/order/beforeplan/addplan',
  //   name: 'order-beforeplan-addplan',
  //   component: () => import('./views/order/beforeplan/addplan.vue'),
  //   meta: {
  //     authKey: '',
  //     title: '添加广告计划'
  //   }
  // },

  // 映前广告计划 - 详情 ifs 0 为详情查看页面 1为非详情查看页面
  {
    path: '/order/beforeplan/detail/:id/:status/:ifs',
    name: 'order-beforeplan-detail',
    component: () => import('./views/order/beforeplan/detail.vue'),
    meta: {
      authKey: '',
      title: '映前广告计划详情'
    }
  },
  // 映前广告计划 - 查看计划城市列表
  {
    path: '/order/beforeplan/detail/city/:id',
    name: 'order-beforeplan-detail-viewcity',
    component: () => import('./views/order/beforeplan/viewcity.vue'),
    meta: {
      authKey: '',
      title: '查看计划城市列表'
    }
  },
  // 映前广告监播 - 列表
  // {
  //   path: '/order/supervision',
  //   name: 'order-supervision',
  //   component: () => import('./views/order/supervision/index.vue'),
  //   meta: {
  //     authKey: '',
  //     title: '映前广告监播列表'
  //   }
  // },
  {
    path: '/order/supervision/newindex/:pay?',
    name: 'order-supervision',
    component: () => import('./views/order/supervision/newindex.vue'),
    meta: {
      authKey: '',
      title: '映前广告监播列表'
    },
    props: true,
  },
  // 映前广告监播 - 列表详情
  {
    path: '/order/supervision/detail/:id',
    name: 'order-supervision-detail',
    component: () => import('./views/order/supervision/detail.vue'),
    meta: {
      authKey: '',
      title: '映前广告监播详情'
    }
  },
  // 广告管理 - 成本核算 - 列表
  {
    path: '/datareport/cost',
    name: 'datareport-cost',
    component: () => import('./views/datareport/cost/index.vue'),
    meta: {
      authKey: '',
      title: '成本核算列表'
    }
  },
  // 广告管理 - 下刊 - 列表
  {
    path: '/datareport/nextissue',
    name: 'datareport-nextissue',
    component: () => import('./views/datareport/nextissue/index.vue'),
    meta: {
      authKey: '',
      title: '下刊监控列表'
    }
  },
  // 广告管理 - 下刊 - 列表 - 详情
  {
    path: '/datareport/nextissue/detail/:id',
    name: 'datareport-nextissue-detail',
    component: () => import('./views/datareport/nextissue/detail.vue'),
    meta: {
      authKey: '',
      title: '报表详情'
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
