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
    beginDate: item.beginDate || null,
    endDate: item.endDate || null,
    approvalName: item.approvalName || null,
    channelCodes: item.channelCodes || [],
    customerType: item.customerType || 0,
    status: item.status || 0,
    type: item.type || null,
    convertCosts: item.convertCosts.map((it: any) => {
      return {
        begin: it.begin,
        discount: it.discount,
        end: it.end
      }
    }) || null
  }

  return data
}

/**
 * 列表
 * @param query 查询条件，https://yapi.aiads-dev.com/project/232/interface/api/6178
 */
export async function queryList(query: any = {}) {
  const data = await get(`/promotion/convert-costs`, query)
  return data
}

/**
 * 下线
 * https://yapi.aiads-dev.com/project/232/interface/api/6242
 * @param id
 */
export async function disabledItem(id: number) {
  const { data } = await put(`promotion/convert-costs/${id}`)
  return data
}

/**
 * 创建前准备数据
 * https://yapi.aiads-dev.com/project/232/interface/api/6262
 * @param id
 */
 export async function beforeCreate() {
  const { data } = await get(`promotion/convert-costs/create`)

  const {
    convertCostList,
    customerTypeList,
    channelList,
    typeList
  } = data

  const result = {
    item: {
      ...data.item,
      convertCosts: convertCostList || []
    },
    customerTypeList: customerTypeList || [],
    channelList: channelList || [],
    typeList: typeList.filter((it: any) => it.key !== 2) || [],
  }
  return result
}

/**
 * 创建前准备数据
 * https://yapi.aiads-dev.com/project/232/interface/api/6266
 * @param id
 */
 export async function beforeEdit(query: any = {}) {
  const { id } = query
  const { data } = await get(`promotion/convert-costs/${id}/edit`)

  const {
    customerTypeList,
    channelList,
    typeList,
    item: {
      beginDate,
      endDate
    }
  } = data

  const result = {
    item: {
      ...data.item,
      marketDate: [beginDate, endDate]
    },
    customerTypeList: customerTypeList || [],
    channelList: channelList || [],
    typeList: typeList.filter((it: any) => it.key !== 2) || [],
  }
  return result
}

/**
 * 详情
 * https://yapi.aiads-dev.com/project/232/interface/api/6182
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id } = query
  const { data } = await get(`/promotion/convert-costs/${id}`)
  const {
    item: {
      beginDate,
      endDate
    }
  } = data
  data.item.marketDate = [beginDate, endDate]
  data.item.logList = data.logList
  data.typeList = data.typeList.filter((it: any) => it.key !== 2) || []
  return data
}

/**
 * 编辑
 * https://yapi.aiads-dev.com/project/232/interface/api/6198
 * @param item 数据
 */
export async function editItem(item: any) {

  const pdata = dealEditItem(item)
  const { data } = await put(`/promotion/convert-costs`, pdata)
  return data
}

/**
 * 新建
 * https://yapi.aiads-dev.com/project/232/interface/api/6186
 * @param postData 编辑项
 */
 export async function newItem(postData: any) {
  const keyWordsContent = postData.keyWordsContent || null
  const imgsList = postData.imgsList || null
  const pdata = dealEditItem(postData)
  const { data } = await post('/promotion/convert-costs', pdata)
  return data
}

/**
 * 审核
 * https://yapi.aiads-dev.com/project/232/interface/api/6194
 * @param postData 数据
 */
export async function auditItem(postData: any) {
  const { id, pass, refuseReason} = postData
  const { data } = await put(`/promotion/convert-costs/approval`, { id, agree: pass, refuseReason})
  return data
}
