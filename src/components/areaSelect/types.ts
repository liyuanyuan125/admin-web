import { Param } from '@/util/param'

/**
 * AreaSelect 参数处理
 */
export const areaParam: Param = {
  name: 'area',

  defaultValue: [0, 0, 0],

  dealParam: ([provinceId, cityId, countyId]: number[]) => ({
    provinceId: provinceId || 0,
    cityId: cityId || 0,
    countyId: countyId || 0
  }),

  backfillParam: ({ provinceId, cityId, countyId }: any) => [
    provinceId || 0,
    cityId || 0,
    countyId || 0
  ]
}
