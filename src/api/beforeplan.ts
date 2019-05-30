
// import { get } from '@/fn/ajax'
import { get , post , put , del } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'


// export async function queryList(query: any) {
//   return await mockGet(query, {
//     'items|20': [{
//       orderNo: tid,
//       name: title20,
//       companyId: tid,
//       companyName: title20,
//       createTimeTemp: dateRange(),
//       channelCode: '微信',
//       shanwumoney: '123',
//       overmoney: '123',
//       dingdan: typeInt(1 , 3),
//       pingtai: typeInt(1 , 3),
//       status: typeInt(1 , 2),
//       orders: typeInt(1 , 9),
//       fapiao: typeInt(1 , 5),
//     }],
//     totalCount: 888,
//     pingtaiList: [
//       { text: '微信' , key: 1},
//       { text: '微博' , key: 2},
//       { text: '抖音' , key: 3},
//     ],
//     statusList: [
//       { text: '小红书' , key: 1},
//       { text: '快手' , key: 2},
//     ],
//     ordersList: [
//       { text: '草稿' , key: 1},
//       { text: '待商务确认' , key: 2},
//       { text: '待财务确认' , key: 3},
//       { text: '待支付首款' , key: 4},
//       { text: '派单中' , key: 5},
//       { text: '待执行' , key: 6},
//       { text: '执行中' , key: 7},
//       { text: '待支付尾款' , key: 8},
//       { text: '已完成' , key: 9},
//     ],
//     billStatusList: [
//       { text: '待申请' , key: 1},
//       { text: '待商务审核' , key: 2},
//       { text: '审核不通过' , key: 3},
//       { text: '带开票' , key: 4},
//       { text: '已开票' , key: 5},
//     ],
//   })
// }
//  列表
export async function queryList(query: any) {
  const data = await get('/xadvert/v1/plans', query)
  return data
}

//  查看详情
export async function itemlist(id: any) {
  const data = await get(`/xadvert/v1/plans/${id}`)
  return data
}


//  删除影片
export async function delfilm(id: any , query: any) {
  const data = await del(`/xadvert/v1/plans/${id}/movies`, query)
  return data
}

//  删除影院
export async function delcin(id: any , query: any) {
  const data = await del(`/xadvert/v1/plans/${id}/cinemas`, query)
  return data
}

// 提交备注
export async function beizhu(id: any , query: any) {
  const data = await post(`/xadvert/v1/plans/${id}/remarks`, query)
  return data
}

//  关联影院列表
export async function cinemaList(id: any , query: any) {
  const data = await get(`/xadvert/v1/plans/${id}/cinemas`, query)
  return data
}

// 修改资源方影院
export async function aresids(id: any , query: any) {
  const data = await post(`/xadvert/v1/plans/${id}/cinemas/resources`, query)
  return data
}

// 关闭订单
export async function closeid(id: any) {
  const data = await post(`/xadvert/v1/plans/${id}/close`)
  return data
}


// 添加影院
export async function addcinema(id: any , query: any) {
  const data = await post(`/xadvert/v1/plans/${id}/cinemas`, query)
  return data
}

// 查看指定公司下边的影院
export async function conpanylist(query: any) {
  const data = await get(`/theater/cinemas/query-for-company` , query)
  return data
}

// 添加影片列表
export async function filmList(query: any) {
  const data = await get(`/movie/` , query)
  return data
}

// 添加影片
export async function addfilm(id: any , query: any) {
  const data = await get(`/xadvert/v1/plans/${id}/movies` , query)
  return data
}


