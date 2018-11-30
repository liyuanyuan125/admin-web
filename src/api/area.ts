import { get } from '@/fn/ajax'

// 刷新浏览器后重置
const cache: any = {}

/**
 * 获取子区域列表，带缓存
 * @param pid 父区域ID
 */
export async function getSubList(pid: number = 0) {
    const cacheList = cache[pid]
    if (cacheList != null) {
        return cacheList
    }

    const { data: { items: list } }: any = await get('/mock/area-list', { id: pid })
    cache[pid] = list

    return list
}
