import { get, post, put, del } from '@/fn/ajax'
import { dot, intDate, readableThousands, validDate, baifen, wanfen } from '@/util/dealData'
import { KeyText, MapType } from '@/util/types'
import { keyBy } from 'lodash'
import moment from 'moment'
import { mockGet, typeTitle, tid, title20, dateRange } from '@/api/mock'

/**
 * 查询票仓城市列表
 * @description https://yapi.aiads-dev.com/project/140/interface/api/2414
 */
export async function queryList() {
  const res = await get('/xadvert/ticket-warehouse/cities')
  return res
  return await mockGet({}, {
    items: [
      {
        cityId: 302,
        cityName: '成都',
        id: '5cde2e3d538f3e5e289ce6b1'
      },
      {
        cityId: 353,
        cityName: '广州',
        id: '5d0dc177527bb200011bf34c'
      },
      {
        cityId: 55,
        cityName: '武汉',
        id: '5d0dc1dc527bb200011bf34d'
      },
      {
        cityId: 372,
        cityName: '重庆',
        id: '5d0dc1fe527bb200011bf34e'
      },
      {
        cityId: 138,
        cityName: '杭州',
        id: '5d0dc21e527bb200011bf34f'
      },
      {
        cityId: 279,
        cityName: '苏州',
        id: '5d0dc244527bb200011bf351'
      },
      {
        cityId: 290,
        cityName: '北京',
        id: '5d39a5237c79f30001571a22'
      }
    ]
  })
}

/**
 * 删除票仓城市
 * https://yapi.aiads-dev.com/project/140/interface/api/2441
 * @param query 查询条件
 */
export async function removeItem(data: any = {}) {
  const res = await del('/xadvert/ticket-warehouse/cities', data)
  return res
}

/**
 * 新增
 * @description https://yapi.aiads-dev.com/project/140/interface/api/2432
 */
 export async function addItem(data: any = {}) {
  const res = await post('/xadvert/ticket-warehouse/cities', data)
  return res
}

/**
 * 分页查询市级城市信息
 * @description https://yapi.aiads-dev.com/project/16/interface/api/2518
 */
 export async function queryCities(query: any = {}) {
  const res = await get('/basis/districts/cities', query)
  return res
}

