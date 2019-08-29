import { get, post, put } from '@/fn/ajax'

/**
 * @param  {any} query
 * 公司分页查询
 * http://yapi.aiads-dev.com/project/34/interface/api/287
 */
export async function querylist(query: any) {
  const res = await get('/customer/companies', query)
  return res
}

/**
 * @param  {any} query
 * 公司详情
 * http://yapi.aiads-dev.com/project/34/interface/api/293
 */
export async function companyDetail(id: any) {
  const res = await get(`/customer/companies/${id}`)
  return res
}

/**
 * @param  {any} query
 * 新建公司
 * http://yapi.aiads-dev.com/project/34/interface/api/293
 */
export async function companyAdd(query: any) {
  const res = await post(`/customer/companies`, query)
  return res
}

/**
 * @param  {any} query
 * 是否上下架
 * http://yapi.aiads-dev.com/project/34/interface/api/293
 */
export async function stop(id: any, query: any) {
  const res = await put(`/customer/companies/${id}/status`, query)
  return res
}

/**
 * @param  {any} query
 * 修改公司信息
 * http://yapi.aiads-dev.com/project/34/interface/api/293
 */
export async function companySet(id: any, query: any) {
  const res = await put(`/customer/companies/${id}`, query)
  return res
}

/**
 * @param  {any} query
 * 新增公司前获取类型数据
 * http://yapi.aiads-dev.com/project/34/interface/api/599
 */
export async function companbefore() {
  const res = await get('/customer/companies/view')
  return res
}

/**
 * @param  {any} query
 * 新增公司前获取类型数据
 * http://yapi.aiads-dev.com/project/34/interface/api/599
 */
export async function codeList(code: any) {
  const res = await get(`/customer/dictionays/${code}`)
  return res
}
