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
      corpId: tid,
      corpName: title20,
      type: typeInt(1, 2),
      resType: typeInt(1, 2),
      'clientLevel|1': ['A', 'B', 'C'],
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
    aptitudeStatusList: [
      { id: 1, name: '待审核' },
      { id: 2, name: '已通过' },
      { id: 3, name: '已拒绝' },
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

app.use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT, () => {
    console.log(`-> serve at ${PORT}`)
  })
