import { get , post , put } from '@/fn/ajax'

// 影片管理 查询分页
export async function queryList(query: any) {
    const res = await get('/movie/', query)
    return res
}
// 批量上架/下架（更新movie
export async function updateMovie(data: any) {
    const res = await put('/movie/batchUpdate', data)
    return res
}

// 抓取时光影片
export async function fetchMovie(id: any) {
    const res = get(`/movie/sync/${id}`)
    return res
}
// 查看详情
export async function movieDetail(id: any) {
    const res = get(`/movie/${id}`)
    return res
}
// 修改影片
export async function movieEdit(id: any, data: any) {
    const res = put(`/movie/${id}`, data)
    return res
}

