

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
export async function dels(videoId: any , attachmentId: any) {
  const res = await del(`/xadvert/videos/${videoId}/attachments/${attachmentId}`)
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

// 获取存储ids
export async function getVideoIds(query: any) {
  const data = await get('/xadvert/videos/ids' , query)
  return data
}


// 批注
export async function annotation(id: any , query: any) {
  const res = await put(`/xadvert/videos/${id}/add-annotation`, query)
  return res
}

// 获取MD5包名
// http://yapi.aiads-dev.com/project/140/interface/api/8593
export async function getmd5(query: any) {
  const res = await post(`/xadvert/videos/md5`, query)
  return res
}






