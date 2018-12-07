import { get , post , put } from '@/fn/ajax'

// 新建词条
export async function add(query: any) {
  const res = await post('/basis/dictionaries', query)
  return res
}

// 更新词条
export async function set(query: any) {
  const res = await put(`/basis/dictionaries/${query.id}`, query)
  return res
}

export async function dataFrom(query: any) {
  const res = await get('/basis/dictionaries', query)
  return res
}

export async function dictqueryList(query: any) {
  const data = await get('/basis/dictionaries', query)
  return data
}


