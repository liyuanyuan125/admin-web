import { get, post, put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from '@/api/mock'

/**
 * 分页查询广告计划审批列表(V2.1)
 * @param query 查询条件
 * http://yapi.aiads-dev.com/project/140/interface/api/5883
 */
export async function queryList(query: any = {}) {
  const { data } = await get('/xadvert/plan-audits', query)

  const result = {
    ...data
  }
  return result
  return await mockGet(query, {
    'items|6': [
        {
            id: tid,
            name: title20,
            companyName: title20,
            advertTypeCode: 'quis reprehenderit do',
            channelCode: 'reprehenderit irure eiusmod nis',
            videoName: 'exercitation minim',
            beginDate: '2019-07-29T18:50:17.436',
            endDate: '2019-07-29T18:50:17.436',
            cinemaCount: -53538682,
            discount: 33276448.893954888,
            depositAmount: -99705053.47952199,
            status: 3,
            planApplyTime: '2019-07-29T18:50:17.436',
            auditApplyTime: '2019-07-29T18:50:17.436'
        }
    ],
    advertTypeList: [
      {
          key: 'Excepteur fugiat',
          text: 'minim labore',
          controlStatus: 21064233
      },
      {
          key: 'proident sunt mollit consectetur culpa',
          text: 'exercitation dolore commodo Lorem',
          controlStatus: 22653675
      }
  ],
    channelList: [
      {
          key: 'aute consequat',
          text: 'sit',
          controlStatus: 99537217
      },
      {
          key: 'consectetur',
          text: 'nostrud ea ipsum sunt',
          controlStatus: 69418979
      }
  ],
    auditStatusList: [
        {
            key: 'fugiat aliquip eiusmod quis',
            text: 'non fugiat labore cons'
        },
        {
            key: 'Ut laboris',
            text: 'aliqua anim sit ad'
        },
        {
            key: 'cupidata',
            text: 'do in'
        },
        {
            key: 'do sed ea',
            text: 'in id tempor'
        }
    ]
  })
}

/**
 * 查看广告计划审核详情(V2.1)
 * http://yapi.aiads-dev.com/project/140/interface/api/5897
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id } = query
  const { data } = await get(`/xadvert/plan-audits/${id}`)
  return data
}

/**
 * 广告计划审批单审核(V2.1)
 * http://yapi.aiads-dev.com/project/140/interface/api/5890
 * @param query 查询条件
 */
 export async function auditItem(query: any = {}) {
  const { id, agree, depositAmount, discount } = query
  const { data } = await put(`xadvert/plan-audits/${id}/audit`, {
    discount,
    depositAmount,
    agree
  })
  return data
}
