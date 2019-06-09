
// import { get } from '@/fn/ajax'
import { get , post , put , del } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'


//  列表
export async function queryList(query: any) {
  const data = await get('/kol/refunds', query)
  return data
}

//  查看详情
export async function itemlist(id: any) {
  const data = await get(`/kol/refunds/${id}`)
  return data
}

//  查看详情
export async function item(orderNo: any) {
  const data = await get(`/kol/refunds/${orderNo}/view`)
  return data
}

//  申请退款
export async function finance(orderNo: any , query: any) {
  const data = await post(`/kol/refunds/${orderNo}/apply`, query)
  return data
}

//  确定退款
export async function oktui(id: any) {
  const data = await put(`/kol/refunds/${id}/confirm-refund`)
  return data
}

//  删除退款单
export async function delorder(id: any) {
  const data = await del(`/kol/refunds/${id}/delete`)
  return data
}


