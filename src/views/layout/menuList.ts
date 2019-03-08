import { MapType, PermPage } from '@/util/types'
import { walkTree } from '@/fn/tree'
import routes, { RouteConfigEnhance } from '@/routes'
import { devWarn, devError } from '@/util/dev'

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

let routeMapCache: MapType<RouteConfigEnhance> | null = null

// 获取以 name 为 key 的 route map
const getRouteMap = () => {
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
