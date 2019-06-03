
// import { get } from '@/fn/ajax'
import { get , post , put , del } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'


//  列表
export async function queryList(query: any) {
  const data = await get('/xadvert/v1/play-monitors', query)
  return data
}

//  查看详情
export async function itemlist(id: any) {
  const data = await get(`/xadvert/v1/play-monitors/${id}`)
  return data
}


//  单个通过审核
export async function okpass(id: any , query: any) {
  const data = await put(`/xadvert/v1/play-monitors/${id}/pass`, query)
  return data
}

//  单个拒绝审核
export async function refuse(id: any , query: any) {
  const data = await put(`/xadvert/v1/play-monitors/${id}/refuse`, query)
  return data
}

export async function cinames(query: any) {
  const data = await get('/theater/cinemas', query)
  return data
}

//  批量通过审核
export async function okpasslist(query: any) {
  const data = await put(`/xadvert/v1/play-monitors/batch-pass`, query)
  return data
}

//  批量拒绝审核
export async function refuselist(query: any) {
  const data = await put(`/xadvert/v1/play-monitors/batch-refuse`, query)
  return data
}



