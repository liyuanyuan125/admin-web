import { get } from '@/fn/ajax'

/**
 * 根据条件，查询列表
 * https://yapi.aiads-dev.com/project/22/interface/api/56
 * @param query 查询条件，参见接口文档
 */
export async function queryAllList(query: any) {
  const { data } = await get('/theater/cinemas', query)
  return data
}

/**
 * 查询指定公司下的影院列表
 * https://yapi.aiads-dev.com/project/22/interface/api/1442
 * @param query 查询条件，参见接口文档
 */
export async function queryCompanyList(query: any) {
  const { data } = await get('/theater/cinemas/query-for-company', query)
  return data
}
