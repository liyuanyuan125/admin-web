import { get , post , put } from '@/fn/ajax'

// 下刊监控列表
// http://yapi.aiads-dev.com/project/253/interface/api/6341
export async function nextList(query: any) {
  const data = await get('/bi/off-shelf-reports', query)
  return data
}

// 下刊监控详情
// http://yapi.aiads-dev.com/project/253/interface/api/6349
export async function nextItem(id: any) {
  const data = await get(`/bi/off-shelf-reports/${id}`)
  return data
}

// 下刊影院列表
// http://yapi.aiads-dev.com/project/253/interface/api/6333
export async function nextCinema(query: any) {
  const data = await get(`/bi/off-shelf-report/cinemas` , query)
  return data
}

// 批量下刊
// http://yapi.aiads-dev.com/project/253/interface/api/6357
export async function cinemaOff(query: any) {
  const res = await put(`/bi/off-shelf-report/cinemas`, query)
  return res
}

// 通知下刊
// http://yapi.aiads-dev.com/project/253/interface/api/6365
export async function callCinemaOff(id: any) {
  const res = await put(`/bi/off-shelf-report/cinemas/${id}`)
  return res
}

