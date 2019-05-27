
// import { get } from '@/fn/ajax'
import { get , post , put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'


export async function queryList(query: any) {
  return await mockGet(query, {
    'items|20': [{
      orderNo: tid,
      name: title20,
      companyId: tid,
      companyName: title20,
      createTimeTemp: dateRange(),
      channelCode: '微信',
      shanwumoney: '123',
      overmoney: '123',
      dingdan: typeInt(1 , 3),
      pingtai: typeInt(1 , 3),
      status: typeInt(1 , 2),
      orders: typeInt(1 , 9),
      fapiao: typeInt(1 , 5),
    }],
    totalCount: 888,
    pingtaiList: [
      { text: '微信' , key: 1},
      { text: '微博' , key: 2},
      { text: '抖音' , key: 3},
    ],
    statusList: [
      { text: '小红书' , key: 1},
      { text: '快手' , key: 2},
    ],
    ordersList: [
      { text: '草稿' , key: 1},
      { text: '待商务确认' , key: 2},
      { text: '待财务确认' , key: 3},
      { text: '待支付首款' , key: 4},
      { text: '派单中' , key: 5},
      { text: '待执行' , key: 6},
      { text: '执行中' , key: 7},
      { text: '待支付尾款' , key: 8},
      { text: '已完成' , key: 9},
    ],
    billStatusList: [
      { text: '待申请' , key: 1},
      { text: '待商务审核' , key: 2},
      { text: '审核不通过' , key: 3},
      { text: '带开票' , key: 4},
      { text: '已开票' , key: 5},
    ],
  })
}
//  列表
// export async function queryList(query: any) {
//   const data = await get('/kol/orders', query)
//   return data
// }

//  查看详情
export async function itemlist(orderNo: any) {
  const data = await get('/kol/orders/details/${orderNo}')
  return data
}

//  商务确认订单
export async function biz(orderId: any , query: any) {
  const data = await put(`/kol/orders/biz-confirm/${orderId}`, query)
  return data
}

//  财务审核订单
export async function finance(orderId: any , query: any) {
  const data = await put(`/kol/orders/finance-approval/${orderId}`, query)
  return data
}

//  支付首款
export async function advance(orderId: any , query: any) {
  const data = await put(`/kol/orders/pay-advance/${orderId}`, query)
  return data
}

// 接单
export async function recept(orderId: any , query: any) {
  const data = await put(`/kol/orders/recept/${orderId}`, query)
  return data
}

//  支付尾款
export async function rest(orderId: any , query: any) {
  const data = await put(`/kol/orders/pay-rest/${orderId}`, query)
  return data
}




