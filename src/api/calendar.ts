import { get , post , put , del } from '@/fn/ajax'

export async function queryList(query: any) {
  const res = await get('/basis/calendars', query)
  return res
}

// 新建档期
export async function add(query: any) {
  const res = await post('/basis/calendars', query)
  return res
}

export async function dataFrom(query: any) {
  const res = await get('/basis/calendars', query)
  return res
}

// 更新档期
export async function set(query: any) {
  const res = await put(`/basis/calendars/${query.id}`, query)
  return res
}

// 删除档期
export async function dels(query: any) {
  const res = await del(`/basis/calendars/${query.id}`, query)
  return res
}


