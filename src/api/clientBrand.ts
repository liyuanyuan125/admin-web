import { get, post, put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

export async function queryList(query: any) {
  const res = await get('/brand/brand-relation/list', query)
  return res
  return await mockGet(query, {
    totalCount: 4,
    items: [
      {
        id: 286,
        brandId: 2503,
        brandName: title20,
        brandEnName: null,
        companyId: 110,
        companyName: title20,
        email: '18810494034@163.com',
        status: -1,
        applyType: 1,
        remark: null,
        fileIds: [
          'bki5i55uomr0008000r0'
        ],
        modifyUser: 2529,
        modifyName: 'vv鱼',
        modifyTime: 1562663247088,
        createUser: 2529,
        createName: 'vv鱼',
        createTime: 1562663247088
      },
      {
        id: 287,
        brandId: 2503,
        brandName: title20,
        brandEnName: null,
        companyId: 112,
        companyName: title20,
        email: '18810494034@163.com',
        status: 5,
        applyType: 1,
        remark: null,
        fileIds: [
          'bki5i55uomr0008000r0'
        ],
        modifyUser: 2529,
        modifyName: 'vv鱼',
        modifyTime: 1562663247088,
        createUser: 2529,
        createName: 'vv鱼',
        createTime: 1562663247088
      },
      {
        id: 288,
        brandId: 2503,
        brandName: title20,
        brandEnName: null,
        companyId: 113,
        companyName: title20,
        email: '18810494034@163.com',
        status: 10,
        applyType: 1,
        remark: null,
        fileIds: [
          'bki5i55uomr0008000r0'
        ],
        modifyUser: 2529,
        modifyName: 'vv鱼',
        modifyTime: 1562663247088,
        createUser: 2529,
        createName: 'vv鱼',
        createTime: 1562663247088
      },
      {
        id: 289,
        brandId: 2503,
        brandName: title20,
        brandEnName: null,
        companyId: 114,
        companyName: title20,
        email: '18810494034@163.com',
        status: 15,
        applyType: 1,
        remark: null,
        fileIds: [
          'bki5i55uomr0008000r0'
        ],
        modifyUser: 2529,
        modifyName: 'vv鱼',
        modifyTime: 1562663247088,
        createUser: 2529,
        createName: 'vv鱼',
        createTime: 1562663247088
      }
    ],
    brandRelationStatus: [
      {
        text: '审核不通过',
        key: -1
      },
      {
        text: '待审核',
        key: 5
      },
      {
        text: '取消关联',
        key: 10
      },
      {
        text: '已关联',
        key: 15
      }
    ],
    brandRelationType: [
      {
        text: '单独申请添加品牌',
        key: 1
      },
      {
        text: '创建或编辑公司',
        key: 2
      }
    ]
  })
}

// 查询品牌中文名
export async function brandSelect(query: any) {
  const res = await get('/brand/brand-relation/fuzzy-match/brand', query)
  return res
}


/**
 * 品牌关联审批通过
 * @param query 参数
 * @description http://yapi.aiads-dev.com/project/154/interface/api/4094
 */
export async function approvePass(query: any = {}) {
  const res = await put(`/brand/brand-relation/status-pass`, query)
  return res
}

/**
 * 品牌关联审批拒绝
 * @param query 参数
 * @description http://yapi.aiads-dev.com/project/154/interface/api/4102
 */
export async function approveReject(query: any = {}) {
  const res = await put(`/brand/brand-relation/status-reject`, query)
  return res
}

/**
 * 根据品牌关系ID查询详情
 * @param query 查询条件，参见接口文档
 * @description http://yapi.aiads-dev.com/project/154/interface/api/3646
 */
export async function queryItem(id: string|number) {
  const res = await get(`/brand/brand-relation/${id}`)
  return res
  return await mockGet(id, {
    item: {
      id: 288,
      companyId: 647,
      companyName: '广告主直客6月测试公司',
      companyShortName: '直客',
      companyCustomerType: [
        {
          typeCode: 'ads',
          typeCategoryCode: 'daili'
        },
        {
          typeCode: 'resource',
          typeCategoryCode: 'cinema'
        }
      ],
      brandId: 2503,
      brandName: '奔驰五金',
      brandEnName: null,
      brandLogo: '//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/UNKNOWN/bjqee1m6tak000801un0.奔驰五金',
      status: 5,
      applyType: 1,
      fileIds: [
        '//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bki5i55uomr0008000r0.jpg'
      ],
      remark: null,
      email: '18810494034@163.com',
      modifyUser: 2529,
      modifyName: 'vv鱼',
      modifyTime: 1562663247088,
      createUser: 2529,
      createName: 'vv鱼',
      createTime: 1562663247088
    },
    brandRelationStatus: [
      {
        text: '审核不通过',
        key: -1
      },
      {
        text: '待审核',
        key: 5
      },
      {
        text: '取消关联',
        key: 10
      },
      {
        text: '已关联',
        key: 15
      }
    ],
    brandRelationType: [
      {
        text: '单独申请添加品牌',
        key: 1
      },
      {
        text: '创建或编辑公司',
        key: 2
      }
    ],
    typeCodeList: [
      {
        text: '广告主',
        key: 'ads'
      },
      {
        text: '资源方',
        key: 'resource'
      }
    ],
    typeCategoryCodeList: [
      {
        text: '代理商',
        key: 'daili'
      },
      {
        text: '直客',
        key: 'zhike'
      },
      {
        text: '影院',
        key: 'cinema'
      },
      {
        text: '代理商',
        key: 'agent'
      }
    ]
  })
}

/**
 * 品牌关联取消
 * @param data 数据，参见接口文档
 * @description http://yapi.aiads-dev.com/project/154/interface/api/4110
 */
export async function updateItem(data: any = {}) {
  const url = `/brand/brand-relation/status-cancel`
  const res = await put(url, data)
  return res
}

/**
 * 审批操作日志
 * @param data 数据，参见接口文档
 * @description http://yapi.aiads-dev.com/project/154/interface/api/5331
 */
export async function log(id: string|number) {
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
