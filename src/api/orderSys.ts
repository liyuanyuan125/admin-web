import { get , post , put } from '@/fn/ajax'

// 订单列表
export async function queryList(query: any) {
  const data = await get('/xadvert/v1/orders', query)
  return data
}

//  列表
export async function planlist(query: any) {
  const data = await get('/xadvert/v1/plans', query)
  return data
}

// 公司
export async function company(query: any) {
  const data = await get('/customer/companies', query)
  return data
}

// 订单详情
export async function queryItem(id: any ) {
  const data = await get(`/xadvert/v1/orders/${id}`)
  return data
}

// 关闭
export async function set(query: any) {
  const res = await put(`/xadvert/v1/orders/closed`, query)
  return res
}

// 结算
export async function number(id: any , query: any) {
  const res = await put(`/xadvert/execute-orders/${id}/settlement`, query)
  return res
}

// // 影院列表
// export async function cinemaList(id: any , query: any) {
//   const res = await get(`/xadvert/execute-orders/${id}/cinemas`, query)
//   return res
// }

// // 取消执行
// export async function cinemaCancel(id: any , query: any) {
//   const res = await put(`/xadvert/execute-orders/${id}/cinemas`, query)
//   return res
// }


// 影院列表
export async function cinemaList(id: any , query: any) {
  const res = await get(`/xadvert/v1/orders/${id}/receive-cinemas`, query)

  return res
}

// 取消执行
export async function cinemaCancel(query: any) {
  const res = await put(`/xadvert/v1/orders/cinema-cancel`, query)
  return res
}
