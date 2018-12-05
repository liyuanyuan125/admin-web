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

  const { data } = await get('/basis/districts', { parentIds: pid, pageSize: 888888 })
  const tlist: any[] = (data.items || []).map((it: any) => {
    return {
      ...it,
      name: (it.nameCn || it.nameEn)
    }
  })

  const list = tlist.sort((a, b) => {
    const tsa = parseInt(a.orderNum, 10)
    const tsb = parseInt(a.orderNum, 10)
    const sortA = isNaN(tsa) ? Number.MAX_SAFE_INTEGER : tsa
    const sortB = isNaN(tsb) ? Number.MAX_SAFE_INTEGER : tsb
    return sortA - sortB
  })

  cache[pid] = list

  return list
}
