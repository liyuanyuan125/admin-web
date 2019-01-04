import { get , post , put } from '@/fn/ajax'

// 分页获取充值消费统计列表（广告主）
export async function advqueryList(query: any) {
  const data = await get('/finance/advertiser/statistics', query)
  return data
}

// 充值列表前的信息（广告主）
export async function payStatus() {
  const data = await get(`/finance/recharges/view`)
  return data
}

// 充值列表（广告主）
export async function payList(query: any) {
  const data = await get('/finance/recharges', query)
  return data
}

// 分页获取充值消费统计列表（资源方）
export async function resqueryList(query: any) {
  const data = await get('/finance/resource/statistics', query)
  return data
}

// 根据资源方公司ID分页获取提现列表(资源方)
export async function resIdqueryList(query: any) {
  const data = await get('/finance/resource/withdrawals', query)
  return data
}

// 根据资源方公司ID分页获取提现详情(资源方)
export async function resIdDetail(query: any) {
  const data = await get(`/finance/resource/withdrawals/${query.id}`)
  return data
}
