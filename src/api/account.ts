// import { get } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

const emailnum = typeInt(10000000000, 99999999999)
const pnum = typeInt(10000000000, 99999999999)


export async function queryList(query: any) {
  // const { data } await get('',query)
  // return data

  return await mockGet(query, {
    'items|20': [{
      id: tid,
      // corpId: tid,
      emailNum: emailnum,
      companyName: title20,
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
      { id: 1, name: '北京智能广宣1' },
      { id: 2, name: '北京智能广宣2' },
      { id: 3, name: '北京智能广宣3' },
      { id: 4, name: '北京智能广宣4' },
    ],
    company2: [
      { id: 1, name: '北京智能广宣1' },
      { id: 2, name: '北京智能广宣2' },
      { id: 3, name: '北京智能广宣3' },
      { id: 4, name: '北京智能广宣4' },
    ],
  })
}

export async function queryItem(query: any) {
  return await mockGet(query, {
    'detailItems|5': [{
      id: tid,
      userId: tid,
      childPhoneNumber: pnum,
      childUserName: title20,
      'clientLevel|1': ['A', 'B', 'C'],
      createTime: dateRange(),
      updateTime: dateRange(),
    }],
    totalCount: 888,
  })
}
