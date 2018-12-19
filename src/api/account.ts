

import { get , post , put } from '@/fn/ajax'

export async function queryList(query: any) {
  const data = await get('/customer/accounts', query)
  return data
}

export async function queryItem(query: any) {
  const data = await get(`/customer/accounts/${query}/`)
  return data
}



// 新建主账号
export async function addList(query: any) {
  const res = await post('/customer/accounts', query)
  return res
}

export async function dataFrom(query: any) {
  const res = await get('/customer/accounts', query)
  return res
}

// 修改主账号状态
export async function setList(query: any) {
  const res = await put(`/customer/accounts/status`, query)
  return res
}
// 获取公司详情
export async function companysList(query: any) {
  const data = await get('/customer/companys', query)
  return data
}

// 修改主账号状态
export async function setchangeList(query: any) {
  const res = await put(`/customer/accounts/companyMainAccount`, query)
  return res
}


