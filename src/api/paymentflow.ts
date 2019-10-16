import { get, post, put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

/**
 *
 * @description https://yapi.aiads-dev.com/project/76/interface/api/5988
 */
export async function queryList(query: any) {
  const res = await get('/finance/payFlows', query)
  res.data.busTypeList = res.data.busTypeList ? res.data.busTypeList.filter((it: any) => {
    return it.text !== '未知'
  }) : []
  res.data.payChannelList = res.data.payChannelList ? res.data.payChannelList.filter((it: any) => {
    return it.text !== '未知'
  }) : []
  res.data.payStatusList = res.data.payStatusList ? res.data.payStatusList.filter((it: any) => {
    return it.text !== '未知'
  }) : []
  res.data.payTypeList = res.data.payTypeList ? res.data.payTypeList.filter((it: any) => {
    return it.text !== '未知'
  }) : []
  res.data.lineTypeList = res.data.lineTypeList ? res.data.lineTypeList.filter((it: any) => {
    return it.text !== '未知'
  }) : []
  res.data.items = res.data.items.map((it: any) => {
    return {
      ...it,
      planId: (it.planId === 0) ? null : it.planId
    }
  })
  return res
  return await mockGet(query, {
    totalCount: 1,
    items: [
      {
        id: tid,
        planId: tid,
        orderNo: tid,
        payNumber: 2503,
        payType: 1,
        payAmount: 2503,
        payChannel: 1,
        busType: 1,
        payStatus: 1,
        createTime: 1562321716623,
        finishTime: 1562321716623
      },
      {
        id: tid,
        planId: tid,
        orderNo: tid,
        payNumber: 2503,
        payType: 1,
        payAmount: 2503,
        payChannel: 1,
        busType: 1,
        payStatus: 1,
        createTime: 1562321716623,
        finishTime: 1562321716623
      },
      {
        id: tid,
        planId: tid,
        orderNo: tid,
        payNumber: 2503,
        payType: 1,
        payAmount: 2503,
        payChannel: 1,
        busType: 1,
        payStatus: 1,
        createTime: 1562321716623,
        finishTime: 1562321716623
      }
    ],
    payTypeList: [
      {
        text: 'payTypeList1',
        key: 1
      },
      {
        text: 'payTypeList2',
        key: 2
      }
    ],
    payChannelList: [
      {
        text: 'payChannelList1',
        key: 1
      },
      {
        text: 'payChannelList2',
        key: 2
      }
    ],
    busTypeList: [
      {
        text: 'busTypeList1',
        key: 1
      },
      {
        text: 'busTypeList2',
        key: 2
      }
    ],
    payStatusList: [
      {
        text: 'payStatusList1',
        key: 1
      },
      {
        text: 'payStatusList2',
        key: 2
      }
    ]
  })
}
