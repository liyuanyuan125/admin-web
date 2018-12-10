/**
 * 全部数据结构，这里做了简化，暂不使用 Vuex
 */

import tryParseJson from '@/util/tryParseJson'
import cookie from 'js-cookie'

interface User {
  id: string
  name: string
}

const KEY_TOKEN = 'X-API-TOKEN'

const COOKIE_OPTIONS = {
  path: '/',
  domain: location.hostname === 'localhost' ? '' : '.aiads.com',
}

let theUser: User | null = null

const restoreUser = (): User | null => {
  const token = cookie.get(KEY_TOKEN)
  const user = tryParseJson(sessionStorage.user)
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
  sessionStorage.user = JSON.stringify(user)
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
  delete sessionStorage.user
  theUser = null
}

export function setCookie(token: string) {
  cookie.set(KEY_TOKEN, token, COOKIE_OPTIONS)
}
