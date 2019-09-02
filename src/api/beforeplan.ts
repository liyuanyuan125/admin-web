
// import { get } from '@/fn/ajax'
import { get , post , put , del } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

//  列表
export async function queryList(query: any) {
  const data = await get('/xadvert/plans', query)
  const result = {
    ...data,
    advertTypeCodeList: [],
    channelCodeList: [],
  }
  return result
}

//  查看详情
/**
 *
 * @description https://yapi.aiads-dev.com/project/140/interface/api/2550
 */
export async function itemlist(id: any) {
  const data = await get(`/xadvert/plans/${id}`)
  return data
}


//  删除影片
export async function delfilm(id: any , query: any) {
  const data = await del(`/xadvert/plans/${id}/movies`, query)
  return data
}

//  删除影院
export async function delcin(id: any , query: any) {
  const data = await del(`/xadvert/plans/${id}/cinemas`, query)
  return data
}

// 提交备注
export async function beizhu(id: any , query: any) {
  const data = await post(`/xadvert/plans/${id}/remarks`, query)
  return data
}

//  关联影院列表
export async function cinemaList(id: any , query: any) {
  const data = await get(`/xadvert/plans/${id}/cinemas`, query)
  return data
}

// 修改资源方影院
export async function aresids(id: any , query: any) {
  const data = await post(`/xadvert/plans/${id}/cinemas/resources`, query)
  return data
}

// 关闭订单
export async function closeid(id: any) {
  const data = await post(`/xadvert/plans/${id}/close`)
  return data
}

// 添加影院
export async function addcinema(id: any , query: any) {
  const data = await post(`/xadvert/plans/${id}/cinemas`, query)
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
  const data = await post(`/xadvert/plans/${id}/movies` , query)
  return data
}

// 保存方案
export async function save(id: any, query: any) {
  const data = await post(`/xadvert/plans/${id}/business-approve`, query )
  return data
}

// 查看城市
export async function viewcity(id: any ) {
  const data = await get(`/xadvert/plans/${id}/cities` )
  return data
}

// 刷新
export async function revuew(id: any ) {
  const data = await get(`/xadvert/plans/${id}/recommend` )
  return data
}

// 修改应结金额.
// http://yapi.aiads-dev.com/project/140/interface/api/5381
export async function needamount(id: any, query: any) {
  const data = await post(`/xadvert/plans/${id}/set-need-pay-amount`, query )
  return data
}

// 核对广告计划
// http://yapi.aiads-dev.com/project/140/interface/api/5380
// export async function check(id: any, query: any) {
//   const data = await post(`/xadvert/plans/${id}/check`, query )
//   return data
// }

// // 商务审核方案（设置定金）
// // http://yapi.aiads-dev.com/project/140/interface/api/5379
// export async function business(id: any, query: any) {
//   const data = await post(`/xadvert/plans/{id}/business-approve_1564030188070`, query )
//   return data
// }

// 设置折扣/定金
// http://yapi.aiads-dev.com/project/140/interface/api/5876
export async function business(id: any, query: any) {
  const data = await post(`/xadvert/plans/${id}/set-discount-deposit`, query )
  return data
}

// 补单操作
// http://yapi.aiads-dev.com/project/140/interface/api/5981
export async function addList(id: any) {
  const data = await post(`/xadvert/plans/${id}/confirm-supplement` )
  return data
}


// 导入影院
// https://yapi.aiads-dev.com/project/140/interface/api/6093
export async function importCinema(id: any) {
  const data = await post(`/xadvert/plans/${id}/import-cinema` )
  return data
}

//  设置广告片投放位置
/**
 *
 * @description http://yapi.aiads-dev.com/project/140/interface/api/6230
 */
export async function deliveryposition(id: any , query: any) {
  const data = await post(`/xadvert/plans/${id}/set-delivery-position` , query)
  return data
}




