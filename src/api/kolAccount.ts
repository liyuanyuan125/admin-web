import { get, put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

export async function queryList(query: any) {
  // const res = await get('/kol/accounts', query)
  // return res
  return await mockGet(query, {
    totalCount: 10,
    'items|10': [{
        accountCategoryCode: [
          {
            name: title20,
            id: tid
          }
        ], // string	非必须
        auth: true, // 	boolean	非必须
        authName: title20, // string 非必须
        channelCode: typeInt(1, 4), // 	string	非必须
        channelDataId: title20, // 	string	非必须
        cityId: tid, // 	integer	非必须
        controlStatus: null, // 	integer	非必须
        createTime: dateRange(), // 	object	非必须
        createUser: tid, // 	number	非必须
        customFans: null, // 	object	非必须
        customIntroduction: title20, // 	string	非必须
        id: tid, // 	integer	非必须
        introduction: title20, // 	string	非必须
        name: title20, // 	string	非必须
        priceRemark: title20, // 	string	非必须
        priceStatus: null, // 	integer	非必须
        prices: null, // 	object []	非必须
        provideInvoice: null, // 	boolean	非必须
        provinceId: tid, // 	boolean	非必须
        remark: title20, // 	string	非必须
        settlementPrices: [
          {
            text: '多图文第1条',
            price: 1000
          },
          {
            text: '多图文第2条',
            price: 800
          },
          {
            text: '多图文第3条',
            price: 500
          }
        ], // 	object []	非必须
        status: null, // 	number	非必须
        type: null, // 	number	非必须
        updateTime: dateRange(), // 	object	非必须
        updateUser: tid, // 	number	非必须
        channelDataName: title20, // nxd mock补充
        fansCount: tid, // nxd mock补充
        kolId: tid, // nxd mock补充
        kolName: title20, // nxd mock补充

    }],
    accountCategoryList: [{
      text: '母婴育儿',
      key: 1
    }, {
      text: '美容美妆',
      key: 2
    }, {
      text: '时尚穿搭',
      key: 3
    } ],
    channelList: [{
      text: '微博',
      key: 'weibo'
    }, {
      text: '微信',
      key: 'wechat'
    }, {
      text: '快手',
      key: 'kuaishou'
    }, {
      text: '抖音',
      key: 'douyin'
    }, {
      text: '小红书',
      key: 'xiaohongshu'
    }],
    statusList: [{
      text: '正常',
      key: 1
    }, {
      text: '停业',
      key: 2
    }],
    controlStatusList: [{
      text: '已上架',
      key: 1
    }, {
      text: '已下架',
      key: 2
    }],
    hasSettlementPriceList: [{
      text: '有',
      key: 1
    }, {
      text: '无',
      key: 2
    }]
  })
}
// 获取平台分类 accountCategorysList
export async function accountCategorysList(query: any) {
  return await mockGet(query, {
    items: [
      {
        id: 1,
        name: '母婴育儿',
        accountCategoryStatus: 1,
        controlStatus: 1,
        createTime: dateRange(),
        createUser: tid,
        modifyTime: dateRange(),
        modifyUser: tid
      },
      {
        id: 2,
        name: '美容美妆',
        accountCategoryStatus: 1,
        controlStatus: 1,
        createTime: dateRange(),
        createUser: tid,
        modifyTime: dateRange(),
        modifyUser: tid
      }, {
        id: 3,
        name: '时尚穿搭',
        accountCategoryStatus: 1,
        controlStatus: 1,
        createTime: dateRange(),
        createUser: tid,
        modifyTime: dateRange(),
        modifyUser: tid
      }
    ]
  })
}



/**
 * 更新状态
 * @param id 要操作的ID
 * @param status 新的状态值
 */
 export async function updateChannelCode(id: string, status: number) {
  const res = await get('/theater/cinemas/status', { id, status })
  return res
}


/**
 * 更新状态
 * @param id 要操作的ID
 * @param status 新的状态值
 */
 export async function updateStatus(id: string, status: number) {
  // const res = await put('/theater/cinemas/status', { id, status })
  // return res
  return await mockGet(id, {
    'items|20': [{
      id: tid
    }]
  })
}
