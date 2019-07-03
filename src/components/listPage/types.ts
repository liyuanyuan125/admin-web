import { Component } from 'vue'
import { MapType, AjaxResult } from '@/util/types'
import { Select } from 'iview'
import LazyInput from '@/components/LazyInput'
import { kebabCase } from 'lodash'
import Deprecated from '@/components/Deprecated.vue'
import PoptipSelect from '@/components/PoptipSelect.vue'
import { devError } from '@/util/dev'
import { ParamDeal, Param } from '@/util/param'
import moment from 'moment'
import DatePicker from './components/datePicker.vue'
import DateRangePicker from './components/dateRangePicker.vue'

/**
 * 固定类型列表
 */
export type InnateTypes = 'input' | 'select' | 'date' | 'dateRange'

const formatDate = (value: string | Date | null, format = 'YYYYMMDD') =>
  value ? moment(value).format(format) : ''

/**
 * 固定类型 Map
 */
const innateTypeMap: MapType<Component> = {
  input: LazyInput,

  select: Select,

  date: DatePicker,

  dateRange: DateRangePicker,
}

/**
 * 默认的 props
 */
const defaultPropsMap: MapType<object> = {
  select: {
    clearable: true
  }
}

/**
 * fetch 动作
 */
export type FetchAction = (query: any) => Promise<AjaxResult>

/**
 * 查询项
 */
export interface Filter extends Param {
  /** 要使用 component 类型 */
  type?: InnateTypes | Component

  /** placeholder */
  placeholder?: string

  /** width */
  width?: number

  /** minWidth */
  minWidth?: number

  /** maxWidth */
  maxWidth?: number

  /**
   * 当 enumKey 为 select 时，渲染 select 的枚举列表的 key
   * 如果没有明确设置，则 enumKey 会被设置为 name.replace(/Code$|$/, 'List')
   */
  enumKey?: string

  /**
   * 传递给组件的 props
   */
  props?: MapType<any>

  /**
   * 权限配置
   */
  auth?: string
}

/**
 * 规范化后的查询项
 */
export interface NormalFilter extends Filter {
  /** 确定要使用的 component */
  component: Component

  /** class 或 class 列表 */
  class: string | string[]

  /** 样式对象 */
  style: MapType
}

/**
 * 规范化查询项
 * @param list 待规范化的查询项列表
 */
export function normalizeFilter(list: Filter[]) {
  const result = list.filter(it => it.type != null).map(it => {
    const isStringType = typeof it.type === 'string'
    const stringType = it.type as string
    const component = isStringType ? innateTypeMap[stringType] : it.type as Component

    const item: NormalFilter = {
      ...it,
      component,
      class: [
        'ui-filter',
        kebabCase(component.name + '-' + it.name),
      ],
      style: {
        width: it.width ? `${it.width}px` : '',
        minWidth: it.minWidth ? `${it.minWidth}px` : '',
        maxWidth: it.maxWidth ? `${it.maxWidth}px` : '',
      },
      enumKey: it.enumKey || it.name.replace(/Code$|$/, 'List'),
      auth: it.auth || '',
      props: it.props || (isStringType ? defaultPropsMap[stringType] : {}) || {},
    }

    return item
  })

  return result
}

type RenderFunction = (h: any, ctx: any) => any

/**
 * iview Table 组件 column 类型
 * https://www.iviewui.com/components/table#column
 * NOTE: 类型中的函数类型，可能不准确
 */
export interface Column {
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
  enumType: MapType<any[]>
  enumMap: MapType<any>
  list: any[]
  handleError: (ex: any) => any
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
    devError(`dataKey 为 null`)
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
      const { text } = getEnum(column, enumMap, row) || { text: '' }
      return h('span', text || '')
    }
  },

  date: getTimeEditor('YYYY-MM-DD'),

  time: getTimeEditor('HH:mm:ss'),

  dateTime:  getTimeEditor('YYYY-MM-DD HH:mm:ss'),
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
      const factory = editorMap[it.editor]
      it.render = factory(it, param)
    }
    // 默认 center
    it.align || (it.align = 'center')
    return it
  })

  return result
}
