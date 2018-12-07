import { get, post, put } from '@/fn/ajax'

/**
 * 根据条件，查询列表
 * @param query 查询条件，参见接口文档
 */
export async function queryList(query: any = {}) {
  const res = await get('/theater/cinemas', query)
  return res
}

/**
 * 根据条件，查询单个项的详细信息
 * @param query 查询条件，参见接口文档
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
 */
export async function addItem(data: any = {}) {
  const res = await post('/theater/cinemas', data)
  return res
}

/**
 * 更新
 * @param data 数据，参见接口文档
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
 */
export async function updateStatus(id: string, status: number) {
  const res = await put('/theater/cinemas/status', { id, status })
  return res
}

/**
 * 更新控制状态
 * @param id 要操作的ID
 * @param controlStatus 新的状态值
 */
export async function updateControlStatus(id: string, controlStatus: number) {
  const res = await put('/theater/cinemas/cstatus', { id, controlStatus })
  return res
}
