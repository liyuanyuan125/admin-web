import { get, post, put } from '@/fn/ajax'
import { dot, intDate, readableThousands, validDate, baifen, wanfen } from '@/util/dealData'
import { KeyText, MapType } from '@/util/types'
import { keyBy } from 'lodash'
import moment from 'moment'
import { devLog } from '@/util/dev'

const nullNumber = (value: any, format?: (num: number) => any) => {
  const num = parseFloat(value)
  return isNaN(num) ? null : (format ? format(num) : num)
}

const nullBaifen = (value: any) => nullNumber(value, baifen)

const nullWanfen = (value: any) => nullNumber(value, wanfen)

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

const makeAgeList = (enumList: KeyText[], values: Array<{ k: string, r: number }>) => {
  const map = keyBy(values, 'k')
  const result = enumList.map(it => ({
    key: it.key,
    text: it.text,
    value: nullBaifen(dot(map[it.key], 'r'))
  }))
  return result
}

const makeFansList = (values: Array<{ id: number, name: string, rate: number }>) => {
  const result = (values || []).map(it => ({
    id: it.id,
    name: it.name,
    value: nullBaifen(it.rate)
  }))
  return result
}

const makePriceList = (
  enumList: KeyText[],
  values: Array<{
    categoryCode: string,
    effectiveDate: number,
    settlementPrice: number
  }>
) => {
  const map = keyBy(values, 'categoryCode')
  const result = enumList.map(it => ({
    key: it.key,
    text: it.text,
    value: dot(map[it.key], 'settlementPrice'),
    date: validDate(dot(map[it.key], 'effectiveDate'))
  }))
  return result
}

/**
 * 付款单详情
 * http://yapi.aiads-dev.com/project/142/interface/api/2902
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id, channel } = query
  const { data } = await get(`/kol/channel-accounts/${channel}/${id}`)
  const { ageList, publishCategoryList, logList = [] } = data

  // 审核状态：1 待审核，2 审核通过，3 审核拒绝
  const status = parseInt(dot(data, 'item.status'), 10) || 0

  const result = {
    ...data,
    item: {
      ...data.item,
      intro: dot(data, 'item.customIntroduction') || '',
      area: [
        parseInt(dot(data, 'item.provinceId'), 10) || 0,
        parseInt(dot(data, 'item.cityId'), 10) || 0,
      ],
      authName: dot(data, 'item.authName') || '',

      // 粉丝画像
      fansCount: nullNumber(dot(data, 'item.customFans.totalCount')),
      malePercent: nullBaifen(dot(data, 'item.customFans.maleRate')),
      femalePercent: nullBaifen(dot(data, 'item.customFans.femaleRate')),
      ageList: makeAgeList(ageList, dot(data, 'item.customFans.ages')),
      provinceList: makeFansList(dot(data, 'item.customFans.provinces')),
      cityList: makeFansList(dot(data, 'item.customFans.cities')),

      // 结算信息
      priceList: makePriceList(publishCategoryList, dot(data, 'item.settlementPrices')),

      // 审核是否通过，默认通过
      auditPass: status != 3,

      // 是否被审核过（通过或拒绝）
      audited: status == 2 || status == 3,

      logList,
    },
    typeList: [
      { key: 1, text: '个人' },
      { key: 2, text: '公司' },
    ],
  }

  return result
}

/**
 * 付首款
 * http://yapi.aiads-dev.com/project/142/interface/api/2918
 * @param item 数据
 */
 export async function editItem(item: any) {
  const pdata = dealEditItem(item)
  const { data } = await put(`/kol/payment-bills/pay-advance-fee`, pdata)
  return data
}

/**
 * 付尾款
 * http://yapi.aiads-dev.com/project/142/interface/api/2926
 * @param postData 数据
 */
export async function auditItem(postData: any) {
  const { data } = await put(`/kol/payment-bills/pay-rest-fee`, postData)
  return data
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
    pageSize: 888,
  }
  keyword && (query.nameCn = keyword)

  const {
    data: {
      items
    }
  } = await get('/basis/districts', query)

  const list = (items as any[] || []).map(it => ({
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
    pageSize: 888,
  }
  keyword && (query.nameCn = keyword)

  const {
    data: {
      items
    }
  } = await get('/basis/districts/cities', query)

  const list = (items as any[] || []).map(it => ({
    id: it.id as number,
    name: it.nameCn as string
  }))

  return list
}

const dealAreaList = (list: any[]) => list.map(it => ({
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

    // 粉丝画像
    customFans: {
      maleRate: nullWanfen(item.malePercent),
      femaleRate: nullWanfen(item.femalePercent),
      ages: (item.ageList as any[]).map(it => ({
        k: it.key,
        r: nullWanfen(it.value)
      })),
      provinces: dealAreaList(item.provinceList),
      cities: dealAreaList(item.cityList),
      totalCount: item.fansCount || null
    },

    // 结算信息
    settlementPrices: (item.priceList as any[]).map(it => ({
      categoryCode: it.key,
      effectiveDate: it.date ? moment(it.date).format('YYYYMMDD') : null,
      settlementPrice: it.value || null
    })),
    provideInvoice: item.provideInvoice,

    // 审核意见
    remark: item.remark,
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


