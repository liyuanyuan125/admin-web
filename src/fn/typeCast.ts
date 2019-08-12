import { parse } from './array'
import { isNumber, isArray } from './type'
import { MapType } from '@/util/types'

const filterKeysByValueType = (obj: object, isType: (obj: any) => boolean) => {
  return Object.entries(obj)
    .filter(([ , val ]) => isType(val))
    .map(([ key ]) => key)
}

/**
 * 找出 obj 中的全部数字 key
 * @param obj 对象
 */
export function numberKeys(obj: object) {
  return filterKeysByValueType(obj, isNumber)
}

/**
 * 将对象中的一些属性转成数字
 * @param obj 对象
 * @param keys 要转成数字的属性的 keys
 */
export function numberify(obj: object, keys: string|string[]) {
  const newObj: any = { ...obj }
  parse(keys).forEach(key => newObj[key] = +newObj[key])
  return newObj
}

/**
 * 找出 obj 中的全部
 * @param obj 对象
 */
export function arrayKeys(obj: object) {
  return filterKeysByValueType(obj, isArray)
}

const castMap: MapType<(value: any) => any> = {
  number: (value: any) => +value,
  keep: (value: any) => value
}

/**
 * 将对象中的一些属性转成数组，使用 fn/array::parse
 * @param obj 对象
 * @param refObj 参考对象，注意与 numberify 的区别
 */
export function arrayify(obj: object, refObj: any) {
  const newObj: any = { ...obj }
  const keys = arrayKeys(refObj)
  keys.forEach(key => {
    const itemType = typeof refObj[key][0]
    const castFn = castMap[itemType] || castMap.keep
    const value = parse(newObj[key], []).map(castFn)
    newObj[key] = value
  })
  return newObj
}

/**
 * 字符串转换成 bool
 * @param value 字符串
 */
const falseList = ['false', '0', 'null', 'undefined']
export function stringToBoolean(value: string | null) {
  const val = String(value).trim().toLowerCase()
  return falseList.includes(val) ? false : Boolean(val)
}

/**
 * 转换成有效的数字，若不是数字，或无效的数字，则返回值本身
 * 若转换后的数字，是以指数形式表示的数字，则被认为是无效的
 * @param value 要转换的值
 */
export function toValidNumber(value: any) {
  const num = +value
  const result = isFinite(num) && String(num) == String(value)
    ? num
    : value
  return result
}

/**
 * 转换成有效的布尔值，若不是布尔值，则返回值本身
 * 与 stringToBoolean 不同，该函数只将明确的 'false'、'true'
 * 进行转换（必须全部为小写），其他并不转换
 * @param value 要转换的值
 */
export function toValidBoolean(value: any) {
  return value === 'true'
    ? true
    : (value === 'false' ? false : value)
}

/**
 * 将数组转换成正确的类型，只转换标量，对于对象，保持原样
 * @param array 数组
 */
export function castArray(array: any[]) {
  const result = (array || []).map(it => {
    if (it == null || typeof it === 'object') {
      return it
    }
    // 先猜想，它是一个数字，再猜想它是一个布尔值
    const value = toValidBoolean(toValidNumber(it))
    return value
  })
  return result
}
