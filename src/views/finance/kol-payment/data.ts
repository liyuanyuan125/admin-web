import { get, post, put } from '@/fn/ajax'
import { dot, intDate, readableThousands, validDate, baifen, wanfen } from '@/util/dealData'
import { KeyText, MapType } from '@/util/types'
import { keyBy } from 'lodash'
import moment from 'moment'
import { devLog } from '@/util/dev'
import { mockGet, tid, title20, typeInt, dateRange } from '@/api/mock'

import { findIndex } from 'lodash'
const getName = (key: string, list: any[]) => {
  const i: number = findIndex(list, (it: any) => {
    return key === it.key
  })
  const res: string = list[i].text || '-'
  return res
}

const nullNumber = (value: any, format?: (num: number) => any) => {
  const num = parseFloat(value)
  return isNaN(num) ? null : (format ? format(num) : num)
}

const nullBaifen = (value: any) => nullNumber(value, baifen)

const nullWanfen = (value: any) => nullNumber(value, wanfen)


// 付首款，处理数据
const dealAdvanceItem = (item: any) => {
  const data = {
    // 基本信息
    id: item.id,
    remark: item.remark,
    amount: item.thisAmount
  }

  return data
}

// 付尾款，处理数据
const dealPayRestItem = (item: any) => {
  const data = {
    // 基本信息
    id: item.id,
    remark: item.remark,
    amount: item.thisAmount
  }

  return data
}

/**
 * 分页获取付款单列表
 * @param query 查询条件
 * http://yapi.aiads-dev.com/project/142/interface/api/2894
 */
export async function queryList(query: any = {}) {
  const { data } = await get('/kol/playment-bills', query)

  const result = {
    ...data
  }
  return result
}

/**
 * 付款单详情
 * http://yapi.aiads-dev.com/project/142/interface/api/2902
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id, channel } = query
  const { data } = await get(`/kol/payment-bills/${id}`)
  const { ageList, publishCategoryList, logList = [] } = data

  // 审核状态：1 待审核，2 审核通过，3 审核拒绝
  const status = parseInt(dot(data, 'item.status'), 10) || 0

  const result = {
    ...data,
    item: {
      ...data.item,
      payStatusCode: data.item.paymentBill.payStatus,
      payStatus: getName(data.item.paymentBill.payStatus, data.payStatusList),
      totalFee: data.item.paymentBill.totalFee,
      paidAmount: data.item.paymentBill.paidAmount,
      thisAmount: data.item.paymentBill.thisAmount,
      remark: ''
    },
  }

  return result
}

/**
 * 付首款
 * http://yapi.aiads-dev.com/project/142/interface/api/2918
 * @param item 数据
 */
 export async function payAdvance(item: any) {
  const pdata = dealAdvanceItem(item)
  const { data } = await put(`/kol/payment-bills/pay-advance-fee`, pdata)
  return data
}

/**
 * 付尾款
 * http://yapi.aiads-dev.com/project/142/interface/api/2926
 * @param postData 数据
 */
export async function payRest(item: any) {
  const pdata = dealPayRestItem(item)
  const { data } = await put(`/kol/payment-bills/pay-rest-fee`, pdata)
  return data
}


/**
 * 查询kol账号
 * https://yapi.aiads-dev.com/project/142/interface/api/3198
 * @param keyword 查询关键字
 */
export async function queryKolAcounts(query: any) {
  const podata: MapType<any> = {
    channelCode: query.channelCody,
    channelDataName: query.keyword,
    pageIndex: 1,
    pageSize: 888,
  }

  const res = await get('/kol/channel-accounts', podata)

  return res
}
