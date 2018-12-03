import { get } from '@/fn/ajax'

export async function queryList(query: any) {
  const { data } = await get('', query)
  return data
}
