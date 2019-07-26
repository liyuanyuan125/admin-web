import { get, post, put } from '@/fn/ajax'
import { dot, intDate, readableThousands, validDate, baifen, wanfen } from '@/util/dealData'
import { KeyText, MapType } from '@/util/types'
import { keyBy } from 'lodash'
import moment from 'moment'
import { devLog } from '@/util/dev'

/**
 * 查询 KOL 平台账号
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/142/interface/api/3198
 */
export async function queryList(query: any = {}) {
  const { data } = await get('/kol/channel-accounts', query)

  const result = {
    ...data,

    items: (data.items as any[] || []).map(it => ({
      ...it,
      fansCount: dot(it, 'customFans.totalCount'),
      provideInvoiceText: it.provideInvoice ? '是' : '否',
      priceList: (it.settlementPrices as any[] || []).map(sub => {
        const price = readableThousands(sub.settlementPrice, '-', '0,0.00')
        return {
          name: sub.categoryName,
          price: price != '-' ? `￥${price}` : '-',
          date: sub.effectiveDate ? intDate(sub.effectiveDate) : '-'
        }
      }),
    })),

    hasSettlementPriceList: [
      { key: 1, text: '有' },
      { key: 2, text: '无' },
    ]
  }

  return result
}

const makeAgeList = (enumList: KeyText[], values: Array<{ k: string, r: number }>) => {
  const map = keyBy(values, 'k')
  const result = enumList.map(it => ({
    key: it.key,
    text: it.text,
    value: baifen(dot(map[it.key], 'r'))
  }))
  return result
}

const makeFansList = (values: Array<{ id: number, name: string, rate: number }>) => {
  const result = (values || []).map(it => ({
    id: it.id,
    name: it.name,
    value: baifen(it.rate)
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
    value: dot(map[it.key], 'settlementPrice') || 0,
    date: validDate(dot(map[it.key], 'effectiveDate'))
  }))
  return result
}

/**
 * 查询 KOL 详情
 * https://yapi.aiads-dev.com/project/142/interface/api/3054
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
      fansCount: parseInt(dot(data, 'item.customFans.totalCount'), 10) || 0,
      malePercent: baifen(dot(data, 'item.customFans.maleRate')),
      femalePercent: baifen(dot(data, 'item.customFans.femaleRate')),
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
      maleRate: wanfen(item.malePercent),
      femaleRate: wanfen(item.femalePercent),
      ages: (item.ageList as any[]).map(it => ({
        k: it.key,
        r: wanfen(it.value)
      })),
      provinces: dealAreaList(item.provinceList),
      cities: dealAreaList(item.cityList),
      totalCount: item.fansCount
    },

    // 结算信息
    settlementPrices: (item.priceList as any[]).map(it => ({
      categoryCode: it.key,
      effectiveDate: it.date ? moment(it.date).format('YYYYMMDD') : 0,
      settlementPrice: it.value
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
 * @param item 数据
 */
export async function newItem(item: any) {
  const pdata = dealEditItem(item)
  const { data } = await post('/kol/channel-accounts', pdata)
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
 * @param data 数据
 */
export async function auditItem(postData: any) {
  const { data } = await put(`/kol/channel-accounts/approve`, postData)
  return data
}
