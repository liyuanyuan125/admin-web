import { encode, decode } from 'universal-base64url'
import { Route } from 'vue-router'

/**
 * 将 route 基本信息，转换成 base64url
 * @param route route 对象
 */
export function encodeRoute(route: Route) {
  const saved = {
    name: route.name,
    params: route.params || {},
    query: route.query || {}
  }
  const json = JSON.stringify(saved)
  const base64 = encode(json)
  return base64
}

/**
 * 从 base64 中恢复 route 信息
 * @param base64 base64 字符串
 */
export function decodeRoute(base64: string) {
  try {
    const json = decode(base64)
    const route = JSON.parse(json)
    if (route.name && route.params && route.query) {
      return route
    }
  } catch (ex) {
  }
  return null
}
