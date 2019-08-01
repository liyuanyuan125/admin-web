import { get, post, put } from '@/fn/ajax'
import {
  dot,
  intDate,
  readableThousands,
  validDate,
  formatIntDateRange,
  formatTimestamp,
  baifen,
  wanfen
} from '@/util/dealData'
import { KeyText, MapType } from '@/util/types'
import { keyBy } from 'lodash'
import moment from 'moment'
import { devLog } from '@/util/dev'

const nullNumber = (value: any, format?: (num: number) => any) => {
  const num = parseFloat(value)
  return isNaN(num) ? null : format ? format(num) : num
}

const nullBaifen = (value: any) => nullNumber(value, baifen)

const nullWanfen = (value: any) => nullNumber(value, wanfen)

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
      createTimeText: formatTimestamp(it.createTime)
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
    validityStartDate = 0,
    validityEndDate = 0
  } = data.item || {}

  const result = {
    ...data,
    item: {
      ...data.item,
      validityDate: [
        validityStartDate,
        validityEndDate
      ]
    },
  }

  return result
}

/**
 * 查询省份
 * https://yapi.aiads-dev.com/project/16/interface/api/125
 * @param keyword 查询关键字
 */
export async function queryProvince(keyword: string) {
  const query: MapType<any> = {
    parentIds: 0,
    pageIndex: 1,
    pageSize: 888
  }
  keyword && (query.nameCn = keyword)

  const {
    data: { items }
  } = await get('/basis/districts', query)

  const list = ((items as any[]) || []).map(it => ({
    id: it.id as number,
    name: it.nameCn as string
  }))

  return list
}

/**
 * 查询城市
 * https://yapi.aiads-dev.com/project/16/interface/api/2518
 * @param keyword 查询关键字
 */
export async function queryCity(keyword: string) {
  const query: MapType<any> = {
    pageIndex: 1,
    pageSize: 888
  }
  keyword && (query.nameCn = keyword)

  const {
    data: { items }
  } = await get('/basis/districts/cities', query)

  const list = ((items as any[]) || []).map(it => ({
    id: it.id as number,
    name: it.nameCn as string
  }))

  return list
}

const dealAreaList = (list: any[]) =>
  list.map(it => ({
    id: it.id,
    name: it.name,
    rate: wanfen(it.value)
  }))

// 按照接口要求，处理数据
const dealEditItem = (item: any) => {
  const data = {
    // 基本信息
    name: item.name,
    customIntroduction: item.intro,
    accountCategoryCode: item.accountCategoryCode,
    channelCode: item.channel,
    channelDataId: item.channelDataId,
    provinceId: item.area[0],
    cityId: item.area[1],
    photo: item.photo,
    type: item.type,
    auth: item.auth,
    authName: item.authName,

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
