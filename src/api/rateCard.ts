import { get , post , put } from '@/fn/ajax'

// 档期查询
export async function drairesList(query: any) {
  const data = await get('/basis/calendars', query)
  return data
}

// 获取定价等级和影厅类型
export async function cinemaLevel() {
  const data = await get('/xadvert/cpms/grade-and-halltype')
  return data
}

// 根据定价等级获取影院数
export async function cinemanum(gradeCode: string) {
  const data = await get(`/xadvert/cpms/${gradeCode}/cinema-count`)
  return data
}

// 查询影院列表
export async function cinemaList(query: any) {
  const data = await get('/theater/cinemas/query-for-company', query)
  return data
}

// 根据影厅ID查询影厅详情
export async function cinemaCldList(id: any) {
  const data = await get(`/theater/halls/${id}`)
  return data
}

// 添加刊例价
export async function addRateCard(query: any) {
  const data = await post(`/xadvert/cpms`, query)
  return data
}

// 查看刊例价
export async function rateCardDetail(id: any) {
  const data = await get(`/xadvert/cpms/${id}`)
  return data
}
