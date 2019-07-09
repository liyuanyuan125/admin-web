///
/// 全部数据结构，这里做了简化，暂不使用 Vuex
///
import tryParseJson from '@/fn/tryParseJson'
import cookie from 'js-cookie'
import { logout as postLogout } from '@/api/auth'
import { MapType, PermPage } from '@/util/types'
import { getMenuList, getPermList } from '@/api/auth'
import { devInfo, devError, devAssert } from '@/util/dev'
import { makeMap } from '@/util/dealData'
import { Route } from 'vue-router'
import { RouteMetaUnauth, RouteMetaAuth } from './routes'

/**
 * 当前应用 ID
 */
export const appId = 2

// 权限缓存，刷新、重新登录、退出丢失
// TODO: 实现重新登录清空权限缓存
const permCache: MapType<Promise<PermResult>> = {}

export interface User {
  id: string
  name: string
}

const KEY_USER = 'user@admin.aiads.com'
const KEY_TOKEN = 'X-API-TOKEN'

const COOKIE_OPTIONS = {
  path: '/',
  domain: location.hostname === 'localhost' ? '' : '.aiads.com',
}

let theUser: User | null = null

const restoreUser = (): User | null => {
  const token = cookie.get(KEY_TOKEN)
  const user = tryParseJson(localStorage.getItem(KEY_USER))
  return token && user ? user : null
}

/**
 * 获取当前登录用户
 */
export function getUser() {
  if (theUser == null) {
    theUser = restoreUser()
  }
  return theUser
}

/**
 * 设置用户
 * @param user 用户
 */
export function setUser(user: User) {
  theUser = user
  localStorage.setItem(KEY_USER, JSON.stringify(user))
}

/** 检查用户信息完成性，若不完整，则清空，退出  */
export function checkUser() {
  const user = getUser()
  if (user != null) {
    try {
      devAssert(user.id, '用户 ID 必须存在')
    } catch (ex) {
      devError(`用户信息不完整：${ex.message}，退出重新登录`)
      logout()
    }
  }
}

/**
 * 获取是否已登录
 */
export function hasLogin() {
  return getUser() !== null
}

/**
 * 退出
 */
export function logout() {
  cookie.remove(KEY_TOKEN, COOKIE_OPTIONS)
  localStorage.removeItem(KEY_USER)

  // 清除权限缓存
  if (theUser != null) {
    const permKey = `${theUser!.id}`
    delete permCache[permKey]
  }

  theUser = null
  postLogout()
}

/** 权限结果 */
export interface PermResult {
  menu: PermPage[]
  permMap: MapType<number>
}

/**
 * 获取当前菜单与权限，带缓存，刷新、重新登录、退出丢失
 */
export async function getCurrentPerms() {
  const user = getUser()
  if (user == null) {
    return null
  }

  // 先从缓存中查找
  const permKey = `${user.id}`
  const cached = permCache[permKey]
  if (cached != null) {
    return cached
  }

  const menuPromise = getMenuList()
  const permPromise = getPermList()

  const promise = Promise.all([menuPromise, permPromise]).then(([
    { data: { list: menuList = [] } },
    { data: permList }
  ]) => {
    const menu = (menuList || []) as PermPage[]
    const permMap = makeMap(permList as string[])

    // devInfo('permMenu', menu)
    // devInfo('permMap', permMap)

    const result: PermResult = { menu, permMap }
    return result
  })
  .catch(() => {
    // 如果遇到错误，则清空相应的 permCache，以便下次可以重试
    delete permCache[permKey]
    // 返回一个空的 PermResult，以便消除上层代码的错误？
    return { menu: [], permMap: {} } as PermResult
  })

  permCache[permKey] = promise

  return promise
}

/**
 * 判断当前用户是否有相应的权限
 * @param perm
 */
export async function hasPerm(perm: string) {
  const { permMap = {} } = await getCurrentPerms() || {}
  const lower = (perm || '').toLowerCase()
  const has = lower in permMap
  // !has && devInfo(`[perm] ${lower} not in`, permMap)
  return has
}

/**
 * 验证当前用户是否有指定路由的访问权限
 * @param route 页面路由
 */
export async function hasRoutePerm(route: Route) {
  if (route.meta == null) {
    devError('路由配置错误，必须含有 meta 信息')
    return false
  }

  // 不需要登录的，认为具有任何权限
  if ((route.meta as RouteMetaUnauth).unauth) {
    return true
  }

  const { authKey } = route.meta as RouteMetaAuth

  // authKey 不能为 null
  if (authKey == null) {
    devError('路由配置错误，authKey 不能为 null')
    return false
  }

  const key = typeof authKey === 'string'
    ? authKey
    : authKey(route)
  const perm = String(key).trim()

  // authKey 为空的，被认为不做权限验证
  if (perm === '') {
    return true
  }

  const has = await hasPerm(perm)
  return has
}

/** 用户设置，将会保存在本地存储 */
export interface UserSettings {
  /** 侧边菜单是否折叠 */
  siderMenuIsFold?: boolean
}

const userSettingsKeyPrefix = 'userSettings@admin.jydata.com#'

const defaultUserSettings: UserSettings = {
  siderMenuIsFold: false
}

let userSettings: UserSettings

const getUserSettingsKey = () => {
  const user = getUser()!
  devAssert(user != null)
  const key = `${userSettingsKeyPrefix}${user.id}`
  return key
}

/**
 * 获取当前用户的设置
 */
export function getUserSettings(): UserSettings {
  const user = getUser()
  if (user == null) {
    return { ...defaultUserSettings }
  }

  if (userSettings == null) {
    const key = getUserSettingsKey()
    const settings = tryParseJson(localStorage.getItem(key)) || {}
    userSettings = { ...defaultUserSettings, ...settings }
  }

  return userSettings
}

const setUserSettings = (settings: UserSettings) => {
  const key = getUserSettingsKey()
  const json = JSON.stringify(settings)
  localStorage.setItem(key, json)
}

/**
 * 更新当前用户的设置
 */
export function updateUserSettings(settings: UserSettings) {
  const oldSettings = getUserSettings()
  const newSettings = { ...defaultUserSettings, ...oldSettings, ...settings }
  setUserSettings(newSettings)
}
