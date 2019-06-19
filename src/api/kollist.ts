
// import { get } from '@/fn/ajax'
import { get , post , put , del } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'


//  列表
export async function queryList(query: any) {
  const data = await get('/kol/orders', query)
  return data
}

//  查看详情
export async function itemlist(orderId: any) {
  const data = await get(`/kol/orders/details/${orderId}`)
  return data
}

//  商务确认订单
export async function biz(  query: any) {
  const data = await put(`/kol/orders/biz-confirm`, query)
  return data
}

//  财务审核订单
export async function finance(query: any) {
  const data = await put(`/kol/orders/finance-approval`, query)
  return data
}

//  支付首款
export async function advance(query: any) {
  const data = await put(`/kol/orders/pay-advance`, query)
  return data
}

// 商务接单
export async function recept( query: any) {
  const data = await put(`/kol/orders/recept`, query)
  return data
}

//  支付尾款
export async function rest( query: any) {
  const data = await put(`/kol/orders/pay-rest`, query)
  return data
}


//  取消订单
export async function cancel(orderId: any ,  query: any) {
  const data = await put(`/kol/orders/cancle/${orderId}`, query)
  return data
}

//  商务确认编辑
export async function edit( query: any) {
  const data = await put(`/kol/orders/biz-edit`, query)
  return data
}

//  商务确认删除
export async function move(orderItemId: any  ) {
  const data = await del(`/kol/orders/biz-move/${orderItemId}` )
  return data
}

