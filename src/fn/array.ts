/**
 * array 工具方法
 * NOTE:
 * 1、不要将与业务逻辑有关的代码放在此处
 * 2、若 lodash 等优秀开源库中已有相应函数，直接使用之，不要重复造轮子
 */
type ToMapCallback = (v: any) => string

/**
 * 将一组数据，转换成 map 返回
 *
 * @example
 *
 * const list = [
 *     { name: 'lip', age: 24, sex: 1 },
 *     { name: 'coco', age: 16, sex: 0 },
 * ]
 *
 * const ageMap = toMap(list, 'name', 'age')    // { lip: 24, coco: 16 }
 * const sexMap = toMap(list, 'name', 'sex')    // { lip: 1, coco: 0 }
 * const desMap = toMap(list, 'name', it => `age: ${it.age}, sex: ${it.sex}`)
 * // { lip: 'age: 24, sex: 1', coco: 'age: 16, sex: 0' }
 *
 * @param list 要操作的列表数据
 * @param key map 的 key 取值，传字符串时，用 `list[key]` 做 map 的 key；
 *        传函数时，用 `key(it)` 的结果做 key，其中 it 为数组中的每一项；
 *        不传，则取 it 本身作为 key
 * @param val map 的 value 取值，传字符串时，用 `list[val]` 做 map 的 value；
 *        传函数时，用 `val(it)` 的结果做 value，其中 it 为数组中的每一项；
 *        不传，则取 it 本身作为 value
 */
export function toMap(list: any[], key?: string|ToMapCallback, val?: string|ToMapCallback) {
  const keyIsFn = typeof key === 'function'
  const valIsFn = typeof val === 'function'
  return (list || []).reduce((map, it) => {
    const k = key ? (keyIsFn ? (key as ToMapCallback)(it) : it[key as string]) : it
    const v = val ? (valIsFn ? (val as ToMapCallback)(it) : it[val as string]) : it
    k != null && (map[k] = v)
    return map
  }, {})
}

/**
 * 将字符串解析成数组，支持以下格式
 * 1. JSON 串
 * 2. 以 , 号分割的字符串
 *
 * @param str 要解析的字符串
 */
export function parse<T = string>(str: string|T[], def: any[] = []): T[] {
  if (str instanceof Array) {
    return str
  }

  const s = typeof str === 'string' ? str.trim() : str
  if (s != null && s !== '') {
    try {
      const a = JSON.parse(s)
      return a instanceof Array ? a : [ a ]
    } catch (_) {
      return typeof s === 'string' ? s.split(',') : def
    }
  }

  return def
}
