import { get , post , put , del } from '@/fn/ajax'

/**
 * @param  {any} query
 * https://yapi.aiads-dev.com/project/76/interface/api/755
 */
export async function queryList(query: any) {
  const data = await get('/finance/xadvertiser/statistics', query)
  return data
}
