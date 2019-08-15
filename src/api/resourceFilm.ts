import { get , post , put } from '@/fn/ajax'
import { item } from './refund'
import {formatValidDate} from '@/util/dealData'

// 资源位管理

// 影片资源管理-分页查询
export async function queryList(data: any) {
  const res = await get('/movie/resource/', data)
  return res
}

// 影片资源管理 - 详情
export async function queryDetail(id: any) {
  const {data} = await get(`/movie/resource/${id}`)
  // 包装 物料和电子卷数据
  const coupon = data.coupon || {}
  const material = data.material || {}
  return {
    ...data,
    couponBatches: (coupon.batches || []).map((it: any) => {
      return {
        ...it,
        uploadTime: formatValidDate(it.uploadTime)
      }
    }),
    couponDescription: coupon.description || '',
    materialUrl: material.url,
    materialDescription: material.description
  }
}

// 影片资源管理 - 详情
// http://yapi.aiads-dev.com/project/156/interface/api/4334
export async function moviedetail(id: any) {
  const res = await get(`/movie/resource/${id}`)
  return res
}


// 影片关联
export async function relevanceFilm() {
  const res = await get('/movie/resource/movies')
  return res
}
// 批量审核
export async function batchUpdate(data: any) {
  const res = await put('/movie/resource/batchUpdate/', data)
  return res
}

// 新建影片资源
// export async function createResource(data: any) {
//   const res = await post('movie/resource', data)
//   return res
// }

// 编辑影片资源
// export async function editFlim(id: any, data: any) {
//   const res = await put(`/movie/resource/${id}`, data)
//   return res
// }
