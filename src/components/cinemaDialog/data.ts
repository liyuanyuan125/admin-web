import { get } from '@/fn/ajax'

/**
 * 根据条件，查询列表
 * https://yapi.aiads-dev.com/project/22/interface/api/56
 * @param query 查询条件，参见接口文档
 */
export async function queryList(query: any) {
  const { data } = await get('/theater/cinemas', query)
  return data
}
