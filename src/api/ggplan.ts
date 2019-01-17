import { get , post , put } from '@/fn/ajax'

// 计划列表
export async function queryList(query: any) {
  const data = await get('/xadvert/plans', query)
  return data
}

// 计划详情
export async function queryDetail(id: any) {
  const data = await get(`/xadvert/plans/${id}`)
  return data
}
