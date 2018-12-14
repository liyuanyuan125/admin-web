

// import { get , post , put } from '@/fn/ajax'

// export async function queryList(query: any) {
//   const data = await get('/customer/accounts', query)
//   return data
// }


// // 新建
// export async function addList(query: any) {
//   const res = await post('/customer/accounts', query)
//   return res
// }

// export async function dataFrom(query: any) {
//   const res = await get('/customer/accounts', query)
//   return res
// }

// // 编辑
// export async function setList(query: any) {
//   const res = await put(`/customer/accounts/${query.id}`, query)
//   return res
// }

// export async function dictqueryList(query: any) {
//   const data = await get('/basis/dictionaries', query)
//   return data
// }











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
      email: emailnum,
      companyName: title20,
      type: typeInt(1, 3),
      'clientLevel|1': ['A', 'B', 'C'],
      beginCreateTime: dateRange(),
      endCreateTime: dateRange(),
      status: typeInt(1, 2),
    }],
    totalCount: 888,
    typeList: [
      { id: 1, name: '待审核' },
      { id: 2, name: '审核已通过' },
      { id: 3, name: '审核未通过' },
    ],
    statusList: [
      { id: 1, name: '启用' },
      { id: 2, name: '停用' },
    ],
    company: [
      { id: 1, name: '北京智能广宣1' },
      { id: 2, name: '北京智能广宣2' },
      { id: 3, name: '北京智能广宣3' },
      { id: 4, name: '北京智能广宣4' },
    ],
    companyName: [
      { id: 1, name: '北京智能广宣1' },
      { id: 2, name: '北京智能广宣2' },
      { id: 3, name: '北京智能广宣3' },
      { id: 4, name: '北京智能广宣4' },
    ],
  })
}

export async function queryItem(query: any) {
  return await mockGet(query, {
    'childAccountList|5': [{
      id: tid,
      // userId: tid,
      mobile: pnum,
      name: title20,
      'clientLevel|1': ['A', 'B', 'C'],
      createTime: dateRange(),
      lastLoginTime: dateRange(),
    }],
    'parentAccount|5': [{
      id: tid,
      // userId: tid,
      mobile: pnum,
      name: title20,
      'clientLevel|1': ['A', 'B', 'C'],
      createTime: dateRange(),
      lastLoginTime: dateRange(),
    }],
    totalCount: 888,
  })
}
