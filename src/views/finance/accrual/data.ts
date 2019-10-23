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

const queryReceiveListCommon = async (url: string, query: any = {}) => {
  const { data } = await get(url, query)
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
 * 查询应收金额月列表
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/253/interface/api/7110
 */
export async function queryReceiveList(query: any = {}) {
  return queryReceiveListCommon('/bi/amount-receivable-months', query)
}

/**
 * 应收金额月导出
 * @param month 月份
 * https://yapi.aiads-dev.com/project/253/interface/api/7236
 */
export async function exportReceiveList(month: number) {
  return queryReceiveListCommon('/bi/amount-receivable-months', { month })
}

/**
 * 应收金额日导出
 * @param id 月记录id
 * https://yapi.aiads-dev.com/project/253/interface/api/7245
 */
export async function exportReceiveDayList(id: string) {
  const { items } = await queryReceiveListCommon('/bi/export-amount-receivables', { id })
  const result = {
    items: (items as any[]).map(it => ({
      date: String(it.dt || '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    }))
  }
  return result
}

