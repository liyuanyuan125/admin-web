import { get } from '@/fn/ajax'

interface PromiseCache {
  [id: number]: Promise<any[]>
}

// 刷新浏览器后重置
const subListCache: PromiseCache = {}

/**
 * 获取子区域列表，带缓存
 * @param pid 父区域ID
 */
export async function getSubList(pid: number = 0) {
  const cachePromise = subListCache[pid]
  if (cachePromise != null) {
    return cachePromise
  }

  try {
    subListCache[pid] = get('/basis/districts', { parentIds: pid, pageSize: 888888 })
    .then(({ data }) => {
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

      return list
    })
  } catch (ex) {
    delete subListCache[pid]
    throw ex
  }

  return subListCache[pid]
}

const isAllZero = (list: number[] | null) => (list || []).every(it => it === 0)

/**
 * 判断一组 ids 是否是合法的区域组合（正确的包含关系）
 * @param ids 区域组合，null 与空数组，返回 true
 */
export async function isValidArea(ids: number[] | null) {
  if (ids == null || ids.length === 0) {
    return true
  }

  // 若数组第一项不是 0，则将 0 添加到第一项，0 表示全国
  const checkIds = ids[0] !== 0 ? [0].concat(ids) : ids

  // 在父级区域的列表中查找本级区域 ID，如果找不到，直接返回 false
  for (let i = 0, len = checkIds.length; i < len - 1; i++) {
    const pid = checkIds[i]
    const aid = checkIds[i + 1]
    if (aid === 0) {
      // 如果接下来的全是 0，则是合法的区域
      return isAllZero(checkIds.slice(i + 2))
    }
    const list = await getSubList(pid)
    const foundItem = list.find((it: any) => it.id === aid)
    if (foundItem === undefined) {
      return false
    }
  }

  // 通过所有父子关系查找验证后，才能证明是合法的区域组合
  return true
}
