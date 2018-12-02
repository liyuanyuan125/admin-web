// import { get } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

const tids = typeInt(100000000, 999999999)

export async function queryList(query: any) {
  return await mockGet(query, {
    'items|20': [{
      id: tid,
      corpId: tid,
      corpIds: tids,
      corpName: title20,
      type: typeInt(1, 3),
      'clientLevel|1': ['A', 'B', 'C'],
      createTime: dateRange(),
      updateTime: dateRange(),
      status: typeInt(1, 2),
    }],
    totalCount: 888,
    typeList: [
      { id: 1, name: '待审核' },
      { id: 2, name: '审核已通过' },
      { id: 3, name: '审核未通过' },
    ],
    statusList: [
      { id: 1, name: '已启用' },
      { id: 2, name: '已停用' },
    ],
    company: [
      { id: 1, name: '老麦', group: '商务一部', title: '商务专员' },
      { id: 2, name: '老范', group: '商务一部', title: '商务经理' },
      { id: 3, name: '小旺', group: '商务二部', title: '商务经理' },
      { id: 4, name: '小赵', group: '商务二部', title: '商务专员' },
    ],
  })
}

export async function queryItem(query: any) {
  return await mockGet(query, {
    'items|5': [{
      id: tid,
      corpId: tid,
      corpIds: tids,
      corpName: title20,
      'clientLevel|1': ['A', 'B', 'C'],
      createTime: dateRange(),
      updateTime: dateRange(),
    }],
    totalCount: 888,
  })
}
