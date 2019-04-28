import { get, post, put } from '@/fn/ajax'
/**
 * 查询影投列表(分页)
 */
export async function queryList(query: any = {}) {
  const url = '/customer/movie-relations'
  const res = await get(url, query)
  return res
}
