import { get, post, put, del } from '@/fn/ajax'

// 获取地区所在集合
export async function arealist(query: any) {
    const res = await get('/basis/districts/areas', query)
    return res
}

// 地区分页查询
export async function queryList(query: any) {
    const res = await get('/basis/districts', query)
    return res
}

// 地区区域修改
export async function areaSet(id: any, query: any) {
    const res = await put(`/basis/districts/${id}`, query)
    return res
}

// 添加地区
export async function areaAdd(query: any) {
    const res = await post('/basis/districts', query)
    return res
}

// 删除地区
export async function dels(id: any) {
    const res = await del(`/basis/districts/${id}`)
    return res
}
