import { get, post, put } from '@/fn/ajax'

/**
 * 根据条件，查询单个项的详细信息
 * @param query 查询条件，参见接口文档
 */
export async function queryItem(query: any = {}) {
  const { id } = query
  const url = id ? `/theater/halls/${id}` : '/theater/halls/view'
  const res = await get(url)
  return res
}

/**
 * 新增
 * @param cinemaId 所属影院ID
 * @param data 数据，参见接口文档
 */
export async function addItem(cinemaId: string, data: any = {}) {
  const url = `/theater/cinemas/${cinemaId}/halls`
  const res = await post(url, data)
  return res
}

/**
 * 更新
 * @param cinemaId 所属影院ID
 * @param data 数据，参见接口文档
 */
export async function updateItem(cinemaId: string, data: any = {}) {
  const url = `/theater/cinemas/${cinemaId}/halls/${data.id}`
  const res = await put(url, data)
  return res
}
