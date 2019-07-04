import { get } from '@/fn/ajax'

/**
 * 查询 KOL 平台账号
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/142/interface/api/3198
 */
export async function queryList(query: any = {}) {
  const res = await get('/kol/channel-accounts', query)
  return res
}
