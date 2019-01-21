import { get , post , put } from '@/fn/ajax'

// 档期查询
export async function drairesList(query: any) {
  const data = await get('/basis/calendars', query)
  return data
}
