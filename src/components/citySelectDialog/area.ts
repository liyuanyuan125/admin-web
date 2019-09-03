import { get } from '@/fn/ajax'
import { groupBy } from 'lodash'

/**
 * 区域项
 */
export interface AreaItem {
  /** ID */
  id: number

  /** 父级 ID */
  parentId: number

  /** 大区 code */
  areaCode: string

  /** 大区 name */
  areaName: string

  /** 子级区域个数 */
  childCount: number

  /** 城市分级 */
  grade: string

  /** 城市分级名称 */
  gradeName: string

  /** 业务分级 */
  bizGrade: string

  /** 业务分级名称 */
  bizGradeName: string

  /** 名称 */
  name: string

  /** 中文名称 */
  nameCn: string

  /** 英文名称 */
  nameEn: string

  /** 拼音 */
  pinyin: string

  /** 拼音简拼 */
  pinyinShort: string

  /** 排序 */
  sort: number

  /** 字符串 Id ？ */
  stringId: string
}

/**
 * 带子列表的 AreaItem
 */
export interface AreaItemSubList extends AreaItem {
  subList: AreaItem[]
}

/**
 * 获取子区域列表，并按照 orderNum 进行排序
 * @param pid 父区域ID或以 , 号分割的父区域 ids
 */
export async function getSubList(pid: number | string = 0) {
  const { data } = await get('/basis/districts', { parentIds: pid, pageSize: 888 })

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

  return list as AreaItem[]
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

/**
 * 大区类型，例如：华北地区
 */
export interface Region {
  code: string
  name: string
}

/**
 * 获取大区列表
 */
export async function getRegionList() {
  const { data } = await get('/basis/areas')
  return (data || []) as Region[]
}

/**
 * 获取所有省份，带城市（地级市，不包括区县、县级市）列表信息
 */
export async function getProvinceCity() {
  // 先查所有省份
  const provinceList = await getSubList(0)
  // 一次性查询出所有省辖市
  const provinceIds = provinceList.map(it => it.id).join(',')
  const cityList = await getSubList(provinceIds)
  const group = groupBy(cityList, 'parentId')
  const result = provinceList.map(it => ({
    ...it,
    subList: group[it.id]
  }) as AreaItemSubList)
  return result
}

export interface RegionSubList extends Region {
  subList: AreaItemSubList[]
}

/**
 * 获取大区、省份、城市树形列表（地级市，不包括区县、县级市），树以 subList 为 key
 */
export async function getGegionProvinceCity() {
  const [regionList, provinceList] = await Promise.all([
    getRegionList(),
    getProvinceCity()
  ])
  const group = groupBy(provinceList, 'areaCode')
  const result = regionList.map(it => ({
    ...it,
    subList: group[it.code]
  }) as RegionSubList)
  return result
}

export async function tip(query: any) {
  const data = await get('/xadvert/plans/cpm/tip', query)
  return data
}
