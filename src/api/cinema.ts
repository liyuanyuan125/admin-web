import { get, post, put } from '@/fn/ajax'

/**
 * 根据条件，查询列表
 * @param query 查询条件，参见接口文档
 * https://yapi.aiads-dev.com/project/22/interface/api/56
 */
export async function queryList(query: any = {}) {
  const res = await get('/theater/cinemas', query)
  return res
}

/**
 * 根据条件，查询单个项的详细信息
 * @param query 查询条件，参见接口文档
 * https://yapi.aiads-dev.com/project/22/interface/api/80
 * https://yapi.aiads-dev.com/project/22/interface/api/275
 */
export async function queryItem(query: any = {}) {
  const { id } = query
  const url = id ? `/theater/cinemas/${id}` : '/theater/cinemas/view'
  const res = await get(url)
  return res
}

/**
 * 新增
 * @param data 数据，参见接口文档
 * https://yapi.aiads-dev.com/project/22/interface/api/68
 */
export async function addItem(data: any = {}) {
  const res = await post('/theater/cinemas', data)
  return res
}

/**
 * 更新
 * @param data 数据，参见接口文档
 * https://yapi.aiads-dev.com/project/22/interface/api/71
 */
export async function updateItem(data: any = {}) {
  const url = `/theater/cinemas/${data.id}`
  const res = await put(url, data)
  return res
}


/**
 * 更新状态
 * @param id 要操作的ID
 * @param status 新的状态值
 * https://yapi.aiads-dev.com/project/22/interface/api/74
 */
export async function updateStatus(id: string, status: number) {
  const res = await put('/theater/cinemas/status', { id, status })
  return res
}

/**
 * 更新控制状态
 * @param id 要操作的ID
 * @param controlStatus 新的状态值
 * https://yapi.aiads-dev.com/project/22/interface/api/77
 */
export async function updateControlStatus(id: string, controlStatus: number) {
  const res = await put('/theater/cinemas/cstatus', { id, controlStatus })
  return res
}

/**
 * 更新影院定价级别
 * @param id 要操作的ID
 * @param pricingLevelCode 新的定价级别
 * https://yapi.aiads-dev.com/project/22/interface/api/1391
 */
export async function updatePricingLevelCode(id: string, pricingLevelCode: number) {
  const res = await put('/theater/cinemas/change-pricing-level', { id, pricingLevelCode })
  return res
}

/**
 * 更新影院票房级别
 * @param id 要操作的ID
 * @param boxLevelCode 新的定价级别
 * https://yapi.aiads-dev.com/project/22/interface/api/1388
 */
export async function updateBoxLevelCode(id: string, boxLevelCode: number) {
  const res = await put('/theater/cinemas/change-box-level', { id, boxLevelCode })
  return res
}

/**
 * 查询影投列表
 * https://yapi.aiads-dev.com/project/22/interface/api/1850
 */
export async function companiesList() {
  const res = await get('/theater/companies')
  return res
}
