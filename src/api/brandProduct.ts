import { get, post, put, del } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'


/**
 * 根据条件 产品列表含分页
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3710
 */
export async function productsList(query: any) {
  const data = await get(`/brand/products`, query)
  return data
  return await mockGet(query, {
    items: [
      {
        id: 162,
        name: '奔驰E级(进口）',
        enName: null,
        keyWords: [
          '奔驰E级(进口）',
          '奔驰E级(进口）',
          '奔驰E级(进口）',
          '奔驰E级(进口）',
          '奔驰E级(进口）',
          '奔驰E级(进口）'
        ],
        description: '不止是传奇，更是时代的先行者，梅赛德斯-奔驰S级轿车经典而夺目的车身流线、精湛的造车工艺，独到工艺彰显卓然品味，以非凡气度成就宏大格局。',
        modifyTime: 1560747596123,
        status: 1
      },
    ],
    totalCount: 12,
    statusList: [
      {
        text: '未知',
        key: 0
      },
      {
        text: '启用',
        key: 1
      },
      {
        text: '禁用',
        key: 2
      }
    ]
  })
}

/**
 * 根据条件，查询列表
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3806
 */
export async function brandList(query: any) {
  const data = await get('/brand/brands', query)
  return data
}

/**
 * 根据条件，品牌新建
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3806
 */
export async function addbrand(query: any) {
  const data = await post('/brand/brands', query)
  return data
}

/**
 * 根据条件，品牌修改
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3806
 */
export async function editbrand(query: any) {
  const data = await put('/brand/brands', query)
  return data
}

/**
 * 根据条件 品牌详情
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3830
 */
export async function brandDetail(id: any) {
  const data = await get(`/brand/brands/${id}`)
  return data
}

/**
 * 根据条件 品牌启用
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3814
 */
export async function brandstart(id: any) {
  const data = await put(`/brand/brands/${id}/enabled`)
  return data
}

/**
 * 根据条件 品牌禁用
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3830
 */
export async function brandstop(id: any) {
  const data = await put(`/brand/brands/${id}/disabled`)
  return data
}



/**
 * 根据条件 添加社交平台
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/4134
 */
export async function addmedias(query: any) {
  const data = await post(`/brand/medias`, query)
  return data
}

/**
 * 根据条件 编辑社交平台
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/4134
 */
export async function editmedias(query: any) {
  const data = await put(`/brand/medias`, query)
  return data
}

/**
 * 根据条件 删除社交平台
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/4134
 */
export async function delmedias(id: any) {
  const data = await put(`/brand/medias/${id}`)
  return data
}

/**
 * 根据条件 删除社交平台
 * @param query 查询条件，http://yapi.aiads-dev.com/project/152/interface/api/4230
 */
export async function brandbefore() {
  const data = await get(`/brand/brands/before`)
  return data
}

/**
 * 查询条件，查询kol列表
 * @param query 查询条件，http://yapi.aiads-dev.com/project/142/interface/api/3198
 */
export async function kolchannel(query: any) {
  const data = await get(`/kol/channel-accounts`, query)
  return data
}

/**
 * 分页查询 影片列表
 * @param query 查询条件，http://yapi.aiads-dev.com/project/156/interface/api/4326
 */
export async function filmlist(query: any) {
  const data = await get(`/movie/resource/`, query)
  return data
}

/**
 * 分页查询 门店列表
 * @param query 查询条件，http://yapi.aiads-dev.com/project/152/interface/api/3934
 */
export async function shoplist(query: any) {
  const data = await get(`/brand/stores`, query)
  return data
}

/**
 * 分页查询 门店创建
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3678
 */
export async function addshop(query: any) {
  const data = await post(`/brand/stores`, query)
  return data
}

/**
 * 分页查询 门店编辑
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3678
 */
export async function editshop(query: any) {
  const data = await put(`/brand/stores`, query)
  return data
}

/**
 * 分页查询 门店删除
 * @param query 查询条件，http://yapi.aiads-dev.com/project/154/interface/api/3678
 */
export async function delshop(id: any) {
  const data = await put(`/brand/stores/${id}`)
  return data
}
