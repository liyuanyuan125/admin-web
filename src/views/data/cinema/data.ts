import { get } from '@/fn/ajax'

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
