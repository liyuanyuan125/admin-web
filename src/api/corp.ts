// import { get } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

export async function queryList(query: any) {
  return await mockGet(query, {
    'items|20': [{
      id: tid,
      name: title20,
      type: typeInt(1, 2),
      resType: typeInt(1, 2),
      clientLevel: 1,
      bizUserId: typeInt(1, 4),
      createTime: dateRange(),
      updateTime: dateRange(),
      status: typeInt(1, 2),
      aptitudeStatus: typeInt(1, 3),
    }],
    totalCount: 888,
    typeList: [
      { id: 1, name: '资源方' },
      { id: 2, name: '广告主' },
    ],
    resTypeList: [
      { id: 1, name: '影院' },
      { id: 2, name: '代理商' },
    ],
    adTypeList: [
      { id: 1, name: '直客' },
    ],
    statusList: [
      { id: 1, name: '已启用' },
      { id: 2, name: '已停用' },
    ],
    bizUserList: [
      { id: 1, name: '老麦', group: '商务一部', title: '商务专员' },
      { id: 2, name: '老范', group: '商务一部', title: '商务经理' },
      { id: 3, name: '小旺', group: '商务二部', title: '商务经理' },
      { id: 4, name: '小赵', group: '商务二部', title: '商务专员' },
    ],
    clientLevelList: [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
    ],
    aptitudeStatusList: [
      { id: 1, name: '待审核' },
      { id: 2, name: '已通过' },
      { id: 3, name: '已拒绝' },
    ],
  })
}

export async function queryItem(query: any) {
  const { id } = query
  const item = id > 0 ? {
    id,
    name: '北京智能广宣科技有限公司',
    shortName: '智能广宣',

    aptitudeType: 1,
    aptitudeNo: 'GB201810013234',

    provinceId: 2,
    cityId: 202,
    districtId: 20203,
    address: '春天里888号',

    contactName: '王二小',
    contactPhone: '13888888888',
    contactEmail: 'coco@qq.com',

    clientLevel: 2,
    bizUserId: 1,

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
