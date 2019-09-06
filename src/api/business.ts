import { get, post, put } from '@/fn/ajax'
import { slice } from '@/fn/object'

/**
 * 商务数据
 */
export interface Business {
  /** 主键 ID */
  id: number
  /** 关联用户 id */
  userId: number
  /** 角色 */
  roles: number[]
  /** 折扣，0~1 之间的数字 */
  discount: number
}

/**
 * 根据条件，查询列表
 * @param query 查询条件，参见接口文档
 * https://yapi.aiads-dev.com/project/140/interface/api/5771
 */
export async function queryList(query: any = {}) {
  const { data } = await get('/xadvert/business-managements', query)
  const res = {
    ...data,
    items: (data.items as any[] || []).map((it, index) => ({
      ...it,
      index: index + 1
    }))
  }
  return res
}

/**
 * 查看详情
 * @param id 要操作的ID
 * https://yapi.aiads-dev.com/project/140/interface/api/5778
 */
export async function getBusiness(id: number) {
  const { data } = await get(`/xadvert/business-managements/${id}`)
  const { item } = data
  const { userId, roles, discount } = item
  return {
    id,
    userId,
    roles: roles || [],
    discount
  } as Business
}

/**
 * 创建或编辑商务关联关系
 * @param item 要保存的商务数据
 * 创建：https://yapi.aiads-dev.com/project/140/interface/api/5785
 * 编辑：https://yapi.aiads-dev.com/project/140/interface/api/5792
 */
export async function editBusiness(item: Business) {
  // 若 id 大于 0，则说明是编辑，否则是创建
  item.id > 0
    ? await put('/xadvert/business-managements', slice(item, 'id,roles,discount'))
    : await post('/xadvert/business-managements', slice(item, 'userId,roles,discount'))
}

/**
 * 更新状态
 * @param id 要操作的ID
 * @param status 新的状态值
 * https://yapi.aiads-dev.com/project/140/interface/api/5799
 */
export async function updateStatus(id: string, status: number) {
  const res = await put('/xadvert/business-managements/modify-status', { id, status })
  return res
}

/**
 * 拉取用户列表
 * @param query 查询条件，参见接口文档
 */
export async function userList(query: any = {}) {
  const { data } = await get('/auth/users', query)
  const enumList = data.items.map((ele: any) => ({ key: ele.id, text: ele.userName }))
  return enumList
}
