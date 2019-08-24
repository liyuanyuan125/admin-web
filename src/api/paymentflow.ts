import { get, post, put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

/**
 *
 * @description https://yapi.aiads-dev.com/project/76/interface/api/5988
 */
export async function queryList(query: any) {
  const res = await get('/finance/payFlows', query)
  return res
  return await mockGet(query, {
    totalCount: 1,
    items: [
      {
        id: 286,
        orderNo: 2503
      }
    ]
  })
}
