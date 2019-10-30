import { get, post, put } from '@/fn/ajax'
import { toMoney } from '@/util/dealData'
import { sum } from 'lodash'
import { devLog } from '@/util/dev'

/**
 * 查询应收应付统计表
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/253/interface/api/7038
 */
export async function queryList(query: any = {}) {
  const { data } = await get('/bi/amount-receivable-payable-totals', query)
  const result = {
    ...data,
    items: (data.items as any[] || []).map(it => ({
      ...it,
      month: String(it.id || '').replace(/(\d{4})(\d{2})/, '$1-$2')
    }))
  }
  return result
}

/**
 * 查询应收金额月列表
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/253/interface/api/7110
 */
export async function queryReceiveList(query: any = {}) {
  const { data } = await get('/bi/amount-receivable-months', query)
  const result = {
    ...data,
    items: (data.items as any[] || []).map(it => ({
      ...it,
      expendFormat: toMoney(it.expend),
      discountedPriceFormat: toMoney(it.discountedPrice),
      payableFormat: toMoney(it.payable),
    }))
  }
  return result
}

/**
 * 查询应付金额月列表
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/253/interface/api/7254
 */
export async function queryPayList(query: any = {}) {
  const { data } = await get('/bi/amount-payable-months', query)
  const result = {
    ...data,
    items: (data.items as any[] || []).map(it => ({
      ...it,
      amountPayableFormat: toMoney(it.amountPayable),
    }))
  }
  return result
}

/**
 * 查询应付金额月列表
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/253/interface/api/7281
 */
export async function queryReceivePayList(query: any = {}) {
  const { data } = await get('/bi/amount-receivable-payable-months', query)
  const result = {
    ...data,
    items: (data.items as any[] || []).map(it => ({
      ...it,
      amountReceivableFormat: toMoney(it.amountReceivable),
      amountPayableFormat: toMoney(it.amountPayable),
      amountReceivablePayableFormat: toMoney(it.amountReceivablePayable),
    }))
  }
  return result
}
