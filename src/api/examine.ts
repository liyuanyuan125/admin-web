

import { get , post , put } from '@/fn/ajax'

export async function queryList(query: any) {
  // const data = await get('/finance/recharges', query)
  const data = await get('/finance/lineUnderRemittances', query)
  return data
}

export async function queryItem(query: any) {
  const data = await get(`/finance/recharges/${query}`)
  return data
}


// 新建充值
export async function addList(query: any) {
  const res = await post('/finance/recharges', query)
  return res
}

export async function dataFrom(query: any) {
  const res = await get('/finance/recharges', query)
  return res
}

// 审核状态
export async function setList(query: any) {
  // const res = await put(`/finance/recharges/${id}/approval`, query)
  const res = await put(`/finance/lineUnderRemittances/approval`, query)
  return res
}


// 获取公司详情
export async function companysList(query: any) {
  const data = await get('/customer/companies', {pageSize: 10000})
  return data
}

// 获取数据类型
export async function types(query: any) {
  const data = await get('/finance/recharges/view', {pageSize: 10000})
  return data
}


// 获取当前登录用户信息用户
export async function authinfos(query: any) {
  const data = await get('/auth/infos', query)
  return data
}

// 根据id获取当前登录用户信息用户详情
export async function userqueryItem(query: any) {
  const data = await get(`/auth/users/${query}`)
  return data
}



