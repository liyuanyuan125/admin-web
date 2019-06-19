import { get, post, put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

export async function queryList(query: any) {
  // const res = await get('/kol/channel-accounts', query)
  // return res
  const res = await mockGet(query, {
    totalCount: 10,
    'items|10': [{
      accountCategoryCode: typeInt(0, 4),
      auth: true,
      authName: title20,
      channelCode: typeInt(0, 4),
      channelDataId: title20,
      cityId: tid,
      controlStatus: tid,
      createTime: {
        chronology: {
          calendarType: 'm',
          id: 'dolor occaecat Duis'
        },
        dayOfMonth: -61532863.495152764,
        dayOfWeek: 'irure sed anim',
        dayOfYear: -66522474.20113273,
        hour: -48020587.83438779,
        minute: 9279436.570165515,
        month: 'ea qui Duis',
        monthValue: -31781840.163189262,
        nano: -45892426.139039256,
        second: -61733718.91071446,
        year: 70187708.5136995
      },
      createUser: tid,
      customFans: {
        ages: [
          {
            k: title20,
            v: tid
          },
          {
            k: title20,
            v: tid
          }
        ],
        cities: [
          {
            fansCount: tid,
            id: tid,
            name: title20,
          },
          {
            fansCount: tid,
            id: tid,
            name: title20,
          }
        ],
        femalePercent: tid,
        malePercent: tid,
        provinces: [
          {
            fansCount: tid,
            id: tid,
            name: title20,
          },
          {
            fansCount: tid,
            id: tid,
            name: title20,
          },
          {
            fansCount: tid,
            id: tid,
            name: title20,
          },
          {
            fansCount: tid,
            id: tid,
            name: title20,
          }
        ],
        totalCount: tid
      },
      customIntroduction: 'Ut mollit',
      id: -24511295,
      introduction: 'nulla dolor consequat',
      name: title20,
      priceRemark: 'in sunt anim',
      priceStatus: -1271969,
      'prices|5': [
        {
          categoryCode: tid,
          categoryName: title20,
          costPrice: tid,
          priceType: -33517531,
          salePrice: tid,
          value: tid
        }
      ],
      provideInvoice: true,
      provinceId: true,
      remark: title20,
      'settlementPrices|2': [
        {
          categoryCode: 1,
          categoryName: title20,
          effectiveDate: dateRange(),
          settlementPrice: 18888
        }
      ],
      status: typeInt(0, 3),
      type: 42900539.22461575,
      updateTime: {
        chronology: {
          calendarType: 'magna sed Duis quis ut',
          id: 'ex do reprehenderit exercitation fugiat'
        },
        dayOfMonth: 97197318.60283446,
        dayOfWeek: 'tem',
        dayOfYear: -92092993.54311398,
        hour: -17949722.458362237,
        minute: 49530410.07896224,
        month: 'sed dolor',
        monthValue: 67337039.50187922,
        nano: 80538975.35568231,
        second: -79231601.65212147,
        year: 54063643.21861598
      },
      updateUser: -1890733.713647738
    }
    ],
    'accountCategoryList|6': [{
      controlStatus: 1,
      text: title20,
      key: tid
    }],
    publishCategoryList: [
      {
        text: '直发',
        key: 1
      },
      {
        text: '转发',
        key: 2
      }
    ],
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
    statusList: [
      { text: '未知', key: 0 },
      { text: '待审核', key: 1 },
      { text: '通过', key: 2 },
      { text: '拒绝', key: 3 },
    ],
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
  res.data.items.forEach((it: any, index: number) => {
    if (it.status == 2 || it.status == 3) {
      it._disabled = true
    }
    // statusList: [
    //   { text: '未知', key: 0 },
    //   { text: '待审核', key: 1 },
    //   { text: '通过', key: 2 },
    //   { text: '拒绝', key: 3 },
  })
  return res
}

/**
 * 审核
 * @param query 参数
 */
export async function approve(query: any) {
  // const res = await post('/kol/channel-accounts/approve', query)
  // return res
  return await mockGet(query, {
    data: {
      res: 'ok'
    }
  })
}

/**
 * 创建
 * @param query 参数
 */
export async function create(query: any) {
  const res = await post('/kol/channel-accounts', query)
  return res
  // return await mockGet(query, {
  //   data: {
  //     res : 'ok'
  //   }
  // })
}

/**
 * 根据渠道编码和渠道数据ID查看详情
 * @param query 参数
 */
export async function queryId(query: any) {
  // const res = await get(`/kol/channel-accounts/${query.channelCode}/${query.id}`)
  // return res
  return await mockGet(query, {
    item: {
      imageList: [{
        fileId: 'bgvg7fi893rg008003l0',
        url: '//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgvg7fi893rg008003l0.png'
      }],
      validityPeriodDate: 20190126,
      // 上面的是造数据的
      photo: 'bgvg7fi893rg008003l0',
      photoUrl: 'http://img1.imgtn.bdimg.com/it/u=2814109303,2147705560&fm=26&gp=0.jpg',
      accountCategoryCode: typeInt(0, 3),
      auth: true,
      authName: title20,
      channelDataId: tid,
      cityId: 375,
      createTime: dateRange(),
      createUser: tid,
      customFans: {
        ages: [
          {
            k: '0',
            v: 22
          },
          {
            k: '1',
            v: 33
          },
          {
            k: '2',
            v: 44
          },
          {
            k: '3',
            v: 55
          },
        ],
        'cities|10': [
          {
            fansCount: tid,
            id: tid,
            name: title20
          }
        ],
        femalePercent: 11,
        malePercent: 89,
        'provinces:10': [
          {
            fansCount: tid,
            id: tid,
            name: title20
          }
        ],
        totalCount: tid,
      },
      customIntroduction: 'pariatur reprehenderit nulla',
      id: tid,
      introduction: title20,
      name: title20,
      priceRemark: '定价审批备注111111',
      priceStatus: 1,
      'prices:3': [
        {
          categoryCode: 0,
          categoryName: title20,
          costPrice: 1111,
          priceType: 1,
          salePrice: 1110,
          value: 1112
        }
      ],
      provideInvoice: false,
      provinceId: 31,
      remark: title20,
      'settlementPrices:4': [
        {
          categoryCode: typeInt(0, 4),
          categoryName: '结算价详情1',
          effectiveDate: dateRange(),
          settlementPrice: 30001
        }
      ],
      status: typeInt(0, 2),
      type: typeInt(1, 2),
      updateTime: dateRange(),
      updateUser: dateRange()
    },
    priceStatusList: [{
      key: 0,
      text: '定价已审批'
    },
    {
      key: 1,
      text: '定价未审批'
    }],
    statusList: [
      { text: '待审核', key: 0 },
      { text: '通过', key: 1 },
      { text: '拒绝', key: 2 }
    ],
    ageList: [
      {
        key: 0,
        text: '18岁以下'
      },
      {
        key: 1,
        text: '18-25岁'
      },
      {
        key: 2,
        text: '26-30岁'
      },
      {
        key: 3,
        text: '31-40岁'
      },
      {
        key: 4,
        text: '40岁以上'
      }
    ],
    publishCategoryList: [
      {
        text: '直发',
        key: 1
      },
      {
        text: '转发',
        key: 2
      }
    ],
    'accountCategoryList|6': [{
      controlStatus: 1,
      text: title20,
      key: tid
    }],
  })
}
