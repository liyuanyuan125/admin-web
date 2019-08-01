import { get, post, put } from '@/fn/ajax'

/**
 * @param  {any} query
 * 待申请付款
 */
export async function beforeList(query: any) {
  const res = await get('/xadvert/resource-bills', query)
  return res
}

/**
 * @param  {any} query
 * 请款单审批列表(含分页)
 * http://yapi.aiads-dev.com/project/140/interface/api/5367
 */
export async function billslist(orderIds: any) {
  const res = await get(`/xadvert/apply-bills/${orderIds}`)
  return res
}

/**
 * @param  {any} query
 * 请款单审批列表(含分页)
 * http://yapi.aiads-dev.com/project/140/interface/api/5367
 */
export async function addAudit(query: any) {
  const res = await post(`/xadvert/apply-bills`, query)
  return res
}


/**
 * @param  {any} query
 * 请款单审批列表(含分页)
 * http://yapi.aiads-dev.com/project/140/interface/api/5367
 */
export async function auditList(query: any) {
  const res = await get(`/xadvert/apply-bills`, query)
  return res
}
