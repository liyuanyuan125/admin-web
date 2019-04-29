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
