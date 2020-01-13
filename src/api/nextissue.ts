import { get , post , put } from '@/fn/ajax'

export async function queryList(query: any) {
  const data = await get('/xadvert/checkplan/', query)
  data.data.items = data.data.item || []
  return data
}

export async function detailExport(query: any) {
  const data = await get('/xadvert/checkplan/detailExport', query)
  return data
}

export async function update(query: any) {
  const data = await put('/xadvert/checkplan/detail-update', query)
  return data
}

export async function checkplan(query: any) {
  const data = await get('/xadvert/checkplan/detail/', query)
  return data
}

export async function xadvertconfirm(query: any) {
  const data = await put('/xadvert/checkplan/check-confirm', query)
  return data
}

/**
 * 分页查询市级城市信息
 * @description https://yapi.aiads-dev.com/project/16/interface/api/2518
 */
export async function districts(ids: any) {
  const res = await get(`/basis/districts/${ids}`)
  return res
}

/**
 * 分页查询市级城市信息
 * @description https://yapi.aiads-dev.com/project/16/interface/api/2518
 */
export async function queryCities(query: any = {}) {
  const res = await get('/basis/districts/cities', query)
  return res
}

/**
 * 分页查询计划列表
 * @description https://yapi.aiads-dev.com/project/28/interface/api/1209
 */
export async function xadvert(query: any = {}) {
  const res = await get('/customer/companies', query)
  return res
}
