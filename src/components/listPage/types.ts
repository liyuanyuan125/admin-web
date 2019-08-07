import { Component } from 'vue'
import { MapType, AjaxResult, KeyText, KeyTextControlStatus } from '@/util/types'
import Deprecated from '@/components/Deprecated.vue'
import PoptipSelect from '@/components/PoptipSelect.vue'
import { devError, devWarn } from '@/util/dev'
import moment from 'moment'

import {
  resolveRender as listResolveRender,
  LinkOptions as ListLinkOptions
} from './list'

export * from './filter'

type RenderFunction = (h: any, ctx: any) => any

/**
 * iview Table 组件 column 类型
 * https://www.iviewui.com/components/table#column
 * NOTE: 类型中的函数类型，可能不准确
 */
export interface Column extends MapType<any> {
  type?: string
  title?: string
  key?: string
  width?: number
  minWidth?: number
  maxWidth?: number
  align?: 'left' | 'right' | 'center'
  className?: string
  fixed?: 'left' | 'right'
  ellipsis?: boolean
  tooltip?: boolean
  render?: RenderFunction
  renderHeader?: RenderFunction
  indexMethod?: (row: any) => number
  sortable?: boolean | 'custom'
  sortMethod?: (a: any, b: any, type: any) => number
  sortType?: 'asc' | 'desc'
  filters?: Array<{ label: string, value: any }>
  filterMethod?: (value: any) => boolean
  filterMultiple?: boolean
  filteredValue?: any[]
  filterRemote?: () => any
  children?: any[]
  slot?: string
}

/**
 * 在 TableColumn 的基础上，添加一些额外的配置
 */
export interface ColumnExtra extends Column {
  /**
   * 编辑器
   */
  editor?: Editors

  /**
   * controlStatus 字段的 key，Deprecated 组件使用
   * 大部分情况下，都不需要传，只要字段名 fn 与 controlStatusKey 符合以下规则
   * => controlStatusKey = fn.replace(/Name$|$/, 'ControlStatus')
   */
  controlStatusKey?: string

  /**
   * enumType 字段的 key，PoptipSelect 组件使用
   * 大部分情况下，都不需要传，只要字段名 fn 与 enumKey 符合以下规则
   * => enumKey = fn.replace(/Code$|$/, 'List')
   */
  enumKey?: string

  /**
   * 更新字段的函数，PoptipSelect 组件使用
   */
  updateField?: (id: any, value: any) => Promise<any>

  /**
   * 权限配置
   */
  auth?: string

  /**
   * 被当做空的值，默认为 [ undefined, null, 0, '' ]
   */
  emptyValues?: any[]

  // 组件配置字段（要与 list.ts#componentMap 中的字段相同）

  /**
   * 使用组件 route-link
   */
  link?: ListLinkOptions

  /**
   * 使用组件 ListEnum，以及该组件的选项，若传递 string，则为 enumKey
   */
  enum?: string | {
    enumKey?: string
    updateField?: (id: any, value: any) => Promise<any>
    [key: string]: any
  }

  /** 格式化成日期 */
  date?: true

  /** 格式化成时间 */
  time?: true

  /** 格式化成日期带时间 */
  dateTime?: true
}

/**
 * 固定编辑器列表
 */
export type Editors = 'deprecated' | 'poptipSelect' | 'enum'

/**
 * 传递给 normalizeColumns 与 editorMap 的参数
 */
export interface ColumnParam {
  scopedSlots: any
  list: any[]
  // 新版列表枚举
  listEnumMap: MapType<KeyTextControlStatus[]>
  handleError: (ex: any) => any

  // TODO: 老版枚举，将慢慢优化掉
  enumType: MapType<any[]>
  enumMap: MapType<any>
}

const getEnum = (column: ColumnExtra, enumMap: MapType<any>, row: any) => {
  const { key, enumKey } = column
  const mapKey = (enumKey || key!).replace(/Code$|$/, '')
  const textMap = enumMap[mapKey]
  if (textMap == null) {
    return
  }
  const dataKey = row[key!]
  if (dataKey == null) {
    devWarn(`dataKey 为 null`)
  }
  const enumItem = textMap[dataKey]
  return enumItem
}

