import { get, post, put } from '@/fn/ajax'

/**
 * @param  {any} query
 * 待申请付款
 */
export async function beforeList(query: any) {
  const res = await get('/xadvert/resource-bills', query)
  return res
}
