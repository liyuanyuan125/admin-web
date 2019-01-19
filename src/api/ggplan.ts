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

// 计划审核
export async function queryAudit(id: any, query: any) {
  const data = await put(`/xadvert/plans/${id}/approval`, query)
  return data
}

// 导出影院
export async function downLoad(id: any) {
  const data = await get(`/xadvert/plans/${id}/export`, {}, { responseType: 'arraybuffer'})
  return data
}
