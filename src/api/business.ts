import { get, post, put } from '@/fn/ajax'

/**
 * 根据条件，查询列表
 * @param query 查询条件，参见接口文档
 */
export async function queryList(query: any = {}) {
  const { data } = await get('/xadvert/business-managements', query)
  const res = {
    ...data,
    items: (data.items as any[] || []).map((ele, index) => ({
      ...ele,
      index: index + 1
    }))
  }
  return res
}

export async function getItem(id: number) {
  // TODO: 查询真实数据
  return {
    userId: 1,
    role: 2,
    discount: 0.6
  }
}

/**
 * 更新状态
 * @param id 要操作的ID
 * @param status 新的状态值
 */
export async function updateStatus(id: string, status: number) {
  const res = await put('/xadvert/business-managements/modify-status', { id, status })
  return res
}

/**
 * 拉取用户列表
 */
export async function userList(query: any = {}) {
  const { data } = await get('/auth/users', query)
  const enumList = data.items.map((ele: any) => ({ key: ele.id, text: ele.userName }))
  return enumList
}
