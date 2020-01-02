import { get , post , put } from '@/fn/ajax'

// 影片管理 查询分页
export async function filmqueryList(query: any) {
    const res = await get('/movie/', query)
    return res
}

// 上刊影院EXCEL转JSON
// http://yapi.aiads-dev.com/project/253/interface/api/8281
export async function getExceljson(query: any) {
    const res = await post(`/bi/cinema/excel2json`, query)
    return res
}

// 价格测算
// http://yapi.aiads-dev.com/project/253/interface/api/8289
export async function pricecalc(query: any) {
    const res = await post(`/bi/pricecalc`, query)
    return res
}

// 影院输出
// http://yapi.aiads-dev.com/project/253/interface/api/8297
export async function cinemas(uuid: any , query: any) {
    const res = await get(`/bi/pricecalc/cinemas/${uuid}`, query)
    return res
}

