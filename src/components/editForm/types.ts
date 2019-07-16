import { Component } from 'vue'
import { MapType, KeyText } from '@/util/types'
import { kebabCase, isPlainObject, cloneDeep, isEqual } from 'lodash'
import { Param } from '@/util/param'
import FormText from './components/formText.vue'
import FormInput from './components/formInput.vue'
import FormSelect from './components/formSelect.vue'
import FormRadio from './components/formRadio.vue'
import FormImage from './components/formImage.vue'
import AreaSelect from '@/components/areaSelect'
import NumberInput from '@/components/numberInput'

export type ValidatorCallback = (error?: Error) => any

/**
 * 验证器
 * https://github.com/yiminghe/async-validator#rules
 */
export type Validator = (rule: any, value: any, callback: ValidatorCallback) => void

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

// 生成默认的 required 规则
const makeRequiredRule = (item: Field, rule?: Rule) => {
  const defaultValue = item.defaultValue
  const result: Rule = {
    required: true,
    message: '不能为空',
    trigger: 'change',
    transform(value: any) {
      const equal = isEqual(value, defaultValue)
      return equal ? '' : 'not-empty'
    },
    ...rule,
  }
  return result
}

interface ComponentItem {
  component: Component
  props?: MapType<any>
  // 当字段 required 时，默认的 rule（部分字段）
  requiredRule?: Rule
}

const componentMap: MapType<ComponentItem> = {
  text: {
    component: FormText
  },

  input: {
    component: FormInput,
    props: {
      placeholder: '请输入',
    },
    requiredRule: {
      trigger: 'blur'
    }
  },

  number: {
    component: NumberInput,
    props: {
      placeholder: '请输入',
      min: 0,
    },
    requiredRule: {
      trigger: 'blur'
    }
  },

  select: {
    component: FormSelect,
    props: {
      placeholder: '请选择'
    }
  },

  area: {
    component: AreaSelect,
  },

  radio: {
    component: FormRadio,
  },

  image: {
    component: FormImage,
  },
}

/**
 * 字段配置
 */
export interface Field extends Param {
  /**
   * 分组名，用于复杂表单编辑
   */
  group?: string

  /**
   * 标签
   */
  label?: string

  /**
   * 要使用的 component
   */
  component?: Component

  /**
   * 传递给组件的 props
   */
  props?: MapType<any>

  /**
   * 占用的空间大小，从 1 ~ 24
   */
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
    | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24

  /**
   * 向左偏移量
   */
  offsetLeft?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
    | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23

  /**
   * 向右偏移量
   */
  offsetRight?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
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
   * 默认枚举索引
   * 若设置了该项，当该字段的值为默认值时，强制选择相应枚举列表中，该索引对应项的值
   */
  defaultEnumIndex?: number

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
   * 使用组件 Text
   */
  text?: true

  /**
   * 使用组件 Input
   */
  input?: true | {
    prepend?: string
    append?: string
    [key: string]: any
  }

  /**
   * 组件 NumberInput 的选项
   */
  number?: true | {
    min?: number
    max?: number
    showZero?: boolean
    prepend?: string
    append?: string
    [key: string]: any
  }

  /**
   * 使用组件 Select
   */
  select?: {
    enumKey: string
    [key: string]: any
  }

  /**
   * 组件 AreaSelect 的选项
   */
  area?: true | {
    maxLevel?: number
    clearable?: boolean
    noSelf?: boolean
    [key: string]: any
  }

  /**
   * 使用组件 Radio
   */
  radio?: {
    enumKey: string
    [key: string]: any
  }

  /**
   * 组件 image 的选项，若设置了该项，
   * 则说明会用 FormImage 组件渲染该项
   */
  image?: true | {
    // buttonText?: string
    [key: string]: any
  }
}

/**
 * 规范化后的字段配置
 */
export interface NormalField extends Field {
  /** 包裹组件的 col 的 class */
  colClass: MapType<boolean>

  /** 组件的 class */
  class: MapType<boolean>

  /** 样式对象 */
  style: MapType

  /** 枚举 key，从 radio.enumKey、select.enumKey 等子属性中提取 */
  enumKey?: string
}

/**
 * NormalField 分组
 */
export interface GroupField {
  name: string
  list: NormalField[]
}

// 为了支持 true 作为属性的占位符
const resolveProps = (item: any, name: string) => {
  const props = item[name]
  return isPlainObject(props) ? cloneDeep(props) : {}
}

// 新的方式：解析组件
const resolveComponent = (item: Field) => {
  const name = Object.keys(componentMap).find(key => key in item)
  if (name) {
    const {
      component,
      props: defaultProps = {},
      requiredRule
    } = componentMap[name]

    const props = resolveProps(item, name)

    // 单独处理 enumKey
    const enumKey = props.enumKey
    delete props.enumKey

    // 处理验证规则
    const rules = (item.rules || []).length == 0 && item.required
      ? [ makeRequiredRule(item, requiredRule) ]
      : (item.rules || [])

    const result = {
      ...item,
      component,
      enumKey,
      props: {
        ...defaultProps,
        ...props
      },
      rules
    } as any

    return result
  }
  return item as any
}

/**
 * 规范化字段配置
 * @param list 待规范化的字段配置列表
 */
export function normalizeField(list: Field[]) {
  const result = list.map(resolveComponent)
  .filter(it => it.component != null)
  .map(it => {
    const { component, props, placeholder } = it
    const item: NormalField = {
      span: 1,
      offsetLeft: 0,
      offsetRight: 0,
      visible: () => true,
      ...it,
      component,
      props: {
        ...props,
        // 优先使用 placeholder
        placeholder: placeholder || (props && props.placeholder)
      },
      style: {
        width: it.width ? `${it.width}px` : '',
        minWidth: it.minWidth ? `${it.minWidth}px` : '',
        maxWidth: it.maxWidth ? `${it.maxWidth}px` : '',
      },
      auth: it.auth || '',
    }

    const classBase = kebabCase(`${component.name}-${item.name}`)

    item.colClass = {
      'col-field': true,
      'col-no-label': !item.label,
      [`col-${classBase}`]: true,
      [`col-offset-right-${item.offsetRight}`]: item.offsetRight! > 0
    }

    item.class = {
      'ui-field': true,
      [`ui-${classBase}`]: true,
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
