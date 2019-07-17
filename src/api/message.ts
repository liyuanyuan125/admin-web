import { get, post, put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

/**
 * 查询留言列表
 * @param query 参数
 * @description http://yapi.aiads-dev.com/project/34/interface/api/5254
 */
export async function queryList(query: any) {
  const res = await get('/customer/message-boards', query)
  return res
  return await mockGet(query, {
    totalCount: 6,
    items: [
      {
        id: 1,
        contactName: title20,
        contactTel: '13121784216',
        companyName: title20,
        provinceId: 3,
        provinceName: '湖北省',
        cityId: 61,
        cityName: '湖北省',
        status: 3,
        createTime: 1562810273272,
        updateTime: 1562810273272,
        updateName: title20,
        remark: title20,
        operationLogList: [
          {
            userName: 'admin',
            status: 2,
            createTime: 0,
            remark: 'sunt'
          },
          {
            userName: 'admin',
            status: 1,
            createTime: 0,
            remark: 'sunt'
          },
          {
            userName: 'admin',
            status: 1,
            createTime: 0,
            remark: null
          },
          {
            userName: 'admin',
            status: 1,
            createTime: 0,
            remark: ''
          },
          {
            userName: 'admin',
            status: 3,
            createTime: 0,
            remark: 'cupidatat veniam in ex'
          }
        ]
      },
      {
        id: 2,
        contactName: title20,
        contactTel: '13121784216',
        companyName: title20,
        provinceId: 3,
        provinceName: '湖北省',
        cityId: 61,
        cityName: '湖北省',
        status: 1,
        createTime: 1562810273272,
        updateTime: 1562810273272,
        updateName: title20,
        remark: title20,
        operationLogList: []
      },
      {
        id: 6,
        contactName: title20,
        contactTel: '13121784216',
        companyName: title20,
        provinceId: 3,
        provinceName: '湖北省',
        cityId: 61,
        cityName: '湖北省',
        status: 2,
        createTime: 1562810273272,
        updateTime: 1562810273272,
        updateName: title20,
        remark: '这是备注',
        operationLogList: []
      },
    ],
    statusList: [
      {
        key: 1,
        text: '待处理'
      },
      {
        key: 2,
        text: '待跟进'
      },
      {
        key: 3,
        text: '完成'
      }
    ]
  })
}


/**
 * 根据ID查询详情
 * @param id 查询条件，参见接口文档
 * @param needFilter 需要过滤一些内容
 * @description http://yapi.aiads-dev.com/project/34/interface/api/5342
 */
export async function queryItem(id: string | number, needFilter: boolean = true) {
  const res = await get(`/customer/message-boards/${id}`)
  if ( needFilter && res.data.statusList && res.data.statusList.length > 0 ) {
    res.data.statusList = res.data.statusList.filter((it: any) => {
      return it.key !== 1
    })
  }
  if ( needFilter && res.data.item.provinceName && res.data.item.cityName ) {
    res.data.item.address = res.data.item.provinceName + res.data.item.cityName
  }
  if ( needFilter && res.data.item.status === 1 || res.data.item.status === 2 ) {
    res.data.item.newRemark = ''
  }
  return res
  return await mockGet(id, {
    item: {
      id: 1,
      contactName: title20,
      contactTel: '13121784216',
      companyName: title20,
      provinceId: 3,
      provinceName: '湖北省',
      cityId: 61,
      cityName: '湖北省',
      status: 3,
      createTime: 1562810273272,
      updateTime: 1562810273272,
      updateName: title20,
      remark: title20,
      operationLogList: [
        {
          userName: 'admin',
          status: 2,
          createTime: 0,
          remark: 'sunt'
        },
        {
          userName: 'admin',
          status: 1,
          createTime: 0,
          remark: 'sunt'
        },
        {
          userName: 'admin',
          status: 1,
          createTime: 0,
          remark: null
        },
        {
          userName: 'admin',
          status: 1,
          createTime: 0,
          remark: ''
        },
        {
          userName: 'admin',
          status: 3,
          createTime: 0,
          remark: 'cupidatat veniam in ex'
        }
      ]
    },
    statusList: [
      {
        key: 1,
        text: '待处理'
      },
      {
        key: 2,
        text: '待跟进'
      },
      {
        key: 3,
        text: '完成'
      }
    ]
  })
}

/**
 * 修改留言状态
 * @param data 数据，参见接口文档
 * @description http://yapi.aiads-dev.com/project/34/interface/api/5261
 */
export async function updateItem(id: number| string, data: any = {}) {
  const url = `/customer/message-boards/${id}`
  const res = await put(url, data)
  return res
}

/**
 * 审批操作日志
 * @param data 数据，参见接口文档
 * @description http://yapi.aiads-dev.com/project/154/interface/api/5331
 */
export async function log(id: string | number) {
  const res = await get(`/brand/brand-relation/log/${id}`)
  return res
  return await mockGet(id, [
    {
      logId: 203198568780038144,
      appName: 'iadp-brand-admin-api',
      objectType: 46,
      objectId: '298',
      associations: [
        {
          objectType: 46,
          objectId: '298'
        }
      ],
      eventCode: '0',
      description: '审核',
      createUser: 4,
      createUserName: '1admin',
      createUserEmail: 'admin@aiads.com',
      createTime: '2019-07-15T17:18:34.033'
    },
    {
      logId: 203196429076824064,
      appName: 'iadp-brand-admin-api',
      objectType: 46,
      objectId: '298',
      associations: [
        {
          objectType: 46,
          objectId: '298'
        }
      ],
      eventCode: '0',
      description: '审核',
      createUser: 4,
      createUserName: '1admin',
      createUserEmail: 'admin@aiads.com',
      createTime: '2019-07-15T17:10:03.883'
    }
  ])
}
