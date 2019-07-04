import { get, post, put } from '@/fn/ajax'

/**
 * 根据条件，查询列表
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3806
 */
export async function brandList(query: any) {
  const data = await get('/brand/brands', query)
  return data
}
