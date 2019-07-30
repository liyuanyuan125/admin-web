

import { get , post , put } from '@/fn/ajax'

// http://yapi.aiads-dev.com/project/140/interface/api/5372
export async function queryList(query: any) {
  const data = await get('/xadvert/payment-bills', query)
  return data
}

// 付款单详情
// http://yapi.aiads-dev.com/project/140/interface/api/5374
export async function queryItem(id: any) {
  const data = await get(`/xadvert/payment_bills/${id}`)
  return data
}

// 付款单付款
// http://yapi.aiads-dev.com/project/140/interface/api/5373
export async function bills(query: any) {
  const data = await put(`/xadvert/payment_bills`, query)
  return data
}


