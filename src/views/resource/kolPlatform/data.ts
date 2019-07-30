import { get, put, post } from '@/fn/ajax'
import { dot, readableNumber } from '@/util/dealData'

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
      fansCount: readableNumber(dot(it, 'customFans.totalCount')),
      kolIdText: it.kolId || '-',
      provideInvoiceText: it.provideInvoice ? '是' : '否',
    }))
  }
  return result
}

/**
 * 上架平台资源
 * http://yapi.aiads-dev.com/project/142/interface/api/3110
 */
export async function kolUpper(query: any = {}) {
  const res = await put('/kol/channel-accounts/upper', query)
  return res
}

/**
 * 下架平台资源
 * http://yapi.aiads-dev.com/project/142/interface/api/3110
 */
export async function kolOff(query: any = {}) {
  const res = await put('/kol/channel-accounts/off', query)
  return res
}

/**
 * 修改定价
 * http://yapi.aiads-dev.com/project/142/interface/api/3110
 */
export async function changePrice(query: any = {}) {
  const res = await put('/kol/channel-accounts/change-price', query)
  return res
}

/**
 * 根据渠道编码和渠道数据ID查看详情
 * http://yapi.aiads-dev.com/project/142/interface/api/3902
 */
export async function details(channelCode: string, id: number) {
  const res = await get(`/kol/channel-accounts/${channelCode}/${id}`)
  return res
}
/**
 * 审核平台账号
 * http://yapi.aiads-dev.com/project/142/interface/api/3030
 */
export async function approve(data: any) {
  const res = await put('/kol/channel-accounts/approve-price', data)
  return res
}
