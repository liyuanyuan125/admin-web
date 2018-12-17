// 公司管理请求

import { get, post, put } from '@/fn/ajax'

/**
 * 根据条件，查询列表
 * @param query 查询条件，参见接口文档
 */
export async function queryList(query: any = {}) {
    const res = await get('/customer/companys', query)
    return res
}
