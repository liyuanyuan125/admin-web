import { get, post, put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

export async function queryList(query: any) {
  // const res = await get('/list', query)
  // return res
  return await mockGet(query, {
    totalCount: 1,
    items: [
      {
        id: 286,
        cinemaId: 2503
      }
    ]
  })
}
