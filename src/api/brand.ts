import { get, post, put, del } from '@/fn/ajax'

/**
 * 根据条件，查询列表
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3806
 */
export async function brandList(query: any) {
  const data = await get('/brand/brands', query)
  return data
}

/**
 * 根据条件 品牌详情
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3830
 */
export async function brandDetail(id: any) {
  const data = await get(`/brand/brands/${id}`)
  return data
}

/**
 * 根据条件 品牌启用
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3814
 */
export async function brandstart(id: any) {
  const data = await put(`/brand/brands/${id}/enabled`)
  return data
}

/**
 * 根据条件 品牌禁用
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3830
 */
export async function brandstop(id: any) {
  const data = await put(`/brand/brands/${id}/disabled`)
  return data
}

/**
 * 根据条件 账号平台列表
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/4134
 */
export async function mediaslist(query: any) {
  const data = await get(`/brand/medias`, query)
  return data
}

/**
 * 根据条件 添加社交平台
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/4134
 */
export async function addmedias(query: any) {
  const data = await post(`/brand/medias`, query)
  return data
}

/**
 * 根据条件 编辑社交平台
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/4134
 */
export async function editmedias(query: any) {
  const data = await put(`/brand/medias`, query)
  return data
}

/**
 * 根据条件 删除社交平台
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/4134
 */
export async function delmedias(id: any) {
  const data = await put(`/brand/medias/${id}`)
  return data
}

/**
 * 根据条件 删除社交平台
 * @param query 查询条件，http://yapi.aiads-dev.com/project/152/interface/api/4230
 */
export async function brandbefore() {
  const data = await get(`/brand/brands/before`)
  return data
}

/**
 * 查询条件，查询kol列表
 * @param query 查询条件，http://yapi.aiads-dev.com/project/142/interface/api/3198
 */
export async function kolchannel(query: any) {
  const data = await get(`/kol/channel-accounts`, query)
  return data
}

/**
 * 分页查询 影片列表
 * @param query 查询条件，http://yapi.aiads-dev.com/project/156/interface/api/4326
 */
export async function filmlist(query: any) {
  const data = await get(`/movie/resource/`, query)
  return data
}
