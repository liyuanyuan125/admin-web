import { get , post , put , del } from '@/fn/ajax'

/**
 * 列表
 * 参数 data
 * http://yapi.aiads-dev.com/project/140/interface/api/5371
 */
export async function list(data: any) {
  const res = await get('/xadvert/resource-bills', data)
  return res
}

/**
 * 详情
 * 参数 id
 * http://yapi.aiads-dev.com/project/140/interface/api/5375
 */
export async function detail(id: number) {
  const res = await get(`/xadvert/resource-bills/${id}`)
  return res
}

/**
 * 对账单明细列表含分页
 * 参数 id / data
 * http://yapi.aiads-dev.com/project/140/interface/api/5376
 */
export async function resourceBillDetail(data: any) {
  const res = await get(`/xadvert/resource-bills/${data.id}/detail`, data)
  return res
}

/**
 * 运营确认账单
 * 参数 id / data
 * http://yapi.aiads-dev.com/project/140/interface/api/5376
 */
export async function operateConfirm(data: any) {
  const res = await put('/xadvert/resource-bills/operate-confirm', data)
  return res
}

/**
 * 确定审核
 * 参数 id / agree / remark
 * http://yapi.aiads-dev.com/project/140/interface/api/5491
 */
export async function sureAduit(data: any) {
  const res = await put('/xadvert/resource-bill/approval', data)
  return res
}





