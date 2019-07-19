/// ==================
/// 新版构造：列表
/// ==================
import Vue, { Component } from 'vue'
import { MapType } from '@/util/types'
import { ColumnExtra } from './types'
import { isPlainObject, cloneDeep } from 'lodash'
import { devAssert } from '@/util/dev'
import { slice } from '@/fn/object'

/**
 * GetProps、GetText 等函数的传入参数，可扩展其他值
 */
export interface GetParam {
  item: any
  index: number
  options?: any
  column?: ColumnExtra
}

/**
 * 获取 Props 的函数
 */
export type GetProps<T = any> = (param: GetParam) => MapType<T>

/**
 * Props 配置的类型
 */
export type PropsType<T = any> = MapType<T> | GetProps<T>

/**
 * 获取文本的函数
 */
export type GetText = (param: GetParam) => string

/**
 * 本文配置的类型
 */
export type TextType = string | GetText

/**
 * 描述列表组件配置
 */
export interface ListComponent {
  component: string | Component
  props?: PropsType
  text?: TextType
}

const defaultGetText = ({ item, column }: GetParam) => {
  const key = column && column.key
  const text = key && item[key] || ''
  return text
}

/**
 * Link 组件的选项配置
 */
export interface LinkOptions {
  /** 跳转到的 route name */
  name: string

  /** 固定的 params 对象，将会跟从 paramsKeys 形成的对象进行合并，作为最终的 params */
  params?: MapType<any>

  /** 从 item 中截取 keys 作为 params 的一部分，以 , 分割，默认为 'id' */
  paramsKeys?: string
}

/**
 * 列表组件配置
 */
const componentMap: MapType<ListComponent> = {
  link: {
    component: 'router-link',
    props: ({ item, options }) => {
      const { name, paramsKeys, params } = options as LinkOptions
      const keyParams = slice(item, paramsKeys || 'id')
      const result = {
        to: {
          name,
          params: {
            ...params,
            ...keyParams
          }
        }
      }
      return result
    }
  }
}

// 支持 true 作为属性的占位符
const resolveProps = (
  propsType: PropsType,
  param: GetParam,
): MapType<any> => {
  const props = typeof propsType == 'function' ? propsType(param) : propsType
  return isPlainObject(props) ? cloneDeep(props) : {}
}

const resolveText = (
  textType: TextType | null,
  param: GetParam,
) => {
  const text = typeof textType == 'function'
    ? textType(param)
    : (textType == null ? defaultGetText(param) : textType)
  return text || ''
}

const getComponentName = (column: ColumnExtra) => {
  const name = Object.keys(componentMap).find(key => key in column)
  return name
}

// 新的方式：解析组件
const resolveComponent = (column: ColumnExtra, param: GetParam) => {
  const name = getComponentName(column)
  if (name) {
    const options = column[name]
    param.options = options

    const {
      component,
      props: propsType = {},
      text: textType = null,
    } = componentMap[name]

    const props = resolveProps(propsType, param)
    const text = resolveText(textType, param)

    const result = {
      component,
      props,
      text
    }

    return result
  }
}

/**
 * 将列配置，解析成 render 函数
 * @param column 列配置
 */
export function resolveRender(column: ColumnExtra) {
  const name = getComponentName(column)
  return name
    ? (h: any, { row: item, index }: any) => {
      const param: GetParam = { item, index, column }
      const { component = null, props = null, text = '' } = resolveComponent(column, param) || {}
      devAssert(component != null)
      return h(component, { props }, text)
    }
    : null
}
