

import { get , post , put } from '@/fn/ajax'

export async function queryList(query: any) {
  const data = await get('/customer/contracts', query)
  return data
}

export async function queryId(query: any) {
  const data = await get(`/customer/contracts/${query}/`)
  return data
}



// // 新建主账号
// export async function addList(query: any) {
//   const res = await post('/customer/accounts', query)
//   return res
// }

export async function dataFrom(query: any) {
  const res = await get('/customer/contracts', query)
  return res
}

// 作废
export async function zuofei(id: any , query: any) {
  const res = await put(`/customer/contracts/${id}/status`, query)
  return res
}
// // 获取公司详情
// export async function companysList(query: any) {
//   const data = await get('/customer/companies', {pageSize: 10000})
//   return data
// }

// // 变更主账号
// export async function setchangeList(query: any) {
//   const res = await put(`/customer/accounts/set-main-account`, query)
//   return res
// }

// //  查看日志
// export async function loglist(query: any) {
//   const data = await get(`/customer/accounts/${query}/log`)
//   return data
// }
