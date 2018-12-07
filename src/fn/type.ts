/**
 * 生成 isType 函数
 * @param type 类型
 */
export function isType(type: any) {
  return (obj: any) => {
      return Object.prototype.toString.call(obj) === `[object ${type}]`
  }
}

export const isObject = isType('Object')
export const isString = isType('String')
export const isArray = Array.isArray || isType('Array')
export const isFunction = isType('Function')
export const isNumber = isType('Number')
export const isBoolean = isType('Boolean')
export const isRegExp = isType('RegExp')
