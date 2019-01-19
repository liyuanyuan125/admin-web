

import { get , post , put } from '@/fn/ajax'

// 列表
export async function queryList(query: any) {
  const data = await get('/xadvert/videos', query)
  return data
}

// 查看详情
export async function queryItem(id: any) {
  const data = await get(`/xadvert/videos/${id}`)
  return data
}


// 审核
export async function sapproval(id: any , query: any) {
  const res = await put(`/xadvert/videos/${id}/approval`, query)
  return res
}

export async function dataFrom(query: any) {
  const res = await get('/xadvert/videos', query)
  return res
}


// 获取公司详情
export async function companysList(query: any) {
  const data = await get('/customer/companies' , {pagesize: 10000})
  return data
}


