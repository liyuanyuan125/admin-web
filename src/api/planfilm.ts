

import { get , post , put , del } from '@/fn/ajax'

// 列表
export async function queryList(query: any) {
  const data = await get('/xadvert/v1/videos', query)
  return data
}

// 查看详情
export async function queryItem(id: any) {
  const data = await get(`/xadvert/v1/videos/${id}`)
  return data
}


// 审核
export async function sapproval(id: any , query: any) {
  const res = await put(`/xadvert/v1/videos/${id}/approval`, query)
  return res
}

export async function dataFrom(query: any) {
  const res = await get('/xadvert/v1/videos', query)
  return res
}


// 获取公司详情
export async function companysList() {
  const data = await get('/customer/companies' , {pageSize: 1000000 , status: 1})
  return data
}
// 删除
export async function dels(videoId: any , attachmentId: any) {
  const res = await del(`/xadvert/v1/videos/${videoId}/attachments/${attachmentId}`)
  return res
}

// 上传 编辑
export async function addvideo(id: any , query: any) {
  const res = await post(`/xadvert/v1/videos/${id}/attachments`, query)
  return res
}


// 编辑视频附件
export async function editvideo(videoId: any , attachmentId: any, query: any) {
  const res = await put(`/xadvert/v1/videos/${videoId}/attachments/${attachmentId}` , query)
  return res
}



