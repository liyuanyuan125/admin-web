import { get , post , put } from '@/fn/ajax'

/**
 * @param  {any} query
 */
export async function queryList(query: any) {
  const data = await get('/kol/accounts', query)
  return data
}

/**
 * @param  {any} query
 * 添加kol关联信息
 */
export async function addkol(query: any) {
  const data = await post('/kol/accounts', query)
  return data
}

/**
 * @param  {any} query
 * http://yapi.aiads-dev.com/project/142/interface/api/3174
 */
export async function editkol(id: any, query: any) {
  const data = await put(`/kol/accounts/${id}`, query)
  return data
}

export async function detailkol(id: any) {
  const data = await get(`/kol/accounts/${id}`)
  return data
}
