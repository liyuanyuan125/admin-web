
// import { get } from '@/fn/ajax'
import { get , post , put , del } from '@/fn/ajax'

//  列表
export async function queryList(query: any) {
  const data = await get('/movie/cooperation/', query)
  return data
}

//  新建合作
export async function adds(query: any) {
  const data = await post('/movie/cooperation/', query)
  return data
}


//  id查询
export async function itemlist(id: any) {
  const data = await get(`/movie/cooperation/${id}`)
  return data
}


//  影片列表
export async function film(query: any) {
  const data = await get(`/movie/`, query)
  return data
}

//  修改状态
export async function changestatus(id: any , query: any) {
  const data = await put(`/movie/cooperation/${id}`, query)
  return data
}

//  修改状态
export async function movielist(id: any) {
  const data = await get(`/movie/resource/movie/${id}`)
  return data
}
