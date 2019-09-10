import { get } from '@/fn/ajax'
import { filterByControlStatus } from '@/util/dealData'

/**
 * 根据条件，查询列表
 * https://yapi.aiads-dev.com/project/22/interface/api/56
 * @param query 查询条件，参见接口文档
 */
export async function companylist(query: any) {
  const { data } = await get('/movie/cooperation/', query)
  const list = filterByControlStatus(data.items).map(it => ({
    id: it.companyId as number,
    name: it.companyName as string
  }))
  return list
}

/**
 * 根据条件，查询列表
 * https://yapi.aiads-dev.com/project/22/interface/api/56
 * @param query 查询条件，参见接口文档
 */
// export async function companylist(query: any) {
//   const { data } = await get('/customer/companies', query)
//   const list = (data.items || []).map((it: any) => ({
//     id: it.id as number,
//     name: it.name as string
//   }))
//   return list
// }

export async function queryList(query: any) {
  const { data } = await get('/movie/cooperation/', query)
  const list = filterByControlStatus(data.items).map(it => ({
    id: it.movieId as number,
    name: it.movieName as string
  }))
  return list
}
