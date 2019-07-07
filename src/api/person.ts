import { get , post , put } from '@/fn/ajax'

// 影人列表
export async function queryList(query: any) {
    const res = await get('/person/search', query)
    return res
}

// 获取国籍
export async function queryCountry() {
    const res = await get('/person/countries')
    return res
}

// 批量修改影人状态（上架下架）
export async function personStatus(data: any) {
    const res = await put('/person/status', data)
    return res
}

// 查看详情
export async function personDetail(id: any) {
    const res = await get(`/person/${id}`)
    return res
}

// 关联影人
export async function personMovies( date: any) {
    const res = await get(`/person/${date.id}/movies`, date)
    return res
}

// 查询省
export async function queryPro(data: any) {
    const res = await get('/basis/districts', data)
    return res
}
// 查询市
export async function queryCtiy(data: any) {
    const res = await get('/basis/districts/cities', data)
    return res
}
// 修改影人信息
export async function editPersonal(id: any, data: any) {
    const res = await put(`/person/${id}`, data)
    return res
}

// 同步票神影人信息
export async function personTask(task: any, data: any) {
    const res = await post(`/person/sync/${task}`, data)
}

// 影人操作日志
export async function log(id: any) {
    const res = get(`/person/${id}/logs`)
    return res
}
// 品牌分类查询
// https://yapi.aiads-dev.com/project/154/interface/api/3806
export async function tradeCode(data: any) {
    const res = await get('/brand/brands', data)
    return res
}
// 根据code获取里列表
// https://yapi.aiads-dev.com/project/16/interface/api/5282
export async function dicItems(code: any) {
    const res = get(`/basis/dictionary-categories/${code}/items`)
    return res
}
