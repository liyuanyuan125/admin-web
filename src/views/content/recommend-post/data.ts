import { get, post, put, del } from '@/fn/ajax'
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
 * @param query 查询条件，http://yapi.aiads-dev.com/project/306/interface/api/6903
 */
export async function queryList(query: any = {}) {
  const data = await get(`/content/recommend-post/list`, query)
  return data
  return await mockGet(query, {
    'items|20': [
      {
        id: tid,
        name: title20,
        description: title20,
        updateTime: '20190101',
        updateUser: title20
      },
    ],
    totalCount: 20
  })
}

/**
 * 删除
 * http://yapi.aiads-dev.com/project/306/interface/api/7056
 * @param id
 */
export async function disabledItem(id: number) {
  const { data } = await del(`/content/recommend-post/delete/${id}`)
  return data
}

/**
 * 创建前准备数据
 * http://yapi.aiads-dev.com/project/306/interface/api/7182
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
 * http://yapi.aiads-dev.com/project/306/interface/api/6930
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id } = query
  const { data } = await get(`/content/recommend-post/detail/${id}`)
  return data
  return await mockGet(query, {
    item: {
      id: tid,
      name: title20,
      description: title20
    }
  })
}

/**
 * 编辑
 * http://yapi.aiads-dev.com/project/306/interface/api/6939
 * @param item 数据
 */
export async function editItem(item: any) {
  const { data } = await put(`/content/recommend-post/edit`, item)
  return data
}

/**
 * 新建
 * http://yapi.aiads-dev.com/project/306/interface/api/6921
 * @param postData 编辑项
 */
 export async function newItem(postData: any) {
  const pdata = {
    name: postData.name,
    description: postData.description,
    recommendId: postData.recommendId
  }
  const { data } = await post('/content/recommend-post/create', pdata)
  return data
}

