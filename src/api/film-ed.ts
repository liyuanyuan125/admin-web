import { get , post , put } from '@/fn/ajax'

// 影片管理 查询分页
export async function queryList(query: any) {
    const res = await get('/movie', query)
    return res
}

