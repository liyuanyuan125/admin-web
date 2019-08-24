import { get , post , put } from '@/fn/ajax'

export async function queryList(query: any) {
  const data = await get('/finance/settings/default', query)
  return data
}

// 银行开户信息
export async function bank(query: any) {
  const data = await put(`/finance/settings/set-bank-account` , query)
  return data
}

// 交易配置信息
export async function transaction(query: any) {
  const data = await put(`/finance/settings/set-transaction-info` , query)
  return data
}

// 设置刊例价信息
export async function price(query: any) {
  const data = await put(`/finance/settings/set-default-cpm` , query)
  return data
}

export async function dataFrom(query: any) {
  const data = await get('/finance/settings/default', query)
  return data
}

// 设置转制费用
export async function cost(query: any) {
  const data = await put(`/finance/settings/set-convert-cost` , query)
  return data
}


