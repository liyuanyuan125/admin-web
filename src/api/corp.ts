// import { get } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

export async function queryList(query: any) {
  return await mockGet(query, {
    'items|20': [{
      id: tid,
      name: title20,
      typeString: typeInt(1, 2),
      customerLevel: 1,
      businessDirectorName: typeInt(1, 4),
      createTimeTemp: dateRange(),
      modifyTimeTemp: dateRange(),
      statusString: typeInt(1, 2),
      approveStatusString: typeInt(1, 3),
    }],
    totalCount: 888,
    typeList: [
      { key: 1, text: '资源方' },
      { key: 2, text: '广告主' },
    ],
    statusList: [
      { key: 1, text: '已启用' },
      { key: 2, text: '已停用' },
    ],
    approveStatusList: [
      { key: 1, text: '待审核' },
      { key: 2, text: '已通过' },
      { key: 3, text: '已拒绝' },
    ],
  })
}

export async function queryItem(query: any) {
  const { id } = query
  const item = id > 0 ? {
    id,
    name: '北京智能广宣科技有限公司',
    shortName: '智能广宣',

    qualificationType: 1,
    qualificationCode: 'GB201810013234',

    proviceId: 2,
    cityId: 202,
    countyId: 124,
    districtId: 20203,
    addressDetail: '春天里888号',

    contact: '王二小',
    contactTel: '13888888888',
    email: 'coco@qq.com',
    validityPeriodDate: '12345678909876',
    levelCode: 2,
    businessDirector: 1,
    images: [],
    typeIdList: [1, 2],
    subTypeIdList: [101, 201],

    cinemaList: [
      {
        id: 1,
        name: '博纳国际影院（常营店）',
        unit: 1,
        type: 1,
        rate: 1,
        rateList: [
          { id: 1, name: '1号厅', rate: 0 },
          { id: 2, name: '2号厅', rate: 0 },
          { id: 3, name: '3号厅', rate: 0 },
          { id: 4, name: '4号厅', rate: 0 },
          { id: 5, name: '5号厅', rate: 0 },
          { id: 6, name: '6号厅', rate: 0 },
        ],
      },
      {
        id: 2,
        name: '博纳国际影院（通州万达店）',
        unit: 2,
        type: 1,
        rate: 1,
        rateList: [
          { id: 1, name: '1号厅', rate: 1 },
          { id: 2, name: '2号厅', rate: 1.5 },
          { id: 3, name: '3号厅', rate: 2 },
          { id: 4, name: '4号厅', rate: 1.5 },
          { id: 5, name: '5号厅', rate: 1 },
          { id: 6, name: '6号厅', rate: 1 },
        ],
      }
    ],
    aptitudeUrl: 'https://dummyimage.com/600x400/000/fff',
  } : {}
  return await mockGet(query, {
    item,
    aptitudeTypeList: [
      { id: 1, name: '营业执照' },
    ],
    clientLevelList: [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
    ],
    bizUserList: [
      { id: 1, name: '老麦', group: '商务一部', title: '商务专员' },
      { id: 2, name: '老范', group: '商务一部', title: '商务经理' },
      { id: 3, name: '小旺', group: '商务二部', title: '商务经理' },
      { id: 4, name: '小赵', group: '商务二部', title: '商务专员' },
    ],
    typeList: [
      { id: 1, name: '资源方' },
      { id: 2, name: '广告主' },
    ],
    typeListSubMap: {
      1: [
        { id: 101, name: '影院' },
        { id: 102, name: '代理商' },
      ],
      2: [
        { id: 201, name: '直客' },
      ],
    },
    profitUnitList: [
      { id: 1, name: '影院' },
      { id: 2, name: '影厅' },
    ],
    profitTypeList: [
      { id: 1, name: '销售额定比例' },
    ],
  })
}

export async function quertItems(query: number) {
  return await mockGet(query, {
    data: {
      id: tid,
      name: '北京智能广宣科技有限公司',
      shortName: '智能广宣',
      address: '详细地址',
      contacts: '联系人'
    }
  })
}
