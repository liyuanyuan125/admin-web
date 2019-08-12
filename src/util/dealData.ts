/**
 * 提供一组处理数据的工具方法
 */
import { MapType, KeyTextControlStatus, KeyText } from '@/util/types'
import moment from 'moment'
import { at, keyBy } from 'lodash'
import { parse } from '@/fn/array'
import numeral from 'numeral'

const isZero = (n: number | string | null) => {
  const num = parseInt(n as string, 10)
  return isNaN(num) || num == 0
}

/**
 * 将数字 0 以及字符串 '0' 作为空串，其他保留原值
 * @param val 值
 */
export function zeroAsEmpty(val: any) {
  return val !== 0 && val !== '0' ? val : ''
}

/**
 * 批量将 data 的 fields 字段，进行 zeroAsEmpty 操作
 * @param data 数据对象
 * @param fields 以 , 号分割的字段名
 */
export function batchZeroAsEmpty(data: any, fields: string) {
  const list = fields.split(',')
  list.forEach(name => data[name] = zeroAsEmpty(data[name]))
  return data
}

/**
 * 删除 list 中的每一项的 fields 字段
 * @param list 列表
 * @param fields 以 , 号分割的字段名
 */
export function delFields(list: any[], fields: string) {
  const fieldList = fields.split(',')
  list.forEach(it => {
    fieldList.forEach(field => delete it[field])
  })
}

/**
 * 将对象列表转换成标准化的 { id, name } 对象列表
 * @param list 列表
 * @param idKey id key
 * @param nameKey name key
 */
export function normalizeList(list: any[], idKey: string, nameKey: string) {
  return (list || []).reduce((result, it, index) => {
    if (VAR.env === 'dev' && index === 0) {
      idKey !== 'id' && 'id' in it && console.warn('源列表含有 id 值') // tslint:disable-line
      nameKey !== 'name' && 'name' in it && console.warn('源列表含有 name 值') // tslint:disable-line
    }
    result.push({
      ...it,
      id: it[idKey],
      name: it[nameKey]
    })
    return result
  }, [])
}

/**
 * 格式化数字（每三位加逗号）
 * @param nums 数字
 */
export function toThousands(nums: any) {
  // 分割整数、小数部分，小数部分不参与逗号分割
  const [, integer = '', decimal = ''] = String(nums || 0).match(/(\d+)\.?(\d+)?/) || []
  let num = integer
  let result = ''
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  return result + (decimal ? `.${decimal}` : '')
}

/**
 * 根据 controlStatus 的值，过滤列表（只保留 controlStatus 为 1 的项）
 * @param list 列表
 */
export function filterByControlStatus(list: any[]) {
  return (list || []).filter(it =>
    it != null
    && typeof it === 'object'
    // it 中不存在 controlStatus，或，存在但需 == 1
    && (!('controlStatus' in it) || it.controlStatus == 1)
  )
}

interface KeyTextControlStatusMap {
  [key: string]: KeyTextControlStatus[]
}

/**
 * 批量根据 controlStatus 的值，过滤列表（只保留 controlStatus 为 1 的项）
 * @param listMap list 集合，对象形式
 */
export function filterListByControlStatus(listMap: KeyTextControlStatusMap) {
  return Object.entries(listMap).reduce((map, [key, list]) => {
    map[key] = filterByControlStatus(list)
    return map
  }, {} as KeyTextControlStatusMap)
}

interface InListDefValMap {
  [key: string]: string | number
}

/**
 * 根据 listMap 中的对象值，过滤掉对象 item 中的废弃的值（使用默认值取代）
 * @param item 对象
 * @param listMap list 集合
 * @param defValMap 默认值集合
 */
export function filterItemInList(
  item: any,
  listMap: KeyTextControlStatusMap,
  defValMap: InListDefValMap
) {
  const newItem = { ...item }
  Object.entries(listMap).forEach(([key, list]) => {
    if (key in newItem) {
      const val = newItem[key]
      const found = list.find(t => val == t.key)
      const defVal = defValMap[key]
      // 若 val 在 list 中能找到，则 val 是合法的值，否则使用 defVal
      newItem[key] = found != null &&
        (found.controlStatus == null || found.controlStatus == 1) ? val : defVal
    }
  })
  return newItem
}

