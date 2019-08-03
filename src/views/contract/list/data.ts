import { get, post, put } from '@/fn/ajax'
import {
  fillByKeyText,
  formatIntDateRange,
  formatTimestamp,
} from '@/util/dealData'
import { KeyText } from '@/util/types'

/**
 * 查询合同列表
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/34/interface/api/5233
 */
export async function queryList(query: any = {}) {
  const { data } = await get('/customer/contracts', query)

  const result = {
    ...data,

    items: ((data.items as any[]) || []).map(it => ({
      ...it,
      validityDate: formatIntDateRange(it.validityStartDate, it.validityEndDate),
      createTimeText: formatTimestamp(it.createTime),
    })),

    hasSettlementPriceList: [{ key: 1, text: '有' }, { key: 2, text: '无' }]
  }

  return result
}

/**
 * 查询合同详情
 * https://yapi.aiads-dev.com/project/34/interface/api/5212
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id } = query
  const { data } = await get(`/customer/contracts/${id}`)

  const {
    cityGradeList = []
  } = data

  const {
    validityStartDate = 0,
    validityEndDate = 0
  } = data.item || {}

  const item = data.item || {}

  const filterCinema = (it: any) => {
    return fillByKeyText(it, {
      cityGradeCode: cityGradeList
    })
  }

  const result = {
    ...data,
    item: {
      ...item,
      validityDate: [
        validityStartDate,
        validityEndDate
      ],
      settlementPrice: {},
      accountBank: '',
      accountName: '',
      accountNumber: '',
      cinemaList: (item.details || []).map(filterCinema),
    },
    filterCinema,
  }

  return result
}

// 按照接口要求，处理数据
const dealEditItem = (item: any) => {
  const data = {
    // 基本信息

    // 审核意见
    remark: item.remark
  }

  return data
}

/**
 * 新建平台账号
 * https://yapi.aiads-dev.com/project/142/interface/api/2654
 * @param postData 数据
 */
export async function newItem(postData: any) {
  const { data } = await post('/kol/channel-accounts', postData)
  return data
}

/**
 * 编辑平台账号
 * https://yapi.aiads-dev.com/project/142/interface/api/3014
 * @param item 数据
 */
export async function editItem(item: any) {
  const pdata = dealEditItem(item)
  const { data } = await put(`/kol/channel-accounts/${item.channel}/${item.id}`, pdata)
  return data
}

/**
 * 审核平台账号
 * https://yapi.aiads-dev.com/project/142/interface/api/3030
 * @param postData 数据
 */
export async function auditItem(postData: any) {
  const { data } = await put(`/kol/channel-accounts/approve`, postData)
  return data
}
