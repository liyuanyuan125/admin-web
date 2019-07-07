import { get } from '@/fn/ajax'

/**
 * 根据品牌名，查询品牌
 * @param name 品牌名
 * https://yapi.aiads-dev.com/project/154/interface/api/3806
 */
export async function searchBrandByName(name: string) {
  const { data: { items } } = await get('/brand/brands', {
    name,
    pageIndex: 1,
    pageSize: 88,
  })

  const list = (items as any[] || []).map(it => ({
    id: it.id,
    name: it.name
  }))

  return list
}
