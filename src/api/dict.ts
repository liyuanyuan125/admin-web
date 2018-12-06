

import { get , post , put } from '@/fn/ajax'

export async function queryList(query: any) {
  const data = await get('/basis/dictionary-categories', query)
  return data
}


// 新建
export async function add(query: any) {
  const res = await post('/basis/dictionary-categories', query)
  return res
}

// 更新

export async function set(query: any) {
  const res = await put('/basis/dictionary-categories', query)
  return res
}

export async function dictqueryList(query: any) {
  const data = await get('/basis/dictionaries', query)
  return data
}



