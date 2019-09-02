import { get , post , put , del } from '@/fn/ajax'

/**
 * @param  {any} query
 * https://yapi.aiads-dev.com/project/76/interface/api/755
 */
export async function queryList(query: any) {
  const data = await get('/finance/xadvertiser/statistics', query)
  return data
}

/**
 * @param  {any} query
 * https://yapi.aiads-dev.com/project/76/interface/api/755
 */
export async function before() {
  const data = await get('/finance/lineUnderRemittances/create/before')
  return data
}

/**
 * @param  {any} query
 * 获取公司信息
 * https://yapi.aiads-dev.com/project/76/interface/api/755
 */
export async function companylist(id: any) {
  const data = await get(`/customer/companies/${id}`)
  return data
}

/**
 * @param  {any} query
 * 获取公司信息
 * https://yapi.aiads-dev.com/project/76/interface/api/755
 */
export async function add(query: any) {
  const data = await post(`/finance/lineUnderRemittances`, query)
  return data
}

/**
 * @param  {any} query
 * t
 * https://yapi.aiads-dev.com/project/76/interface/api/755
 */
export async function save(query: any) {
  const data = await post(`/finance/withdrawal-bills`, query)
  return data
}

/**
 * @param  {any} query
 * 获取公司信息
 * https://yapi.aiads-dev.com/project/76/interface/api/5932
 */
export async function getcompany(query: any) {
  const data = await get(`/finance/advertiserAccountBills`, query)
  return data
}
