import { get } from '@/fn/ajax'

export async function queryList(query: any) {
  const res = await get('/theater/chains', query)
  return res
}
