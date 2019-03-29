import { MapType, PermPage } from '@/util/types'
import { walkTree } from '@/fn/tree'
import routes, { RouteConfigEnhance } from '@/routes'
import { devWarn, devError, devInfo } from '@/util/dev'
import { Route } from 'vue-router'

/** 边栏菜单项 */
export interface SiderMenuItem {
  /** 菜单名，一般与 route 一一对应 */
  name: string
  /** 菜单文字 */
  label: string
  /** 图标，只有一级菜单才有 */
  icon?: string
  /** route 名 */
  route?: string
  /** 子页面 */
  children?: SiderMenuItem[]
}

/**
 * 面包屑配置项
 */
export interface BreadcrumbConfig {
  /** route name */
  name: string
  /** 面包屑文本  */
  text: string
  /** 是否为 Route */
  isRoute: boolean
}

let routeMapCache: MapType<RouteConfigEnhance> | null = null

/**
 * 获取以 name 为 key 的 route map
 */
export function getRouteMap() {
  if (routeMapCache != null) {
    return routeMapCache
  }

  const map: MapType<RouteConfigEnhance> = {}

  walkTree(routes as RouteConfigEnhance[], {
    onEachBefore(route) {
      const name = (route.name || '').toLowerCase()
      if (name === '') {
        return
      }
      if (name in map) {
        devError(`${name} already existed `, map[name])
        return
      }
      map[name] = route
    }
  })

  // 在开发环境不缓存
  VAR.env !== 'dev' && (routeMapCache = map)

  return map
}

/**
 * 获取菜单项
 * @param permMenu 后端获取过来的菜单配置
 */
export function getMenuList(permMenu: PermPage[]) {
  const routeMap = getRouteMap()

  const result: SiderMenuItem[] = walkTree(permMenu, {
    onEachBefore(menu) {
      const key = (menu.path || '').toLowerCase()
      if (key === '') {
        devError('no path, invalid menu: ', menu)
        return
      }
      const route = routeMap[key]
      const item: SiderMenuItem = {
        name: key,
        label: menu.name,
        icon: menu.icon,
        route: route && route.name,
      }
      return item
    }
  })

  return result
}

let routeTitleMap: MapType<BreadcrumbConfig> | null = null

// 获取 route 到页面标题的 Map
const getBreadcrumbConfigMap = (permMenu: PermPage[]) => {
  if (routeTitleMap != null) {
    return routeTitleMap
  }

  const routeMap = getRouteMap()

  // 将所有的 routeMap 转换成 name => label
  const result = Object.entries(routeMap).reduce((map, [ name, config ]) => {
    const text = config.meta && config.meta.title || ''
    map[name.toLowerCase()] = { name, text, isRoute: true }
    return map
  }, {} as MapType<BreadcrumbConfig>)

  // 用 permMenu 中的信息，进一步填充 routeTitleMap
  walkTree(permMenu, {
    onEachBefore(menu) {
      const name = (menu.path || '').toLowerCase()
      if (name === '') {
        devError('no path, invalid menu: ', menu)
        return
      }
      const isRoute = name in routeMap
      result[name] = { name, text: menu.name, isRoute }
    }
  })

  // 在开发环境不缓存
  VAR.env !== 'dev' && (routeTitleMap = result)

  return result
}

const hasHyphen = /-/
const lastHyphen = /-[^\-]+$/

/**
 * 从 route 获取面包屑列表
 * @param route Route 项
 */
export function getBreadcrumbListFromRoute(route: Route, permMenu: PermPage[]) {
  const configMap = getBreadcrumbConfigMap(permMenu)

  const { name } = route

  let key = (name || '').toLowerCase()

  const list: BreadcrumbConfig[] = []

  while (key != '') {
    const item = configMap[key]
    item && list.unshift(item)
    if (!hasHyphen.test(key)) {
      break
    }
    key = key.replace(lastHyphen, '')
  }

  devInfo(list)

  return list
}
