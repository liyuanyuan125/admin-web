import { get , post , put } from '@/fn/ajax'

// 档期查询
export async function drairesList(query: any) {
  const data = await get('/basis/calendars', query)
  return data
}

// 获取影院定价级别
export async function cinemaLevel(query: any) {
  const data = await get('/theater/cinemas', query)
  return data
}

// 查询影院列表
export async function cinemaList(query: any) {
  const data = await get('/theater/cinemas', query)
  return data
}

// 根据影厅ID查询影厅详情
export async function cinemaCldList(id: any, query: any) {
  const data = await get(`/theater/halls/${id}`, query)
  return data
}
