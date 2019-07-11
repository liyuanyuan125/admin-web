
// import { get } from '@/fn/ajax'
import { get , post , put , del } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

//  列表
export async function queryList(query: any) {
  const data = await get('/xadvert/plans', query)
  return data
}

//  查看详情
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

// // 添加影片列表
// export async function filmList(query: any) {
//   const data = await get(`/xadvert/plans/search-movie` , query)
//   return data
// }

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