const getTimeEditor = (format: string) => {
  return (column: ColumnExtra) => {
    return (h: any, { row }: any) => {
      const { key } = column
      const value = row[key!]
      const text = value ? moment(value).format(format) : ''
      return h('span', text || '')
    }
  }
}

/**
 * 编辑器到 RenderFunction 的 Map
 * TODO: 重构掉老式的实现
 */
const editorMap: MapType<(column: ColumnExtra, param: ColumnParam) => RenderFunction> = {
  deprecated(column: ColumnExtra, { enumMap }) {
    const { key, controlStatusKey } = column
    return (h: any, { row }: any) => {
      // 先假设是一个枚举，若 getEnum 返回 null，说明不是一个枚举，然后根据函数中的规则进行推断
      const enumItem = getEnum(column, enumMap, row) || (() => {
        const statusKey = controlStatusKey || key!.replace(/Name$|$/, 'ControlStatus')
        const controlStatus = row[statusKey]
        const text = row[key!] || ''
        return { text, controlStatus }
      })()
      return h(Deprecated, {
        props: {
          controlStatus: enumItem.controlStatus
        }
      }, enumItem.text)
    }
  },

  poptipSelect(column: ColumnExtra, { enumType, list, handleError }) {
    const { key, enumKey, auth = '', updateField } = column
    return (h: any, { row }: any) => {
      const listKey = enumKey || key!.replace(/Code$|$/, 'List')
      const model = {
        id: row.id,
        value: row[key!],
        list: enumType[listKey]
      }

      return h(PoptipSelect, {
        props: {
          value: model,
          auth
        },
        on: {
          async change({ id, value, showLoading, hideLoading }: any) {
            const item = list.find(it => it.id == id)
            try {
              showLoading()
              await updateField!(id, value)
              item[key!] = value
            } catch (ex) {
              handleError(ex)
            } finally {
              hideLoading()
            }
          }
        }
      })
    }
  },

  enum(column: ColumnExtra, { enumMap }) {
    return (h: any, { row }: any) => {
      const { text, key } = getEnum(column, enumMap, row) || { text: '', key: '' }
      return h('span', {
        class: {
          [`enum-key-${key}`]: true
        }
      }, text || '')
    }
  },

  date: getTimeEditor('YYYY-MM-DD'),

  time: getTimeEditor('HH:mm:ss'),

  dateTime: getTimeEditor('YYYY-MM-DD HH:mm:ss'),
}

/**
 * 规范化 columns
 * @param list 待规范化的 column 列表
 * @param param 参数
 */
export function normalizeColumns(list: ColumnExtra[], param: ColumnParam) {

  const result = list.map(it => {
    if (it.slot && it.render) {
      devError('slot 与 render 是互斥的')
    }

    if (it.slot) {
      const slotRender = param.scopedSlots[it.slot]
      if (slotRender != null) {
        it.render = (h: any, ctx: any) => h('div', slotRender(ctx))
        delete it.slot
      } else {
        devError(`找不到名为 ${it.slot} 的 slot`)
      }
    } else if (it.editor) {
      // TODO: 老式的方法，会逐渐优化掉
      const factory = editorMap[it.editor]
      it.render = factory(it, param)
    } else {
      // 新版方法
      const render = listResolveRender(it, param)
      render && (it.render = render)
    }

    // 默认 center
    it.align || (it.align = 'center')
    return it
  })

  return result
}

/**
 * list fetch 调用结果
 */
export interface ListFetchResult {
  code: number
  data: ListFetchData
  msg: string
}

/**
 * 新的接口数据：list fetch 接口实际数据
 * NOTE: 由于历史原因，采用的是上面的 ListFetchResult，但后来发现，直接用 items、totalCount 更加
 * 方便，故而，有以下新的数据结构，组件本身屏蔽这种差异，提供一致性、无缝衔接式的体验
 */
export interface ListFetchData {
  items: any[]
  totalCount: number
  // 其他属性
  [key: string]: any
  [index: number]: any
}

/**
 * 将新的数据结构，转换成老的数据结构
 * @param data 传入的值
 */
export function listFetchDataToResult(data: ListFetchData | ListFetchResult) {
  return 'code' in data && 'data' in data
    // 已经是 listFetchResult 格式了，直接返回
    ? data as ListFetchResult
    // 进行简单包装
    : { code: 0, data, msg: '' }
}
