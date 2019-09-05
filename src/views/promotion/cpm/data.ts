import { get, post, put } from '@/fn/ajax'
import { dot, intDate, readableThousands, validDate, baifen, wanfen } from '@/util/dealData'
import { KeyText, MapType } from '@/util/types'
import { keyBy } from 'lodash'
import moment from 'moment'
import { devLog } from '@/util/dev'
import { mockGet, tid, title20, typeInt, dateRange } from '@/api/mock'

const nullNumber = (value: any, format?: (num: number) => any) => {
  const num = parseFloat(value)
  return isNaN(num) ? null : (format ? format(num) : num)
}

const nullBaifen = (value: any) => nullNumber(value, baifen)

const nullWanfen = (value: any) => nullNumber(value, wanfen)

// 组装编辑项内容
const dealEditItem = (item: any) => {
  const data = {
    // 基本信息
    id: item.id,
    name: item.name,
    beginTime: item.beginTime || null,
    endTime: item.endTime || null,
    channels: item.channels || [],
    customerType: item.customerType || 0,
    adTypes: item.adTypes || [],
    type: item.type || null,
    bizPricingList: item.bizPricingList || [],
    prevuePricingList: item.prevuePricingList || []
  }

  return data
}

/**
 * 列表
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3710
 */
export async function queryList(query: any = {}) {
  const data = await get(`/promotion/cpm/list`, query)
  return data
}

/**
 * 下线
 * https://yapi.aiads-dev.com/project/232/interface/api/6250
 * @param id
 */
export async function disabledItem(id: number) {
  const { data } = await put(`promotion/cpm/${id}/offline`)
  return data
}

/**
 * 创建前准备数据
 * https://yapi.aiads-dev.com/project/232/interface/api/6170
 * @param id
 */
export async function beforeCreate() {
  const { data } = await get(`promotion/cpm/view`)
  const {
    customerTypeList,
    channelList,
    adTypeList,
    typeList,
    statusList,
    bizPricingList,
    prevuePricingList
  } = data

  const result = {
    item: {
      customerType: 0,
      channels: [],
      adTypes: [],
      type: 0,
      bizPricingList: bizPricingList || [],
      prevuePricingList: prevuePricingList || []
    },
    customerTypeList: customerTypeList || [],
    channelList: channelList || [],
    adTypeList: adTypeList || [],
    typeList: typeList || [],
    statusList: statusList || [],
    bizPricingList: bizPricingList || [],
    prevuePricingList: prevuePricingList || [],
  }
  return result
}

/**
 * 详情
 * https://yapi.aiads-dev.com/project/232/interface/api/6206
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id } = query
  const { data } = await get(`/promotion/cpm/detail/${id}`)
  data.item.marketDate = []
  data.item.marketDate.push(data.item.beginTime)
  data.item.marketDate.push(data.item.endTime)
  if ( !data.item.prevuePricingList ) {
    data.item.prevuePricingList = data.prevuePricingList
  }
  if ( !data.item.bizPricingList ) {
    data.item.bizPricingList = data.bizPricingList
  }
  return data
}

/**
 * 编辑
 * https://yapi.aiads-dev.com/project/232/interface/api/6214
 * @param item 数据
 */
export async function editItem(item: any) {
  // bizPricingList
  const hasList1 = (item.adTypes.findIndex((it: any) => it == 1) !== -1) && item.type === 1 ? true
  : false
  // prevuePricingList
  const hasList2 = (item.adTypes.findIndex((it: any) => it == 2) !== -1) && item.type === 1 ? true
  : false
  item.bizPricingList = hasList1 ? item.bizPricingList : null
  item.prevuePricingList = hasList2 ? item.prevuePricingList : null
  const pdata = dealEditItem(item)
  const { data } = await put(`/promotion/cpm/edit`, pdata)
  return data
}

/**
 * 新建
 * https://yapi.aiads-dev.com/project/232/interface/api/6190
 * @param postData 编辑项
 */
 export async function newItem(postData: any) {
  const keyWordsContent = postData.keyWordsContent || null
  const imgsList = postData.imgsList || null
  const pdata = dealEditItem(postData)
  const { data } = await post('/promotion/cpm/create', pdata)
  return data
}

/**
 * 审核
 * https://yapi.aiads-dev.com/project/232/interface/api/6218
 * @param postData 数据
 */
export async function auditItem(postData: any) {
  const { id, pass, refuseReason} = postData
  const { data } = await put(`/promotion/cpm/${id}/audit`, { pass, refuseReason})
  return data
}

/**
 * 启用
 * http://yapi.aiads-dev.com/project/154/interface/api/3742
 * @param id
 */
 export async function enabledItem(id: number) {
  const { data } = await put(`brand/products/${id}/enabled`)
  return data
}
