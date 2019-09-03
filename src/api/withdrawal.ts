import { get , post , put , del } from '@/fn/ajax'

/**
 * @param  {any} query
 */
export async function queryList(query: any) {
  const data = await get('/finance/withdrawal-bills', query)
  return data
}
