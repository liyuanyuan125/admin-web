// import { get } from '@/fn/ajax'
import { mockGet } from './mock'

// 刷新浏览器后重置
const cache: any = {}

const mockAreaList = async (pid = 0) => {
  const map: any = {
    0: [
      { id: 1, name: '北京市' },
      { id: 2, name: '河南省' },
    ],
    1: [
      { id: 101, name: '北京市' },
    ],
    2: [
      { id: 201, name: '郑州市' },
      { id: 202, name: '商丘市' },
      { id: 203, name: '南阳市' },
    ],
    101: [
      { id: 10101, name: '朝阳区' },
      { id: 10102, name: '海淀区' },
      { id: 10103, name: '东城区' },
    ],
    201: [
      { id: 20101, name: '中原区' },
      { id: 20102, name: '二七区' },
    ],
    202: [
      { id: 20201, name: '梁园区' },
      { id: 20202, name: '睢阳区' },
      { id: 20203, name: '宁陵县' },
    ],
    203: [
      { id: 20301, name: '卧龙区' },
      { id: 20302, name: '邓州市' },
    ],
  }
  return await mockGet({ id: pid }, {
    items: map[pid] || []
  })
}

/**
 * 获取子区域列表，带缓存
 * @param pid 父区域ID
 */
export async function getSubList(pid: number = 0) {
  const cacheList = cache[pid]
  if (cacheList != null) {
    return cacheList
  }

  const { data: { items: list } } = await mockAreaList(pid)
  cache[pid] = list

  return list
}
