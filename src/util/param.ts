import { MapType } from './types'
import { clean } from '@/fn/object'
import { isObject } from '@/fn/type'
import { isEqual } from 'lodash'

/**
 * 参数处理
 */
export interface ParamDeal {
  /** 自定义处理参数的函数 */
  dealParam?: DealParam

  /** 自定义回填参数的函数 */
  backfillParam?: BackfillParam
}

/**
 * 参数
 */
export interface Param extends ParamDeal {
  /** 名称 */
  name: string

  /** 默认值 */
  defaultValue: any

  /** 加工查询参数时，是否保留默认值 */
  keepDefaultValue?: boolean
}

/**
 * 处理参数，既可以返回一个对象，也可以返回原值
 */
export type DealParam = (value: any, param: Param) => object | any

/**
 * 回填参数，与处理参数相反
 */
export type BackfillParam = (data: object, param: Param) => any

/**
 * 获取默认参数
 * @param params 参数列表
 */
export function defaultParams(params: Param[]) {
  const result = params.reduce((map, it) => {
    map[it.name] = it.defaultValue
    return map
  }, {} as MapType<any>)
  return result
}

const fixedParamKeys = ['name', 'defaultValue'].sort()

/**
 * 是否为固有参数，即：只含有 name、defaultValue 的参数，
 * 这种参数，一般是诸如 pageIndex、pageSize 的，只是简单参与查询，并不参与 filter
 */
const isFixedParam = (param: Param) => {
  // 明确标记 keepDefaultValue 为 true 的参数，总是「固有参数」
  if (param.keepDefaultValue === true) {
    return true
  }

  // 判断是否为只含 name、defaultValue 的参数
  const keys = Object.keys(param).sort()
  return isEqual(keys, fixedParamKeys)
}

/**
 * 根据 params 处理 data
 * @param params 参数列表
 * @param data 数据
 * @param cleanDefault 是否清理默认值
 */
export function dealParams(params: Param[], data: any, cleanDefault = false) {
  const store = data || {}

  const tdata = params.reduce((ret, param) => {
    const { name, dealParam, defaultValue } = param
    const value = name in store ? store[name] : defaultValue
    const replaced = dealParam
      ? (() => {
        // 增强 dealParam 的能力，若 dealParam 返回非 object 值，则被当作 { [name]: dealt }
        const dealt = dealParam(value, param)
        return isObject(dealt) ? dealt : { [name]: dealt }
      })()
      : { [name]: value }
    return { ...ret, ...replaced }
  }, {} as MapType<any>)

  // 清理默认值
  cleanDefault && params.forEach(param => {
    const { name, defaultValue } = param
    if (tdata[name] === defaultValue && !isFixedParam(param)) {
      delete tdata[name]
    }
  })

  const result = clean(tdata)
  return result
}

/**
 * 根据 params 回填参数
 * @param params 参数列表
 * @param data 数据
 */
export function backfillParams(params: Param[], data: any) {
  const store = data || {}
  const result = params.reduce((ret, param) => {
    const { name, backfillParam, defaultValue } = param
    const value = backfillParam
      ? backfillParam(store, param)
      : (name in store ? store[name] : defaultValue)
    return { ...ret, [name]: value }
  }, {} as MapType<any>)
  return result
}
