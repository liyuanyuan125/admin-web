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
 * @param query 查询条件，http://yapi.aiads-dev.com/project/306/interface/api/6948
 */
 export async function queryList(query: any = {}) {
  const postId = query.postId || null
  const data = await get(`/content/recommend-data/${postId}/list`, query)
  return data
  return await mockGet(query, {
    'items|20': [
      {
        id: tid,
        name: title20,
        channels: [
          0,
          1,
          2
        ],
        beginTime: 20101010,
        endTime: 20101011,
        status: typeInt(0, 4),
        updateTime: 20101009,
        order: tid,
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
  const { data } = await del(`/content/recommend-data/delete/${id}`)
  return data
}

/**
 * isAdList 接口未提供，前端临时写死
 * @description 1=>是 2=>否
 */
const isADList = [
  {
    key: 1,
    text: '是'
  },
  {
    key: 2,
    text: '否'
  }
]


// API未提供，前端写死 isAD参数

/**
 * 创建前准备数据
 * http://yapi.aiads-dev.com/project/306/interface/api/7182
 * @param id
 */
export async function beforeCreate() {
  const { data } = await get(`/content/recommend-data/beforeCreate`)
  const {
    channelList
  } = data
  const result = {
    item: {
      channelList: channelList || [],
      isADList
    },
    channelList: channelList || [],
    isADList
  }
  return result
}

/**
 * 详情
 * http://yapi.aiads-dev.com/project/306/interface/api/7011
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id } = query
  const { data } = await get(`/content/recommend-data/detail/${id}`)
  const dealData = {
    ...data,
    isADList
  }
  if ( !data.item ) { return data }
  const beginTime = moment(data.item.beginTime).format('YYYYMMDD') || null
  const endTime = moment(data.item.endTime).format('YYYYMMDD') || null
  dealData.item.marketDate = [beginTime, endTime]
  return dealData
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
  const { id } = item || null
  const realData = {
    name: item.name,
    channels: item.channels,
    // beginTime: moment(item.beginTime, 'YYYYMMDD HH:mm:ss'),
    // endTime: moment(item.endTime, 'YYYY-MM-DD HH:mm:ss'),
    beginTime: moment(item.beginTime, 'YYYYMMDD').valueOf(),
    endTime: moment(item.endTime, 'YYYYMMDD').valueOf(),
    uploadPic: item.uploadPic,
    url: item.url,
    title: item.title,
    isAD: item.isAD
  }
  const { data } = await put(`/content/recommend-data/edit/${id}`, realData)
  return data
}

/**
 * 修改排序
 * http://yapi.aiads-dev.com/project/306/interface/api/7047
 * @param item 数据
 */
 export async function sortItem(postId: number, id: number, postData: any) {
  const { data } = await put(`/content/recommend-data/${postId}/${id}`, postData)
  return data
}

/**
 * 新建
 * http://yapi.aiads-dev.com/project/306/interface/api/6921
 * @param postData 编辑项
 */
export async function newItem(postData: any) {
  const { postId } = postData || null
  const realData = {
    name: postData.name,
    channels: postData.channels,
    beginTime: moment(postData.beginTime, 'YYYYMMDD').valueOf(),
    endTime: moment(postData.endTime, 'YYYYMMDD').valueOf(),
    uploadPic: postData.uploadPic,
    url: postData.url,
    title: postData.title,
    isAD: postData.isAD
  }
  const { data } = await post(`/content/recommend-data/${postId}/create`, realData)
  return data
}

