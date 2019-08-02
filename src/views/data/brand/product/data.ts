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
 * 查询详情
 * http://yapi.aiads-dev.com/project/154/interface/api/3718
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id } = query
  const { data } = await get(`/brand/products/${id}`)
  const { ageList, publishCategoryList, logList = [] } = data

  // 审核状态：1 待审核，2 审核通过，3 审核拒绝
  const status = parseInt(dot(data, 'item.status'), 10) || 0

  const result = {
    ...data,
    item: {
      ...data.item,
      imgsList: (data.item.imgs as any[] || []).map((it: any, index: number) => {
        return {
          fileId: it,
          url: data.item.imgsUrl[index]
        }
      })
    }
  }
  // console.dir(result)
  return result
  return await mockGet(query, {
    item: {
      id: 162,
      name: title20,
      enName: null,
      brandId: 10121,
      marketDate: 0,
      description: '不止是传奇，更是时代的先行者，梅赛德斯-奔驰S级轿车经典而夺目的车身流线、精湛的造车工艺，独到工艺彰显卓然品味，以非凡气度成就宏大格局。',
      imgs: [
          'bk3gq1djqctg008ubho0'
      ],
      imgsUrl: [
        '//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bk3gq1djqctg008ubho0.png',
        '//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bilb8pk8078g00800kf0.png',
      ],
      keyWords: [
        '奔驰E级(进口）'
      ],
      femalePercent: 2600,
      malePercent: 7400,
      movies: [
          {
              name: '蜘蛛侠：英雄远征',
              id: 55229
          }
      ],
      citys: [
          {
              name: '北京市',
              id: 290,
              count: 719,
              rate: 719
          },
          {
              name: '上海市',
              id: 430,
              count: 439,
              rate: 439
          },
          {
              name: '深圳市',
              id: 354,
              count: 279,
              rate: 279
          },
          {
              name: '广州市',
              id: 353,
              count: 243,
              rate: 243
          },
          {
              name: '杭州市',
              id: 138,
              count: 239,
              rate: 239
          },
          {
              name: '成都市',
              id: 354,
              count: 227,
              rate: 227
          },
          {
              name: '苏州市',
              id: 279,
              count: 198,
              rate: 198
          },
          {
              name: '郑州市',
              id: 108,
              count: 181,
              rate: 181
          },
          {
              name: '重庆市',
              id: 372,
              count: 170,
              rate: 170
          },
          {
              name: '青岛市',
              id: 416,
              count: 163,
              rate: 163
          }
      ],
      provinces: [
          {
              name: '北京市',
              id: 23,
              count: 719,
              rate: 719
          },
          {
              name: '广东省',
              id: 29,
              count: 709,
              rate: 709
          },
          {
              name: '江苏省',
              id: 21,
              count: 485,
              rate: 485
          },
          {
              name: '上海市',
              id: 36,
              count: 439,
              rate: 439
          },
          {
              name: '浙江省',
              id: 11,
              count: 416,
              rate: 416
          },
          {
              name: '山东省',
              id: 34,
              count: 319,
              rate: 319
          },
          {
              name: '四川省',
              id: 24,
              count: 279,
              rate: 279
          },
          {
              name: '河南省',
              id: 8,
              count: 243,
              rate: 243
          },
          {
              name: '河北省',
              id: 31,
              count: 198,
              rate: 198
          },
          {
              name: '福建省',
              id: 5,
              count: 194,
              rate: 194
          }
      ],
      kols: [
          {
              channelCode: 'weibo',
              channelDataId: '3244028160',
              channelName: '汽车科技顾问'
          },
          {
              channelCode: 'weibo',
              channelDataId: 'wangziqiang622',
              channelName: '王子强'
          }
      ],
      ages: [
          {
              k: '0-19',
              v: 200,
              r: 0
          },
          {
              k: '20-29',
              v: 1200,
              r: 0
          },
          {
              k: '30-39',
              v: 5100,
              r: 0
          },
          {
              k: '40-49',
              v: 2800,
              r: 0
          },
          {
              k: '50+',
              v: 700,
              r: 0
          }
      ],
      modifyTime: null
    },
    channelCodeList: [
        {
            controlStatus: 1,
            text: '新浪微博',
            key: 'weibo'
        },
        {
            controlStatus: 1,
            text: '微信',
            key: 'wechat'
        },
        {
            controlStatus: 1,
            text: '抖音',
            key: 'douyin'
        },
        {
            controlStatus: 1,
            text: '快手',
            key: 'kuaishou'
        }
    ],
    ageCodeList: [
        {
            controlStatus: 1,
            text: '19岁及以下',
            key: '0-19'
        },
        {
            controlStatus: 1,
            text: '20-29',
            key: '20-29'
        },
        {
            controlStatus: 1,
            text: '30-39',
            key: '30-39'
        },
        {
            controlStatus: 1,
            text: '40-49',
            key: '40-49'
        },
        {
            controlStatus: 1,
            text: '50+',
            key: '50+'
        }
    ]
  })
}

// 按照接口要求，处理数据
const dealEditItem = (item: any) => {
  let imgsArr: string[] = []
  if (item.imgsList && item.imgsList.length > 0) {
    item.imgsList.forEach((it: any) => {
      imgsArr.push(it.fileId)
    })
  } else if ( item.imgsList && item.imgsList.length === 1) {
    imgsArr.push(item.imgsList[0].fileId)
  } else {
    imgsArr = []
  }

  const data = {
    // 基本信息
    id: item.id,
    name: item.name,
    enName: item.enName,
    imgs: imgsArr,
    brandId: item.brandId

    // 粉丝画像
    // customFans: {
    //   maleRate: nullWanfen(item.malePercent),
    //   femaleRate: nullWanfen(item.femalePercent),
    //   ages: (item.ageList as any[]).map(it => ({
    //     k: it.key,
    //     r: nullWanfen(it.value)
    //   })),
    //   provinces: dealAreaList(item.provinceList),
    //   cities: dealAreaList(item.cityList),
    //   totalCount: item.fansCount || null
    // },

    // 结算信息
    // settlementPrices: (item.priceList as any[]).map(it => ({
    //   categoryCode: it.key,
    //   effectiveDate: it.date ? moment(it.date).format('YYYYMMDD') : null,
    //   settlementPrice: it.value || null
    // })),
    // provideInvoice: item.provideInvoice,

    // 审核意见
    // remark: item.remark,
  }

  return data
}

/**
 * 编辑
 * http://yapi.aiads-dev.com/project/154/interface/api/3734
 * @param item 数据
 */
 export async function editItem(item: any) {
  // console.log( item )
  const pdata = dealEditItem(item)
  // console.log(pdata)
  const { data } = await put(`/brand/products`, pdata)
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
 * 审核平台账号
 * https://yapi.aiads-dev.com/project/142/interface/api/3030
 * @param postData 数据
 */
export async function auditItem(postData: any) {
  const { data } = await put(`/kol/channel-accounts/approve`, postData)
  return data
}
