import { get , post , put } from '@/fn/ajax'
import { concat, map, at, without, keyBy} from 'lodash'
import { dot, intDate, readableThousands, validDate, baifen, wanfen } from '@/util/dealData'

const nullNumber = (value: any, format?: (num: number) => any) => {
    const num = parseFloat(value)
    return isNaN(num) ? null : (format ? format(num) : num)
  }
  const nullBaifen = (value: any) => nullNumber(value, baifen)
  const nullWanfen = (value: any) => nullNumber(value, wanfen)

  const makeAgeList = (enumList: any, values: Array<{ k: string, r: number }>) => {
    const byMap: any = keyBy(values, 'k')
    const result = enumList.map((it: any) => ({
      k: it.key,
    //   t: it.text,
      v: dot(byMap[it.key], 'v') || null
    }))
    return result
  }

// 影人列表
export async function queryList(query: any) {
    const res = await get('/person/search', query)
    return res
}

// 获取国籍
export async function queryCountry() {
    const res = await get('/person/countries')
    return res
}

// 批量修改影人状态（上架下架）
export async function personStatus(data: any) {
    const res = await put('/person/status', data)
    return res
}

// 查看详情
export async function Detail(id: any) {
    const res = await get(`/person/${id}`)
    return res
}
// 查看详情 - 修改
export async function personDetail(id: any) {
    const { data } = await get(`/person/${id}`)
    const {brandTrades, channelCodes, genders, movieTypes, professions, item} = data

    // 设置大图
    const imgObj = [{
        fileId: '',
        url: item.headImgBig
    }]
    // 主要职业和其他职业
    const primaryPro: any = (item.professions || []).map((it: any) => it.primary && it.code)
    const restPro: any = (item.professions || []).map((it: any) => !it.primary && it.code)

    // 从新包装电影平台相关id
    const formId: any = {};
    (item.exts || []).map((it: any) => {
        formId[it.channelCode] = it.channelDataId
    })

    // 粉丝
    const ageList = [
        {key: '0-17岁', text: '0-17岁'},
        {key: '18-24岁', text: '18-24岁'},
        {key: '25-29岁', text: '25-29岁'},
        {key: '30-39岁', text: '30-39岁'},
        {key: '40-49岁', text: '40-49岁'},
        {key: '50-59岁', text: '50-59岁'},
    ]

    const result = {
        ...data,
        item: {
            ...data.item,
            setImageList: item.headImgBig ? imgObj : [],
            primaryPro: without(primaryPro, false),
            restPro: without(restPro, false),
            formId,
            fansCount: dot(data, 'item.fans.count'), // 粉丝人数
            fansMale: dot(data, 'item.fans.male'), // 男
            fansFemale: dot(data, 'item.fans.female'), // 女
            fansAges: makeAgeList(ageList, dot(data, 'item.fans.ages')), // 年龄分布
            fansProvinces: dot(data, 'item.fans.provinces') ? item.fans.provinces : [], // 省份分布
            fansCities: dot(data, 'item.fans.cities') ? item.fans.cities : []// 城市分布
        }
    }
    return result
}

// 修改影人信息
export async function editPersonal(obj: any) {
    const {formId, items, form, brands} = obj

    // 简介修改
    const intro = form.introduction
    const format = intro.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
    const introduction = intro ? format : intro

    // 评论热词
    const formTag = form.tags.trim()
    const tags = formTag ? formTag.split(/,|，/) : []

    // 主要和其他职业
    const professions: any[] = []
    form.primaryPro ? professions.push({code: form.primaryPro, primary: true}) : null;
    (form.restPro || []).map((it: any) => {
        professions.push({code: it,  primary: false})
    })

    // 平台相关id
    const exts: any = []
    const channelDataName = items.name
    const {keys, values, entries} = Object
    for (const [key, value] of entries(formId)) {
        if (key) {
            exts.push({
                channelCode: key,
                channelDataId: value,
                channelDataName
            })
        }
    }

    // 包装粉丝画像
    const fans = {
        count: items.fansCount,
        male: form.male,
        female: form.female,
        ages: form.ages,
        provinces: items.fansProvinces,
        cities: items.fansCities
    }

    const result = {
        tip: form.tip,
        tags,
        introduction,
        goodMovieTypes: form.goodMovieTypes ? Array.of(form.goodMovieTypes) : [],
        professions,
        headImgBig: form.imageList.length > 0 ? form.imageList[0].url : null, // 上传大图
        jyIndex: form.jyIndex,
        jyIndexWeight: form.jyIndexWeight,
        brands, // 品牌
        exts,
        fans,
    }
    const res = await put(`/person/${items.id}`, result)
    return res
}

// 关联影人
export async function personMovies( date: any) {
    const { code, data, msg} = await get(`/person/${date.id}/movies`, date)
    const items = data.items || []
    const totalCount = data.totalCount || 0
    const ids: any[] = []
    items.filter((it: any) => {
        if (it.master) {
            ids.push(it.id)
        }
    })
    return {
        code,
        data: {
            items,
            totalCount,
            ids
        },
        msg
    }
}

// 查询省
export async function queryPro() {
    const obj = {
        parentIds: 0,
        pageIndex: 1,
        pageSize: 8888888
    }
    const { data: { items}} = await get('/basis/districts', obj)
    return items
}
// 查询市
export async function queryCtiy() {
    const obj = {
        pageIndex: 1,
        pageSize: 8888888
    }
    const { data: { items}} = await get('/basis/districts/cities', obj)
    return items
}

// 同步票神影人信息
export async function personTask(task: any, data: any) {
    const res = await post(`/person/sync/${task}`, data)
    return res
}

// 影人操作日志
export async function log(id: any) {
    const res = get(`/person/${id}/logs`)
    return res
}
// 品牌分类查询
// https://yapi.aiads-dev.com/project/154/interface/api/3806
export async function tradeCode(data: any) {
    const res = await get('/brand/brands', data)
    return res
}
// 根据code获取里列表
// https://yapi.aiads-dev.com/project/16/interface/api/5282
export async function dicItems(code: any) {
    const res = get(`/basis/dictionary-categories/${code}/items`)
    return res
}

// 添加代表作品
export async function masterMovies(data: any) {
    const res = await post('/person/movies', data)
    return res
}
