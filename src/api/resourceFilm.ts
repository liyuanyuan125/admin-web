import { get , post , put } from '@/fn/ajax'

// 资源位管理

// 影片资源管理-分页查询
export async function queryList(data: any) {
  const res = await get('/movie/resource/', data)
  return res
}

// 影片资源管理 - 详情
export async function queryDetail(id: any) {
  const res = await get(`/movie/resource/${id}`)
  return res
}

// 影片关联
export async function relevanceFilm(data: any) {
  const res = await get('/customer/movie-relations', data)
  return res
}

// 新建影片资源
export async function createResource(data: any) {
  const res = await get('movie/resource/', data)
  return res
}
