import { get, post } from '@/fn/ajax'

interface LoginData {
  username: string
  password: string
}

/**
 * 登录
 * @param data 提交数据
 */
export async function login(data: LoginData) {
  const res = await post('/auth/login', data)
  return res
}

/**
 * 退出
 */
export async function logout() {
  const res = await post('/auth/logout')
  return res
}

/**
 * 获取登录用户信息
 */
export async function getUserInfo() {
  const res = await get('/auth/infos')
  return res
}
