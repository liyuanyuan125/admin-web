
// import { get } from '@/fn/ajax'
import { get , post , put , del } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'


//  列表
export async function queryList(query: any) {
  const data = await get('/xadvert/play-monitors', query)
  return data
}

//  查看详情
export async function itemlist(id: any) {
  const data = await get(`/xadvert/play-monitors/${id}`)
  return data
}


//  单个通过审核
export async function okpass(id: any , query: any) {
  const data = await put(`/xadvert/play-monitors/${id}/pass`, query)
  return data
}

//  单个拒绝审核
export async function refuse(id: any , query: any) {
  const data = await put(`/xadvert/play-monitors/${id}/refuse`, query)
  return data
}

export async function cinames(query: any) {
  const data = await get('/theater/cinemas', query)
  return data
}

//  批量通过审核
export async function okpasslist(query: any) {
  const data = await put(`/xadvert/play-monitors/batch-pass`, query)
  return data
}

//  批量拒绝审核
export async function refuselist(query: any) {
  const data = await put(`/xadvert/play-monitors/batch-refuse`, query)
  return data
}


//  商务负责人
export async function directorList(query: any) {
  const data = await get('/auth/users', query)
  return data
}

//  获取监播ids列表
export async function monitorsIds(query: any) {
  const data = await get(`/xadvert/play-monitors/ids`, query)
  return data
}

//  监播审核new
export async function approve(id: any , query: any) {
  const data = await put(`/xadvert/play-monitors/${id}/approve`, query)
  return data
}

// 监播恢复
export async function reset(id: any) {
  const data = await put(`/xadvert/play-monitors/${id}/reset`)
  return data
}


// 监播恢复
export async function addimg(id: any) {
  const data = await put(`/xadvert/play-monitors/${id}/set-allow-pic`)
  return data
}

