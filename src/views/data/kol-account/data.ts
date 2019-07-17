import { get } from '@/fn/ajax'
import { dot, intDate, readableThousands, validDate } from '@/util/dealData'
import { KeyText, MapType } from '@/util/types'
import { keyBy } from 'lodash'

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
      kolIdText: it.kolId || '-',
      provideInvoiceText: it.provideInvoice ? '是' : '否',
      priceList: (it.settlementPrices as any[] || []).map(sub => {
        const price = readableThousands(sub.settlementPrice, '-', '0,0.00')
        return {
          name: sub.categoryName,
          price: price != '-' ? `￥${price}` : '-',
          date: intDate(sub.effectiveDate)
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
    value: (dot(map[it.key], 'r') || 0) / 100
  }))
  return result
}

const makeFansList = (values: Array<{ id: number, name: string, rate: number }>) => {
  const result = (values || []).map(it => ({
    id: it.id,
    name: it.name,
    value: (it.rate || 0) / 100
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
  const { ageList, publishCategoryList } = data

  const result = {
    ...data,
    item: {
      ...data.item,
      intro: dot(data, 'item.customIntroduction') || '',
      authName: dot(data, 'item.authName') || '',
      fansCount: parseInt(dot(data, 'item.customFans.totalCount'), 10) || 0,
      malePercent: parseInt(dot(data, 'item.customFans.malePercent'), 10) || 0,
      femalePercent: parseInt(dot(data, 'item.customFans.femalePercent'), 10) || 0,
      ageList: makeAgeList(ageList, dot(data, 'item.customFans.ages')),
      provinceList: makeFansList(dot(data, 'item.customFans.provinces')),
      cityList: makeFansList(dot(data, 'item.customFans.cities')),
      priceList: makePriceList(publishCategoryList, dot(data, 'item.settlementPrices')),
      // 审核是否通过，默认通过：1 待审核，2 审核通过，3 审核拒绝
      auditPass: (parseInt(dot(data, 'item.status'), 10) || 2) == 2
    },
    typeList: [
      { key: 1, text: '个人' },
      { key: 2, text: '公司' },
    ],
  }

  // result.item.photo = 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bklm23duomr0008001f0.jpg'
  // result.item.provinceId = 4
  // result.item.cityId = 68
  // result.item.provinceList = [
  //   { id: 23, name: '北京', value: 65 },
  //   { id: 28, name: '天津', value: 22 },
  // ]
  // result.item.cityList = [
  //   { id: 123, name: '商丘市', value: 88 },
  //   { id: 51, name: '宜昌市', value: 66 },
  // ]

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
