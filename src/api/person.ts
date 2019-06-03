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
export async function personMovies(id: any, data: any) {
    const res = await get(`/person/${id}/movies`, data)
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
