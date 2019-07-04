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
