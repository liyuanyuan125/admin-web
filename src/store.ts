/**
 * 全部数据结构，这里做了简化，暂不使用 Vuex
 */

import tryParseJson from '@/fn/tryParseJson'
import cookie from 'js-cookie'
import { logout as postLogout } from '@/api/auth'

interface User {
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
  const user = tryParseJson(localStorage[KEY_USER])
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
  localStorage[KEY_USER] = JSON.stringify(user)
}

// 简单的断言
const assert = (expression: any, errorMessage: string) => {
  if (!!expression === false) {
    throw new Error(errorMessage)
  }
}

/** 检查用户信息完成性，若不完整，则清空，退出  */
export function checkUser() {
  const user = getUser()
  if (user != null) {
    try {
      assert(user.id, '用户 ID 必须存在')
    } catch (ex) {
      // tslint:disable-next-line:no-console
      console.error(`用户信息不完整：${ex.message}，退出重新登录`)
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
  delete localStorage[KEY_USER]
  theUser = null
  postLogout()
}

/**
 * 当前应用 ID
 */
export const appId = 2
