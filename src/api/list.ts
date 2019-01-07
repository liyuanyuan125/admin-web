

import { get , post , put } from '@/fn/ajax'

export async function queryList(query: any) {
  const data = await get('/customer/contracts', query)
  return data
}

export async function queryId(query: any) {
  const data = await get(`/customer/contracts/${query}/`)
  return data
}



export async function dataFrom(query: any) {
  const res = await get('/customer/contracts', query)
  return res
}

// 作废/审核
export async function zuofei(id: any , query: any) {
  const res = await put(`/customer/contracts/${id}/status`, query)
  return res
}
// 获取公司详情
export async function companysList(query: any) {
  const data = await get('/customer/companies', {pageSize: 10000})
  return data
}

// 获取甲方公司详情
export async function jiacompanysList(query: any) {
  const data = await get('/customer/contracts/view', {pageSize: 10000})
  return data
}

// 新建合同
export async function addlist(query: any) {
  const data = await post('/customer/contracts', query)
  return data
}

// 编辑合同
export async function setlist(id: any , query: any) {
  const data = await put(`/customer/contracts/${id}`, query)
  return data
}





