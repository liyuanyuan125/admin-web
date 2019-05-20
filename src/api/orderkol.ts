import { get, post, put } from '@/fn/ajax'
/**
 * 查询影投列表(分页)
 */
export async function queryList(query: any = {}) {
  const url = '/customer/movie-relations'
  const res = await get(url, query)
  return res
}

/**
 * 新建影投
 */
export async function addfilm(query: any = {}) {
  const url = '/customer/movie-relations'
  const res = await post(url, query)
  return res
}

/**
 * 根据ID获取单个影片关联信息
 */
export async function filmId(id: number) {
  const url = `/customer/movie-relations/${id}`
  const res = await get(url)
  return res
}

/**
 * 绑定管连
 */
export async function relevance(id: number, query: any) {
  const url = `/customer/movie-relations/${id}/setup`
  const res = await put(url, query)
  return res
}

/**
 * 取消关联
 */
export async function relevanceNot(id: number, query: any) {
  const url = `/customer/movie-relations/${id}/cancel`
  const res = await put(url, query)
  return res
}
