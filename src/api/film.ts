import { get , post , put } from '@/fn/ajax'

// 影片管理 查询分页
export async function queryList(query: any) {
  const res = await get('/movie/', query)
  return res
}

// 同步
export async function syncData(query: any, type: number) {
  const res = await get(`/theater/movies/sync/${query}`, { type })
  return res
}

// 刷新
export async function reda(query: any) {
  const res = await get('/theater/movies', query)
  return res
}

/**
 * 更新f分类
 * @param id 要操作的ID
 * @param status 新的分类
 */
export async function updateStatus(id: string, categoryCode: number) {
  const res = await put(`/theater/movies/${id}`, {  categoryCode })
  return res
}

/**
 * 更新上映状态
 * @param id 要操作的ID
 * @param status 新的分类
 */
export async function updateRel(id: string, releaseStatus: number) {
  const res = await put(`/theater/movies/${id}`, {  releaseStatus })
  return res
}

/**
 * 更新转资ID
 * @param id 要操作的ID
 * @param specialId 转资ID
 */
export async function updateSpecialId(id: string, specialId: number) {
  const res = await put(`/theater/movies/${id}`, {  specialId })
  return res
}

/**
 * 更新控制状态
 * @param id 要操作的ID
 * @param controlStatus 新的状态值
 */
export async function updateControlStatus(id: string, controlStatus: number) {
  const res = await put(`/theater/movies/${id}`, { controlStatus })
  return res
}

export async function getIdDetal(nextId: any) {
  const res = await get(`/movie/${nextId.id}`)
  return res
}

