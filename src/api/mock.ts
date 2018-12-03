import Mock from 'mockjs'
import { get, post, put, del } from '@/fn/ajax'

const ajaxOpts = {
  baseURL: '//yapi.aiads.com'
}

const mockData = (mockOpts: any) => {
  if (VAR.env === 'dev') {
    return { code: 0, data: Mock.mock(mockOpts), msg: '' }
  }
  throw { code: 870, msg: '非开发环境不能使用模拟数据' }
}

export async function mockGet(data: any, mockOpts: any) {
  await get('/mock/40/demo/femock', data, ajaxOpts)
  return mockData(mockOpts)
}

export async function mockPost(data: any, mockOpts: any) {
  await post('/mock/40/demo/femock', data, ajaxOpts)
  return mockData(mockOpts)
}

export async function mockPut(data: any, mockOpts: any) {
  await put('/mock/40/demo/femock', data, ajaxOpts)
  return mockData(mockOpts)
}

export async function mockDel(data: any, mockOpts: any) {
  await del('/mock/40/demo/femock', data, ajaxOpts)
  return mockData(mockOpts)
}

export const typeInt = (min: number, max: number) => `@integer(${min}, ${max})`

export const typeTitle = (min: number, max: number) => `@ctitle(${min}, ${max})`

export const tid = typeInt(100000, 999999)

export const title20 = typeTitle(1, 20)

export function dateRange(year?: number, month?: number, date?: number) {
  const end = arguments.length == 3 ? new Date(year!, month! - 1, date) : new Date()
  const start = new Date(end)
  start.setFullYear(end.getFullYear() - 1)
  return typeInt(start.getTime(), end.getTime())
}
