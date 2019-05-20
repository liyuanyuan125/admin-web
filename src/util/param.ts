import { MapType } from './types'
import { clean } from '@/fn/object'
import { isObject } from '@/fn/type'

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

/**
 * 根据 params 处理 data
 * @param params 参数列表
 * @param data 数据
 */
export function dealParams(params: Param[], data: any) {
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
