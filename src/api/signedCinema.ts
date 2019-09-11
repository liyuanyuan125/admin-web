import { get, post, put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'
import { filterByControlStatus } from '@/util/dealData'

/**
 * 获取绑定有效影院的数目
 * @description http://yapi.aiads-dev.com/project/34/interface/api/6290
 */
export async function queryCinemaCount() {
  const res = await get('/customer/cinema-companies/count')
  return res
}

/**
 * 列表
 * @description http://yapi.aiads-dev.com/project/34/interface/api/6065
 */
export async function queryList(query: any) {
  const res = await get('/customer/companies/cinemas', query)
  return res
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

/**
 * 根据条件，查询影院列表
 * https://yapi.aiads-dev.com/project/22/interface/api/56
 * @param query 查询条件，参见接口文档
 */
 export async function remoteSelectCinemaQuery(query: any) {
  const { data } = await get('/theater/cinemas', query)
  const list = filterByControlStatus(data.items).map(it => ({
    id: it.id as number,
    name: it.shortName as string
  }))
  return list
}

/**
 * 模糊查询 获取影投列表
 * http://yapi.aiads-dev.com/project/34/interface/api/6072
 * @param query 查询条件，参见接口文档
 */
 export async function remoteSelectCinemaCompanyQuery(query: any) {
  const { data } = await get('/customer/cinema-companies', query)
  const list = data.items ? data.items.map((it: any) => {
    return {
      id: it.id as number,
      name: it.name as string
    }
  }) : []
  return list
}
