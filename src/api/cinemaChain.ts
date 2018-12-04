import { get } from '@/fn/ajax'

export async function queryList(query: any) {
  const res = await get('', query)
  return res
}
