

import { get , post , put , del } from '@/fn/ajax'

// 行业管理列表
// http://yapi.aiads-dev.com/project/306/interface/api/7074
export async function queryList(query: any) {
  const data = await get(`/content/trade-classify/list`, query)
  return data
}

// 详情
// http://yapi.aiads-dev.com/project/306/interface/api/7083
export async function itemList(id: any) {
  const data = await get(`/content/trade-classify/detail/${id}`)
  return data
}

// 新建
// http://yapi.aiads-dev.com/project/306/interface/api/7218
export async function addList(query: any) {
  const res = await post(`/content/trade-classify/add`, query)
  return res
}

// 修改
// http://yapi.aiads-dev.com/project/306/interface/api/7092
export async function setList(id: any , query: any) {
  const res = await put(`/content/trade-classify/edit/${id}`, query)
  return res
}

// 删除
// http://yapi.aiads-dev.com/project/306/interface/api/7101
export async function dels(id: any) {
  const res = await del(`/content/trade-classify/delete/${id}`)
  return res
}

