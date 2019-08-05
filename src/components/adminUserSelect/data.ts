import { get } from '@/fn/ajax'

/**
 * 查询用户列表
 * https://yapi.aiads-dev.com/project/58/interface/api/491
 * @param query 查询条件，参见接口文档
 */
export async function queryList(query: any) {
  const { data } = await get('/auth/users', query)
  const list = (data.items as any[] || []).map(it => ({
    id: it.id as number,
    name: `${it.userName} [${it.email}]`
  }))
  return list
}
