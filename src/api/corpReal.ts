// 公司管理请求

import { get, post, put } from '@/fn/ajax'

/**
 * 根据条件，查询列表
 * @param query 查询条件，参见接口文档
 */
export async function queryList(query: any = {}) {
    const res = await get('/customer/companies', query)
    return res
}

/**
 * 关联商务，查询列表
 * @param query 查询条件，参见接口文档
 */
export async function directorList(query: any = {}) {
    const res = await get('/customer/companies', query)
    return res
}

/**
 * 根据Id，查询公司详情
 * @param query 查询条件，参见接口文档
 */
export async function queryId(query: any = {}) {
    const res = await get(`/customer/companies/${query.id}`)
    return res
}

/**
 * 根据Id，启用停用
 * @param query 停运Id，参见接口文档
 */
export async function statusId(query: any = {}) {
    const res = await put('/customer/company/status/', query)
    return res
}

/**
 * 新建公司 初始条件
 */
export async function addSeach() {
    const res = await get('/customer/companies/view')
    return res
}


/**
 * 新建公司
 * @param query 添加条件，参见接口文档
 */
export async function addQuery(query: any = {}) {
    const res = await post('/customer/company', query)
    return res
}

/**
 * 修改公司信息
 * @param query 添加条件，参见接口文档
 */
export async function setQuery(id: number, query: any = {}) {
    const res = await post(`/customer/company/${id}`, query)
    return res
}

// 公司查询
export async function companyList(query: any) {
    const res = await get('/basis/districts', query)
    return res
}

