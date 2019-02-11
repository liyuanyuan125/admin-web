

import { get , post , put , del } from '@/fn/ajax'

// 列表
export async function queryList(query: any) {
  const data = await get('/xadvert/videos', query)
  return data
}

// 查看详情
export async function queryItem(id: any) {
  const data = await get(`/xadvert/videos/${id}`)
  return data
}


// 审核
export async function sapproval(id: any , query: any) {
  const res = await put(`/xadvert/videos/${id}/approval`, query)
  return res
}

export async function dataFrom(query: any) {
  const res = await get('/xadvert/videos', query)
  return res
}


// 获取公司详情
export async function companysList() {
  const data = await get('/customer/companies' , {pageSize: 1000000 , status: 1})
  return data
}
// 删除
export async function dels(videoId: any , id: any) {
  const res = await del(`/xadvert/videos/${videoId}/attachments/${id}`)
  return res
}

// 上传 编辑
export async function addvideo(id: any , query: any) {
  const res = await post(`/xadvert/videos/${id}/attachments`, query)
  return res
}


// 编辑视频附件
export async function editvideo(videoId: any , attachmentId: any, query: any) {
  const res = await put(`/xadvert/videos/${videoId}/attachments/${attachmentId}` , query)
  return res
}



