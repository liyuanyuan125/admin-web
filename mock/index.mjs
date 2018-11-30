import Koa from 'koa'
import Router from 'koa-router'
import Mock from 'mockjs'

const PORT = 9990

const app = new Koa()
const router = new Router({
  prefix: '/mock'
})

const mockData = opts => ({ code: 0, data: Mock.mock(opts), msg: '' })

const typeInt = (min, max) => `@integer(${min}, ${max})`
const typeTitle = (min, max) => `@ctitle(${min}, ${max})`
const tid = typeInt(100000, 999999)
const tids = typeInt(100000000, 999999999)
const title20 = typeTitle(1, 20)

const dateRange = function(year, month, date) {
  const end = arguments.length == 3 ? new Date(year, month - 1, date) : new Date()
  const start = new Date(end)
  start.setFullYear(end.getFullYear() - 1)
  return typeInt(start.getTime(), end.getTime())
}

router.get('/corp-list', async ctx => {
  ctx.body = mockData({
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
})

router.get('/corp', async ctx => {
  const { id } = ctx.query
  const item = id > 0 ? {
    id,
    name: '长长的公司名',
    shortName: '公司简称',

    aptitudeType: 1,
    aptitudeNo: '',

    provinceId: 1,
    cityId: 131,
    districtId: 13188,
    address: '详细地址',

    contactName: '联系人',
    contactPhone: '13888888888',
    contactEmail: 'coco@qq.com',

    clientLevel: 1,
    bizUserId: 1,

    type: 1,
    resType: 1,
    adType: 1,

    cinemaList: [
      {
        id: 1,
        name: '博纳国际影城（常营店）',
        profitUnit: 1,
        profitType: 1,
        profitRate: 1,
        profitRateList: [
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
        name: '博纳国际影城（通州万达店）',
        profitUnit: 2,
        profitType: 1,
        profitRate: 1,
        profitRateList: [
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
  ctx.body = mockData({
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
    resTypeList: [
      { id: 1, name: '影院' },
      { id: 2, name: '代理商' },
    ],
    adTypeList: [
      { id: 1, name: '直客' },
    ],
    profitUnitList: [
      { id: 1, name: '影城' },
      { id: 2, name: '影厅' },
    ],
    profitTypeList: [
      { id: 1, name: '销售额定比例' },
    ],
  })
})

// 账号管理界面
router.get('/account-list', async ctx => {
  ctx.body = mockData({
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
})
// 账号管理详情界面
router.get('/account-detail-list', async ctx => {
  ctx.body = mockData({
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
})

router.get('/area-list', async ctx => {
  const { id = 0 } = ctx.query
  const map = {
    0: [
      { id: 1, name: '北京市' },
      { id: 2, name: '河南省' },
    ],
    1: [
      { id: 101, name: '北京市' },
    ],
    2: [
      { id: 201, name: '郑州市' },
      { id: 202, name: '商丘市' },
      { id: 203, name: '南阳市' },
    ],
    101: [
      { id: 10101, name: '朝阳区' },
      { id: 10102, name: '海淀区' },
      { id: 10103, name: '东城区' },
    ],
    201: [
      { id: 20101, name: '中原区' },
      { id: 20102, name: '二七区' },
    ],
    202: [
      { id: 20201, name: '梁园区' },
      { id: 20202, name: '睢阳区' },
      { id: 20203, name: '宁陵县' },
    ],
    203: [
      { id: 20301, name: '卧龙区' },
      { id: 20302, name: '邓州市' },
    ],
  }
  ctx.body = mockData({
    items: map[id] || []
  })
})

app.use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT, () => {
    console.log(`-> serve at ${PORT}`)
  })
