

import { get , post , put , del } from '@/fn/ajax'

// 平台刊例价
export async function pingqueryList(query: any) {
  const data = await get('/xadvert/cpms/platform', query)
  return data
}

// 公司刊例价
export async function comqueryList(query: any) {
    const data = await get('/xadvert/cpms/company', query)
    return data
}

// 删除刊例价
export async function dels(id: any) {
  const res = await del(`/xadvert/cpms/${id}`)
  return res
}

// 获取影院定价等级
export async function pricingLevelList(query: any) {
  const data = await get('/theater/cinemas', {pageSize: 10000})
  return data
}


// 获取公司详情
export async function companysList(query: any) {
  const data = await get('/customer/companies', {pageSize: 10000})
  return data
}