/**
 * 将 list 变成 { a: 1, b: 1 } 形式的 map 对象
 * @param list 能被 fn/array#parse 解析成数组的字符串，或数组
 * @param ignoreCase 忽略大小写，默认为 true，为 true，则所有 key 转换成小写
 */
export function makeMap(list: string | any[], ignoreCase = true): MapType<number> {
  const result = parse(list).reduce<MapType<number>>((map, it) => {
    const key = ignoreCase ? String(it).toLowerCase() : it
    map[key] = 1
    return map
  }, {})
  return result
}

/**
 * 将 keys 映射到 texts
 * @param list 所有 key test 列表
 * @param keys key 列表
 */
export function textList(list: KeyText[], keys: Array<(string | number)>) {
  const keyMap = keyBy(list, 'key')
  const result = (keys || []).map(it => (keyMap[it] || {}).text).filter(it => it != null)
  return result
}

/**
 * 获取枚举 key 对应的 text
 * @param list 枚举列表
 * @param key KEY
 */
export function getEnumText(list: KeyText[], key: string | number) {
  const [ text ] = textList(list, [key])
  return text
}

/**
 * 将 item 使用 map 进行补充字段，补充的字段，会在 map 的 key 的基础上
 * 加上 Text 后缀或 MappedText 后缀（如果前者已存在）
 * @param item 数据项
 * @param enumMap 枚举 Map
 */
export function fillByKeyText(item: any, enumMap: MapType<KeyText[]>) {
  const distList = Object.entries(enumMap).map(([key, enums]) => ({
    key,
    dict: keyBy(enums, 'key')
  }))

  const mapped = distList.reduce((ret, { key, dict }) => {
    const value = item[key]
    const goodKey = key + 'Text'
    const mappedKey = goodKey in item ? key + 'MappedText' : goodKey
    ret[mappedKey] = (dict[value] || {}).text
    return ret
  }, {} as MapType)

  const result = { ...item, ...mapped }
  return result
}

/**
 * 将后台万分比率转成百分比
 * @param rate 万分比率值
 * @param digits 保留位数，默认为 0
 */
export function percent(rate: number | null, digits = 0) {
  return +((rate || 0) / 100).toFixed(digits)
}

/**
 * 加工鲸娱指数
 * @param index 指数数据
 * @param digits 保留位数，默认为 2
 */
export function jyIndex(index: number | null, digits = 2) {
  return isZero(index) ? '-' : percent(index, digits)
}

/**
 * 通过 lodash at 访问对象的值
 * @param object 对象
 * @param path 路径
 */
export function dot(object: any, path: string) {
  return at(object, path)[0]
}

const WAN = 10000

const YI = 100000000

/**
 * 将数字格式化成可读格式
 * @param number 数字
 * @param placeholder 数字为 0 时的占位符，默认为 -
 */
export function readableNumber(number: number | string, placeholder = '-') {
  if (isZero(number)) {
    return placeholder
  }

  // 产品需求：亿保留 2 位，万保留 1 位
  return number >= YI
    ? (+number / YI).toFixed(2) + '亿'
    : number >= WAN
    ? (+number / WAN).toFixed(1) + '万'
    : toThousands(number)
}

/**
 * 将数字格式化成千分位，对于 0，做了特殊处理，显示占位
 * @param number 数字
 * @param placeholder 数字为 0 时的占位符，默认为 -
 * @param format 数据格式
 */
export function readableThousands(
  number: number | string,
  placeholder = '-',
  format = '0,0'
) {
  if (isZero(number)) {
    return placeholder
  }

  return numeral(number).format(format)
}

/**
 * 将数字的整数部分格式化成千分位，保留完整的小数部分
 * @param number 数字
 */
export function realThousands(number: number | string) {
  if (isZero(number)) {
    return ''
  }
  const [ , n = '', m = '' ] = String(number).match(/^(\d+)\.?(\d+)?/) || []
  const thousands = numeral(n).format('0,0')
  const result = thousands + (m ? `.${m}` : '')
  return result
}

/**
 * 将形如 20190622 形式的整数，格式化成日期
 * 同时处理形如 2019、201906、2019-06、2019/06 的情况
 * @param date 整数
 * @param format 格式
 */
