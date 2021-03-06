import { get , post , put , del } from '@/fn/ajax'

/**
 * @param  {any} query
 */
export async function queryList(query: any) {
  const data = await get('/finance/withdrawal-bills', query)
  return data
}

/**
 * @param  {any} query
 * 提现的详情
 * http://yapi.aiads-dev.com/project/76/interface/api/5946
 */
export async function withdrwaldetail(id: any) {
  const data = await get(`/finance/withdrawal-bills/${id}`)
  return data
}

/**
 * @param  {any} query
 * 提现的汇款
 * http://yapi.aiads-dev.com/project/76/interface/api/5946
 */
export async function remittance(query: any) {
  const data = await put(`/finance/withdrawal-bills/remittance`, query)
  return data
}

/**
 * @param  {any} query
 * 提现的汇款
 * http://yapi.aiads-dev.com/project/76/interface/api/5953
 */
export async function approval(query: any) {
  const data = await put(`/finance/withdrawal-bills/approval`, query)
  return data
}
