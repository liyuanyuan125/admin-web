import { get , post , put } from '@/fn/ajax'

export async function queryList(query: any) {
  const data = await get('/finance/settings/default', query)
  return data
}

// 银行开户信息
export async function bank(query: any) {
  const data = await put(`/finance/settings/set-bank-account`)
  return data
}

// 交易配置信息
export async function transaction(query: any) {
  const data = await put(`/finance/settings/set-transaction-info`)
  return data
}

export async function dataFrom(query: any) {
  const data = await get('/finance/settings/default', query)
  return data
}

