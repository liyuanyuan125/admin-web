import { get } from '@/fn/ajax'

/**
 * 查询公司列表
 * https://yapi.aiads-dev.com/project/34/interface/api/287
 * @param query 查询条件，参见接口文档
 */
export async function queryList(query: any) {
  const { data } = await get('/customer/companies', query)
  const list = (data.items as any[] || []).map(it => ({
    id: it.id as number,
    name: it.name as string
  }))
  return list
}
