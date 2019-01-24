import { get, post, put } from '@/fn/ajax'

/**
 * 实时刊例价查询参数
 */
export interface LowestListQuery {
  /** 影院 ID */
  cinemaId: number
  /** 影厅 ID */
  hallId: number
  /** 开始时间，形式：20190101 */
  beginDate: string
  /** 结束时间，形式：20190131 */
  endDate: string
}

/**
 * 实时刊例价查询
 * @param query 查询条件，参见接口文档
 * https://yapi.aiads.com/project/28/interface/api/1394
 */
export async function queryLowestList(query: LowestListQuery) {
  const res = await get('/xadvert/cpms/lowest', query)
  return res
}
