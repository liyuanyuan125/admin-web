import { get, put } from '@/fn/ajax'
import { dot } from '@/util/dealData'

/**
 * 查询 KOL 平台账号
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/142/interface/api/3198
 */
export async function queryList(query: any = {}) {
  const { data } = await get('/kol/channel-accounts', query)
  const result = {
    ...data,
    items: (data.items as any[] || []).map(it => ({
      ...it,
      fansCount: dot(it, 'customFans.totalCount')
    }))
  }
  return result
}

/**
 * 上架平台资源
 * http://yapi.aiads-dev.com/project/142/interface/api/3110
 */
export async function kolUpper(query: any = {}) {
  const res = await put('/kol/channel-accounts/upper')
  return res
}

/**
 * 下架平台资源
 * http://yapi.aiads-dev.com/project/142/interface/api/3110
 */
export async function kolOff(query: any = {}) {
  const res = await put('/kol/channel-accounts/off')
  return res
}
