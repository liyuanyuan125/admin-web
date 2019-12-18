import { get } from '@/fn/ajax'
import {
  queryList as apiQueryList,
  queryItem as apiQueryItem,
  addItem as apiAddItem,
  updateItem as apiUpdateItem
} from '@/api/cinema'

export async function fetchList(query: any) {
  const { data } = await apiQueryList(query)
  data.items = (data.items as any[] || []).map(item => {
    // 纠正后端的类型与命名
    item.tmsEnableStatus = item.tmsEnable === true ? 1 : 2
    item.tmsBrand = item.tmsCode || ''
    return item
  })
  return data
}

export async function queryItem(query: any = {}) {
  const { data } = await apiQueryItem(query)
  const item = data.item || (data.item = { tmsEnable: false })
  // 纠正后端的类型与命名
  item.tmsEnableStatus = item.tmsEnable === true ? 1 : 2
  return data
}

const dealItem = (data: any) => {
  data.tmsEnable = data.tmsEnableStatus == 1
  delete data.tmsEnableStatus
  return data
}

export async function addItem(item: any = {}) {
  const data = dealItem(item)
  return apiAddItem(data)
}

export async function updateItem(item: any = {}) {
  const data = dealItem(item)
  return apiUpdateItem(data)
}

interface CompanyListQuery {
  ids?: string
  name?: string
  status?: number
  controlStatus?: number
  pageIndex?: number
  pageSize?: number
}

/**
 * 查询影投公司列表
 * https://yapi.aiads-dev.com/project/22/interface/api/1850
 */
export async function getCompanyList(query: CompanyListQuery = {}) {
  const res = await get('/theater/companies', query)
  return res
}
