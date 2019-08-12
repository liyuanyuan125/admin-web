/// ==================
/// 新版构造：列表
/// ==================
import { Component } from 'vue'
import { ColumnParam, ColumnExtra } from './types'
import { isPlainObject, cloneDeep } from 'lodash'
import ListEnum from './components/listEnum.vue'
import { MapType } from '@/util/types'
import { formatValidDate } from '@/util/dealData'
import { Location } from 'vue-router'
import { devAssert } from '@/util/dev'

/**
 * GetProps 等函数的传入参数，可扩展其他值
 */
export interface GetParam extends ColumnParam {
  item: any
  index: number
  column?: ColumnExtra
  options?: any
}

/**
 * 选项以及获取选项的函数
 */
export type OptionsType<T = any> = T | ((param: GetParam) => T)

/**
 * 获取 Props 的函数
 */
export type GetProps<T = any> = (param: GetParam) => MapType<T>

/**
 * Props 配置的类型
 */
export type PropsType<T = GetParam> = OptionsType<MapType<T | any>>

/**
 * 本文配置的类型
 */
export type TextType = OptionsType<string>

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
 * 列表组件配置
 */
const componentMap: MapType<ListComponent> = {
  link: {
    component: 'router-link',
    props: param => {
      const { options } = param
      const location = typeof options === 'function'
        ? options(param)
        : options
      const result = {
        to: location as Location
      }
      return result
    }
  },

  // TODO: 完善之
  enum: {
    component: ListEnum,
    props: ({ list, item, listEnumMap, column, options }) => {
      const { key, auth = '' } = column!
      const inProps = options === true
        ? { enumKey: key + 'List' }
        : typeof options == 'string'
        ? { enumKey: options }
        : options
      const { enumKey, updateField } = inProps!
      // TODO: 自动 pick enumKey 的方案
      return {
        value: item[key!],
        enumList: listEnumMap[enumKey!],
        auth,

        ...inProps,

        // TODO: 还不够完善
        updateField: updateField && (async (value: any) => {
          const id = item.id
          await updateField(id, value)
          const editItem = list.find(it => it.id == id)
          editItem[key!] = value
        })
      }
    },
  },

  date: {
    component: 'span',
    text({ item, column }) {
      const value = item[column!.key!]
      return formatValidDate(value, { format: 'YYYY-MM-DD' })
    }
  },

  time: {
    component: 'span',
    text({ item, column }) {
      const value = item[column!.key!]
      return formatValidDate(value, { format: 'HH:mm:ss' })
    }
  },

  dateTime: {
    component: 'span',
    text({ item, column }) {
      const value = item[column!.key!]
      return formatValidDate(value, { format: 'YYYY-MM-DD HH:mm:ss' })
    }
  }
}

// 支持 true 作为属性的占位符
const resolveProps = (
  propsType: PropsType,
  param: GetParam,
): MapType<any> => {
  const props = typeof propsType === 'function' ? propsType(param) : propsType
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
 * 默认被当做空的值
 */
const defaultEmptyValues = [ undefined, null, 0, '' ]

/**
 * 将列配置，解析成 render 函数
 * @param column 列配置
 */
export function resolveRender(column: ColumnExtra, columnParam: ColumnParam) {
  const name = getComponentName(column)
  return name
    ? (h: any, { row: item, index }: any) => {
      // 统一处理空值，这样下面的组件就不用处理空值了
      if (column.key) {
        const emptyValues = column.emptyValues || defaultEmptyValues
        const value = item[column.key]
        const isEmptyValue = emptyValues.includes(value)
        if (isEmptyValue) {
          // 渲染一个空的 span，以便样式可以显示出一个空的 -
          return h('span')
        }
      }

      const param: GetParam = {
        ...columnParam,
        item,
        index,
        column,
      }
      const {
        component = null,
        props = null,
        text = ''
      } = resolveComponent(column, param) || {}
      devAssert(component != null)
      return h(component, { props }, text)
    }
    : null
}
