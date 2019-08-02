import { Component } from 'vue'
import { MapType, AjaxResult } from '@/util/types'
import { Select } from 'iview'
import LazyInput from '@/components/LazyInput'
import NumberInput from '@/components/numberInput'
import { kebabCase, isPlainObject } from 'lodash'
import Deprecated from '@/components/Deprecated.vue'
import PoptipSelect from '@/components/PoptipSelect.vue'
import { devError, devWarn } from '@/util/dev'
import { ParamDeal, Param } from '@/util/param'
import moment from 'moment'
import DatePicker from './components/datePicker.vue'
import DateRangePicker from './components/dateRangePicker.vue'
import RemoteSelect, {
  Fetch as RemoteSelectFetch,
  Backfill as RemoteSelectBackfill
} from '@/components/remoteSelect'
import {
  resolveRender as listResolveRender,
  LinkOptions as ListLinkOptions
} from './list'

/**
 * 固定类型列表
 */
export type InnateTypes = 'input' | 'number' | 'select' | 'date' | 'dateRange'

/**
 * 固定类型 Map
 */
const innateTypeMap: MapType<Component> = {
  input: LazyInput,

  number: NumberInput,

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

const filterComponentMap: MapType<Component> = {
  remoteSelect: RemoteSelect
}

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
   * TODO: 在新的方式下，该属性没用了
   */
  props?: MapType<any>

  /**
   * 权限配置
   */
  auth?: string

  // --------------------------------------------------
  // 新的语法，参考 echarts 的配置语法，每个组件占用一个 key
  // --------------------------------------------------

  /**
   * 组件 remoteSelect 的选项，若设置了该项，
   * 则说明会用 RemoteSelect 组件渲染该项
   */
  remoteSelect?: {
    fetch: RemoteSelectFetch,
    backfill?: RemoteSelectBackfill
  }
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

// 为了支持 true 作为属性的占位符
const resolveProps = (item: any, name: string) => {
  const props = item[name]
  return isPlainObject(props) ? props : {}
}

// 新的方式：解析组件
const resolveComponent = (item: Filter) => {
  let part: any = null
  if (item.type != null) {
    // 老的方式，通过 type
    const isStringType = typeof item.type === 'string'
    const stringType = item.type as string
    const component = isStringType ? innateTypeMap[stringType] : item.type as Component
    const props = isStringType ? defaultPropsMap[stringType] : {}
    part = { component, props }
  } else {
    // 新的方式，通过组件名
    const name = Object.keys(filterComponentMap).find(key => key in item)
    part = name && {
      component: filterComponentMap[name],
      props: resolveProps(item, name)
    }
  }
  return {
    ...item,
    component: part && part.component,
    props: {
      ...item.props,
      ...(part && part.props),
    }
  }
}

/**
 * 规范化查询项
 * @param list 待规范化的查询项列表
 */
export function normalizeFilter(list: Filter[]) {
  const result = list.map(resolveComponent)
  .filter(it => it.component != null)
  .map(it => {
    const { component } = it
    const item: NormalFilter = {
      ...it,
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
    } else if (it.render == null) {
      // 新版方法
      const render = listResolveRender(it)
      render && (it.render = render)
    }

    // 默认 center
    it.align || (it.align = 'center')
    return it
  })

  return result
}

/**
 * liet fetch 调用结果
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
