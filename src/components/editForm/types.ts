import { Component } from 'vue'
import { MapType } from '@/util/types'
import { Select } from 'iview'
import { Input } from 'iview'
import { kebabCase, isPlainObject } from 'lodash'
import { Param } from '@/util/param'
import FormText from './components/formText.vue'
import FormImage from './components/formImage.vue'
import AreaSelect from '@/components/areaSelect'
import NumberInput from '@/components/numberInput'

/**
 * 固定类型列表
 */
export type InnateTypes = 'text' | 'input' | 'select'

/**
 * 固定类型 Map
 */
const innateTypeMap: MapType<Component> = {
  text: FormText,
  input: Input,
  select: Select,
}

export type ValidatorCallback = (error?: Error) => any

/**
 * 验证器
 * https://github.com/yiminghe/async-validator#rules
 */
export type Validator = (rule: any, value: any, callback: ValidatorCallback) => boolean | Error

/**
 * 验证规则
 * https://github.com/yiminghe/async-validator
 */
export interface Rule {
  /** 是否必填 */
  required?: boolean

  /** 验证错误消息 */
  message?: string

  /** 验证时机 */
  trigger?: 'blur' | 'change'

  /** 自定义验证器 */
  validator?: Validator

  /** 其他项，详见 https://github.com/yiminghe/async-validator */
  [key: string]: any
}

const fieldComponentMap: MapType<Component> = {
  image: FormImage,
  area: AreaSelect,
  number: NumberInput
}

/**
 * 字段配置
 */
export interface Field extends Param {
  /**
   * 要使用的编辑器 component 类型，不设置则不使用编辑器，不会出现在 from 中
   */
  type?: InnateTypes | Component

  /**
   * 分组名，用于复杂表单编辑
   */
  group?: string

  /**
   * 标签
   */
  label?: string

  /**
   * 占用的空间大小，从 1 ~ 24
   */
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
    | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24

  /**
   * 占用空间偏移量
   */
  offset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
    | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23

  /**
   * placeholder
   */
  placeholder?: string

  /** width */
  width?: number

  /** minWidth */
  minWidth?: number

  /** maxWidth */
  maxWidth?: number

  /**
   * 是否为必填的
   * 若为必填，且 rules 为空，则 rules 默认为
   * [ { required: true, message: '不能为空', trigger: 'blur' } ]
   */
  required?: boolean

  /**
   * 验证规则
   * 若该字段不为空，则忽略 required 字段的值
   */
  rules?: Rule[]

  /**
   * 当 enumKey 为 select 时，渲染 select 的枚举列表的 key
   * 如果没有明确设置，则 enumKey 会被设置为 name.replace(/Code$|$/, 'List')
   */
  enumKey?: string

  /**
   * 默认枚举索引
   * 若设置了该项，当该字段的值为默认值时，强制选择相应枚举列表中，该索引对应项的值
   */
  defaultEnumIndex?: number

  /**
   * 传递给组件的 props
   */
  props?: MapType<any>

  /**
   * 权限配置
   */
  auth?: string

  /**
   * 切换是否显示的函数
   */
  visible?: (item: any) => boolean

  // --------------------------------------------------
  // 新的语法，参考 echarts 的配置语法，每个组件占用一个 key
  // --------------------------------------------------

  /**
   * 组件 image 的选项，若设置了该项，
   * 则说明会用 FormImage 组件渲染该项
   */
  image?: true | {
    buttonText?: string
  }

  /**
   * 组件 AreaSelect 的选项
   */
  area?: true | {
    maxLevel?: number
    clearable?: boolean
    placeholder?: string
    noSelf?: boolean
  }

  /**
   * 组件 NumberInput 的选项
   */
  number?: true | {
    showZero?: boolean
  }
}

/**
 * 规范化后的字段配置
 */
export interface NormalField extends Field {
  /** 确定要使用的 component */
  component: Component

  /** class 或 class 列表 */
  class: string | string[]

  /** 样式对象 */
  style: MapType
}

/**
 * NormalField 分组
 */
export interface GroupField {
  name: string
  list: NormalField[]
}

const defaultPlaceholderMap: MapType = {
  input: '请输入',
  select: '请选择',
}

// 为了支持 true 作为属性的占位符
const resolveProps = (item: any, name: string) => {
  const props = item[name]
  return isPlainObject(props) ? props : {}
}

// 新的方式：解析组件
const resolveComponent = (item: Field) => {
  let part: any = null
  if (item.type != null) {
    // 老的方式，通过 type
    const isStringType = typeof item.type === 'string'
    const stringType = item.type as string
    const component = isStringType ? innateTypeMap[stringType] : item.type as Component
    const props = {
      placeholder: item.placeholder != null
        ? item.placeholder
        : isStringType ? defaultPlaceholderMap[stringType] : undefined
    }
    part = { component, props }
  } else {
    // 新的方式，通过组件名
    const name = Object.keys(fieldComponentMap).find(key => key in item)
    part = name && {
      component: fieldComponentMap[name],
      props: resolveProps(item, name)
    }
  }
  return { ...item, ...part }
}

/**
 * 规范化字段配置
 * @param list 待规范化的字段配置列表
 */
export function normalizeField(list: Field[]) {
  const result = list.map(resolveComponent)
  .filter(it => it.component != null)
  .map(it => {
    const { component } = it
    const item: NormalField = {
      span: 1,
      offset: 0,
      visible: () => true,
      ...it,
      component,
      class: [
        'ui-field',
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

/**
 * 规范化字段配置，并根据 group 字段分组
 * @param list 待规范化的字段配置列表
 */
export function normalizeAndGroupField(list: Field[]) {
  const fieldList = normalizeField(list)
  if (fieldList.length == 0) {
    return []
  }

  let lastGroup: GroupField
  const group = fieldList.reduce((ret, item, index) => {
    if (item.group || index == 0) {
      lastGroup = {
        name: item.group || '',
        list: []
      }
      ret.push(lastGroup)
    }
    lastGroup.list.push(item)
    return ret
  }, [] as GroupField[])

  return group
}

/**
 * liet fetch 调用结果
 */
export interface FetchResult {
  code: number
  data: FetchData
  msg: string
}

/**
 * 新的接口数据：fetch 接口实际数据
 * NOTE: 由于历史原因，采用的是上面的 FetchResult，但后来发现，直接用 item 更加
 * 方便，故而，有以下新的数据结构，组件本身屏蔽这种差异，提供一致性、无缝衔接式的体验
 */
export interface FetchData {
  item: any
  // 其他属性
  [key: string]: any
  [index: number]: any
}

/**
 * 将新的数据结构，转换成老的数据结构
 * @param data 传入的值
 */
export function fetchDataToResult(data: FetchData | FetchResult) {
  return 'code' in data && 'data' in data
    // 已经是 FetchResult 格式了，直接返回
    ? data as FetchResult
    // 进行简单包装
    : { code: 0, data, msg: '' }
}
