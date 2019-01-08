

import { get , post , put } from '@/fn/ajax'

export async function queryList(query: any) {
  const data = await get('/customer/workorders', query)
  return data
}

// 根据id查询工单详情
export async function queryItem(query: any) {
  const data = await get(`/customer/workorders/${query}`)
  return data
}

export async function dataFrom(query: any) {
  const data = await get('/customer/workorders', query)
  return data
}


// 状态修改
export async function setList(id: any , query: any) {
  const res = await put(`/customer/workorders/${id}/status`, query)
  return res
}


// 获取公司详情
export async function companysList(query: any) {
  const data = await get('/customer/companies', query)
  return data
}

