import { get, post, put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

/**
 * @name 退款单列表(含分页)
 * @description https://yapi.aiads-dev.com/project/76/interface/api/5995
 */
export async function queryList(query: any) {
  const res = await get('/finance/refundOrders', query)
  res.data.refundPayTypeList = res.data.refundPayTypeList ? res.data.refundPayTypeList.filter((it: any) => {
    return it.text !== '未知'
  }) : []
  res.data.refundBusTypeList = res.data.refundBusTypeList ? res.data.refundBusTypeList.filter((it: any) => {
    return it.text !== '未知'
  }) : []
  res.data.refundStatusList = res.data.refundStatusList ? res.data.refundStatusList.filter((it: any) => {
    return it.text !== '未知'
  }) : []
  return res
  return await mockGet(query, {
    totalCount: 1,
    items: [
      {
        id: tid,
        planId: tid,
        refundNumber: tid,
        refundNo: tid,
        refundAmount: tid,
        refundReason: 1,
        refundStatus: 1,
        refundBusType: 1,
        refundType: 1,
        refundPayType: 1,
        createTime: 1562321716623,
        finishTime: 1562321716623
      },
      {
        id: tid,
        planId: tid,
        refundNumber: tid,
        refundNo: tid,
        refundAmount: tid,
        refundReason: 2,
        refundStatus: 1,
        refundBusType: 1,
        refundType: 1,
        refundPayType: 1,
        createTime: 1562321716623,
        finishTime: 1562321716623
      },
      {
        id: tid,
        planId: tid,
        refundNumber: tid,
        refundNo: tid,
        refundAmount: tid,
        refundReason: 1,
        refundStatus: 1,
        refundBusType: 1,
        refundType: 1,
        refundPayType: 1,
        createTime: 1562321716623,
        finishTime: 1562321716623
      }
    ],
    refundPayTypeList: [
      {
        text: '支付方式1',
        key: 1
      },
      {
        text: '支付方式2',
        key: 2
      }
    ],
    refundTypeList: [
      {
        text: '退款方式1',
        key: 1
      },
      {
        text: '退款方式2',
        key: 2
      }
    ],
    refundBusTypeList: [
      {
        text: '业务类型1',
        key: 1
      },
      {
        text: '业务类型2',
        key: 2
      }
    ],
    refundStatusList: [
      {
        text: '退款状态1',
        key: 1
      },
      {
        text: '退款状态2',
        key: 2
      }
    ]
  })
}
