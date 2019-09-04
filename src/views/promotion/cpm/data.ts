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
  // console.dir(item, 'editItem')

  let dealImgs: string[] = []
  if (item.imgsList && item.imgsList.length > 0) {
    item.imgsList.forEach((it: any) => {
      dealImgs.push(it.fileId)
    })
  } else if ( item.imgsList && item.imgsList.length === 1) {
    dealImgs.push(item.imgsList[0].fileId)
  } else {
    dealImgs = []
  }

  let dealKeyWords: string[] = []
  const keyWordsContent = item.keyWordsContent || null
  if (keyWordsContent && keyWordsContent.indexOf(';', 0) !== -1) {
    dealKeyWords = keyWordsContent.split(';')
  } else if (keyWordsContent && keyWordsContent.length === 1) {
    dealKeyWords.push(keyWordsContent)
  }

  const marketDate = item.marketDate || null

  const data = {
    // 基本信息
    id: item.id,
    name: item.name,
    enName: item.enName,
    brandId: item.brandId,
    description: item.description,
    imgs: dealImgs,
    keyWords: dealKeyWords,
    marketDate: (marketDate && marketDate instanceof Date) ? moment(marketDate).format('YYYYMMDD') : marketDate,
    // 粉丝画像
    ages: (item.ageList as any[]).map(it => ({
      k: it.key,
      r: nullWanfen(it.value)
    })),
    malePercent: nullWanfen(item.malePercent),
    femalePercent: nullWanfen(item.femalePercent),
    provinces: dealAreaList(item.provinceList),
    citys: dealAreaList(item.cityList),
    // 推荐kol
    kols: item.kols,
    // 推荐的影片
    movies: item.movies,
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

// 组装地址数据
const dealAreaList = (list: any[]) => list.map(it => ({
  id: it.id,
  name: it.name,
  rate: wanfen(it.value)
}))

// 组装年龄数据
const makeAgeList = (enumList: KeyText[], values: Array<{ k: string, r: number }>) => {
  const map = keyBy(values, 'k')
  const result = enumList.map(it => ({
    key: it.key,
    text: it.text,
    value: nullBaifen(dot(map[it.key], 'r'))
  }))
  return result
}

// 组装粉丝数据
const makeFansList = (values: Array<{ id: number, name: string, rate: number }>) => {
  const result = (values || []).map(it => ({
    id: it.id,
    name: it.name,
    value: nullBaifen(it.rate)
  }))
  return result
}

// 组装价格数据
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
 * 列表
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3710
 */
export async function queryList(query: any = {}) {
  // const data = await get(`/brand/products`, query)
  // if (data.data.items && data.data.items.length > 0) {
  //   data.data.items.forEach((it: any) => {
  //     it.modifyTime = it.modifyTime ? moment(it.modifyTime).format('YYYY-MM-DD HH:mm') : '-'
  //   })
  // }
  // return data
  const data = await get(`/promotion/cpm/list`, query)
  return data
  return await mockGet(query, {
    'items|6': [
      {
        id: tid,
        name: title20,
        customerType: typeInt(1, 2),
        'channels|2': [
          typeInt(1, 2)
        ],
        'adTypes|2': [
          typeInt(1, 2)
        ],
        type: typeInt(1, 2),
        beginTime: '2019-07-29T18:50:17.436',
        endTime: '2019-07-29T18:50:17.436',
        status: typeInt(1, 4),
        auditor: title20
      }
    ],
    totalCount: 6,
    customerTypeList: [
      {
        key: 1,
        text: '不限'
      },
      {
        key: 2,
        text: '首单'
      }
    ],
    channelList: [
      {
        key: 1,
        text: 'APP'
      },
      {
        key: 2,
        text: '网站'
      }
    ],
    adTypeList: [
      {
        key: 1,
        text: '品牌广告'
      },
      {
        key: 2,
        text: '预告片广告'
      }
    ],
    typeList: [
      {
        key: 1,
        text: '订单满减'
      },
      {
        key: 2,
        text: '刊例价折扣'
      }
    ],
    statusList: [
      {
        key: 1,
        text: '待审核'
      },
      {
        key: 2,
        text: '生效'
      },
      {
        key: 3,
        text: '未通过'
      },
      {
        key: 4,
        text: '已下线'
      }
    ]
  })
}

/**
 * 下线
 * http://yapi.aiads-dev.com/project/154/interface/api/3750
 * @param id
 */
export async function disabledItem(id: number) {
  const { data } = await put(`brand/products/${id}/disabled`)
  return data
}

/**
 * 查询
 * http://yapi.aiads-dev.com/project/154/interface/api/3718
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id } = query
  const { data } = await get(`/brand/products/${id}`)
  const { ageCodeList, publishCategoryList, logList = [] } = data

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
      }),
      keyWordsContent: (data.item.keyWords as any[] || []).join(';'),
      ageList: makeAgeList(ageCodeList, dot(data, 'item.ages')),
      malePercent: nullBaifen(dot(data, 'item.malePercent')),
      femalePercent: nullBaifen(dot(data, 'item.femalePercent')),
      provinceList: makeFansList(dot(data, 'item.provinces')),
      cityList: makeFansList(dot(data, 'item.citys')),
      kols: (data.item.kols && data.item.kols.length > 0) ? data.item.kols : [],
      movies: (data.item.movies as any[] || []).map((it: any) => {
        return {
          id: it.id,
          name: it.name
        }
      })
    }
  }
  // console.log(result, 'queryItem')
  return result
}

/**
 * 编辑
 * http://yapi.aiads-dev.com/project/154/interface/api/3734
 * @param item 数据
 */
export async function editItem(it: any) {
  const pdata = dealEditItem(it)
  const { data } = await put(`/brand/products`, pdata)
  return data
}

/**
 * 新建
 * http://yapi.aiads-dev.com/project/154/interface/api/3838
 * @param postData 编辑项
 */
 export async function newItem(postData: any) {
  const keyWordsContent = postData.keyWordsContent || null
  const imgsList = postData.imgsList || null

  const pdata = dealEditItem(postData)

  // let keyWords = []
  // if ( keyWordsContent !== '' ) {
  //   if (keyWordsContent.indexOf(';') !== -1) {
  //     keyWords = keyWordsContent.split(';')
  //   } else {
  //     keyWords.push(keyWordsContent)
  //   }
  // }

  // const formData = {
  //   ...postData,
  //   imgs: (imgsList as any[] || []).map((it: any) => {
  //     return it.fileId
  //   }),
  //   keyWords
  // }
  // delete(formData.id)
  const { data } = await post('/brand/products', pdata)
  return data
}

/**
 * 审核
 * https://yapi.aiads-dev.com/project/142/interface/api/3030
 * @param postData 数据
 */
export async function auditItem(postData: any) {
  const { data } = await put(`/kol/channel-accounts/approve`, postData)
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

/**
 * 创建前准备数据
 * http://yapi.aiads-dev.com/project/154/interface/api/3854
 * @param id
 */
 export async function beforeCreate() {
  const { data } = await get(`brand/brands/before`)
  const { ageCodeList, channelCodeList } = data
  const result = {
    item: {
      imgs: [],
      imgsUrl: [],
      imgsList: [],
      keyWords: [],
      keyWordsContent: '',
      ageList: ageCodeList || [],
      malePercent: nullBaifen(dot(data, 'item.malePercent')),
      femalePercent: nullBaifen(dot(data, 'item.femalePercent')),
      provinceList: [],
      cityList: [],
      kols: [],
      movies: []
    },
    channelCodeList: channelCodeList || []
  }

  // console.dir(result, 'queryItem')
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

/**
 * 查询kol账号
 * https://yapi.aiads-dev.com/project/142/interface/api/3198
 * @param keyword 查询关键字
 */
export async function queryKolAcounts(channelCody: string, keyword: string) {
  const query: MapType<any> = {
    channelCode: channelCody,
    channelDataName: keyword,
    pageIndex: 1,
    pageSize: 888,
  }

  const res = await get('/kol/channel-accounts', query)

  return res
}

/**
 * 查询影片
 * https://yapi.aiads-dev.com/project/156/interface/api/50
 * @param keyword 查询关键字
 */
export async function queryMoives(keyword: string) {
  const query: MapType<any> = {
    name: keyword,
    pageIndex: 1,
    pageSize: 888,
  }

  const res = await get('/movie/', query, {
    timeout: 2000
  })
  return res
}