export function intDate(date: number, format = 'YYYY-MM-DD') {
  const strDate = String(date).trim()
  if (/^\d{4}\d{2}\d{2}$/.test(strDate)) {
    return moment(strDate).format(format)
  }
  if (/^(\d{4})[-\/\.]?(\d{2})$/.test(strDate)) {
    return [RegExp.$1, RegExp.$2].join('-')
  }
  return date
}

/**
 * 将形如 20190622 形式的整数，或者其他一些符合要求的字符串，转换成 Moment 对象
 * @param date 数字日期或其他形式的日期字符串
 */
export function toMoment(date: number | string | null) {
  return date == null || date == 0 || date == ''
    ? moment.invalid()
    // 如果是很大的数字，则说明这是一个时间戳
    : moment(date > 28880000 ? +date : String(date))
}

/**
 * 将形如 20190622 形式的整数，或者其他一些符合要求的字符串，转换成日期
 * @param date 数字日期或其他形式的日期字符串
 */
export function validDate(date: number | string | null) {
  const m = toMoment(date)
  return m.isValid() ? m.toDate() : null
}

/**
 * 将形如 20190622 形式的整数，或者其他一些符合要求的字符串，转换成日期，然后返回格式化结果
 * @param date 数字日期或其他形式的日期字符串
 * @param options 选项
 */
export function formatValidDate(
  date: number | string | null,
  {
    format = 'YYYY-MM-DD',
    blank = '-',
  }: any = {}
) {
  const m = toMoment(date)
  const result = m.isValid() ? m.format(format) : blank
  return result
}

/**
 * formatValidDate 的快捷版本，带上时间
 * @param date 数字日期或其他形式的日期字符串
 */
export function formatValidDateTime(date: number | string | null) {
  return formatValidDate(date, {
    format: 'YYYY-MM-DD HH:mm:ss',
  })
}

/**
 * 将整数日期，格式化成日期范围字符串
 * @param dateStart 开始数字日期
 * @param dateEnd 结束数字日期
 * @param options 选项
 */
export function formatIntDateRange(
  dateStart: number | null,
  dateEnd: number | null,
  {
    separator = '~',
    format = 'YYYY-MM-DD',
    blank = '-',
  }: any = {}
) {
  const start = toMoment(dateStart)
  const end = toMoment(dateEnd)
  if (!start.isValid() && !end.isValid()) {
    return blank
  }
  const pairs = [start, end].map(m => m.isValid() ? m.format(format) : blank)
  const result = pairs.join(separator)
  return result
}

/**
 * 格式化时间戳
 * @param time 时间戳
 * @param options 选项
 */
export function formatTimestamp(
  time: number,
  {
    format = 'YYYY-MM-DD HH:mm:ss',
    blank = '-',
  }: any = {}
) {
  const d = moment(time)
  return d.isValid() ? d.format(format) : blank
}

/**
 * 获取开始日期的时间戳
 * @param date
 */
export function startDayTimestamp(date: number | string | null) {
  const m = toMoment(date)
  const result = m.isValid() ? m.startOf('day').valueOf() : null
  return result
}

/**
 * 获取结束日期的时间戳
 * @param date
 */
export function endDayTimestamp(date: number | string | null) {
  const m = toMoment(date)
  const result = m.isValid() ? m.endOf('day').valueOf() : null
  return result
}

/**
 * 将万分转成百分
 * @param num 万分值
 * @param digits 保留位数，默认为 2
 */
export function baifen(wan: number | null, digits = 2) {
  return +((wan || 0) / 100).toFixed(digits)
}

/**
 * 将百分转成万分
 * @param bai 百分值
 */
export function wanfen(bai: number | null) {
  return Math.floor((bai || 0) * 100) || 0
}

/**
 * 将地址组件，组装出地址信息
 * @param parts 地址组件，例如 ['北京市', '北京市', '朝阳区', '北京文化中心']
 * @param options 选项
 */
export function joinAddress(
  parts: string[],
  {
    separator = ' ',
    blank = '-',
  }: any = {}
) {
  const result = Array.from(new Set(parts)).join(separator).trim() || blank
  return result
}
