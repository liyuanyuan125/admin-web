import { Component, WatchOptions } from 'vue'
import { kebabCase, isPlainObject, cloneDeep, isEqual } from 'lodash'
import { Param } from '@/util/param'
import FormText from './components/formText.vue'
import FormInput from './components/formInput.vue'
import FormInputNumber from './components/formInputNumber.vue'
import FormSelect from './components/formSelect.vue'
import RemoteSelect, {
  Fetch as RemoteFetch,
  Backfill as RemoteBackfill,
  IdName
} from '@/components/remoteSelect'
import FormRadio from './components/formRadio.vue'
import FormCheck from './components/formCheck.vue'
import FormDate from './components/formDate.vue'
import FormDateRange from './components/formDateRange.vue'
import FormImage from './components/formImage.vue'
import FormImageList from './components/formImageList.vue'
import AreaSelect from '@/components/areaSelect'
import CompanySelect from '@/components/companySelect'
import AdminUserSelect from '@/components/adminUserSelect'
import { Switch } from 'iview'
import { AjaxResult, MapType, KeyText } from '@/util/types'
import { Formatter } from './components/formatter'
import EditForm from './editForm.vue'
import { devLog, devError } from '@/util/dev'

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
const makeRequiredRule = (field: Field, rule?: Rule) => {
  const defaultValue = field.defaultValue
  const result: Rule = {
    required: true,
    message: field.requiredMessage || '不能为空',
    trigger: 'change',
    transform(value: any) {
      // null 始终被认为是空
      if (value == null) {
        return ''
      }
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
    }
  },

  number: {
    component: FormInputNumber,
    props: {
      placeholder: '请输入',
      min: 0,
    }
  },

  select: {
    component: FormSelect,
    props: {
      placeholder: '请选择'
    }
  },

  remote: {
    component: RemoteSelect,
    props: {
      placeholder: '请输入关键字进行搜索'
    }
  },

  area: {
    component: AreaSelect,
  },

  radio: {
    component: FormRadio,
  },

  check: {
    component: FormCheck,
  },

  switch: {
    component: Switch,
    props: {
      class: 'form-switch'
    }
  },

  date: {
    component: FormDate,
  },

  dateRange: {
    component: FormDateRange
  },

  image: {
    component: FormImage,
  },

  imageList: {
    component: FormImageList
  },

  company: {
    component: CompanySelect
  },

  adminUser: {
    component: AdminUserSelect
  },
}

/**
 * WatchFunction 的第三个参数
 */
export interface WatchParam {
  /**
   * EditForm 实例
   */
  vm: EditForm

  /**
   * 旧值
   * 摘自 Vue 官方文档：
   * 注意：在变异 (不是替换) 对象或数组时，旧值将与新值相同，因为它们
   * 的引用指向同一个对象/数组。Vue 不会保留变异之前值的副本。
   */
  oldValue: any

  /**
   * 内部编辑的数据对象，可以直接赋值，以便更新内部数据
   */
  item: any
}

/**
 * 观察者函数，与 Vue 不同，第二个参数是 WatchParam
 */
export type WatchHandler = (value: any, param: WatchParam) => void

/**
 * 带选项的观察者函数
 */
export interface WatchOptionsWithHandler extends WatchOptions {
  handler: WatchHandler
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
   * 标签宽度
   */
  labelWidth?: number

  /**
   * 要使用的 component
   */
  component?: Component

  /**
   * 传递给组件的 props
   */
  props?: MapType<any>

  /**
   * 传递给组件的事件处理函数
   */
  handlers?: MapType<any>

  /**
   * 观察本字段变化的函数
   */
  watch?: WatchHandler | WatchOptionsWithHandler

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

  /** 自动宽度模式 */
  autoWidth?: boolean

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 是否为必填的
   * 若为必填，且 rules 为空，则 rules 默认为
   * [ { required: true, message: requiredMessage, trigger: 'blur' } ]
   */
  required?: boolean

  /**
   * 必填验证失败消息，默认为：不能为空
   */
  requiredMessage?: string

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

  /**
   * 切换 Col 是否显示的函数
   */
  visibleCol?: (item: any) => boolean

  // --------------------------------------------------
  // 新的语法，参考 echarts 的配置语法，每个组件占用一个 key
  // --------------------------------------------------

  /**
   * 使用组件 Text
   */
  text?: true

  /**
   * 组件 Input 的选项
   * 更多属性详见 iview 文档 https://www.iviewui.com/components/input
   */
  input?: true | {
    /** 类型 */
    type?: 'text' | 'password' | 'textarea' | 'url' | 'email' | 'date' | 'number' | 'tel'
    prepend?: string
    append?: string
    /**
     * 是否显示 poptip，以及用什么格式化函数
     * 当 poptip 为 true 时，则使用组件默认的格式化函数显示提示
     * 当 poptip 为 string 时，则使用 formatter.ts 中的函数名对应的格式化函数显示提示
     * 当 poptip 为函数时，则只用该函数本身
     */
    poptip?: boolean | string | Formatter
    [key: string]: any
  }

  /**
   * 组件 InputNumber 的选项
   * 更多属性详见 iview 文档 https://www.iviewui.com/components/input-number
   */
  number?: true | {
    min?: number
    max?: number
    /**
     * 是否显示 poptip，以及用什么格式化函数
     * 当 poptip 为 true 时，则使用组件默认的格式化函数显示提示
     * 当 poptip 为 string 时，则使用 formatter.ts 中的函数名对应的格式化函数显示提示
     * 当 poptip 为函数时，则只用该函数本身
     */
    poptip?: boolean | string | Formatter
    [key: string]: any
  }

  /**
   * 使用组件 Select
   */
  select?: {
    enumKey?: string
    enumList?: KeyText[]
    multiple?: boolean
    [key: string]: any
  },

  /**
   * 使用组件 RemoteSelect
   */
  remote?: {
    fetch?: RemoteFetch
    backfill?: RemoteBackfill
    multiple?: boolean
    initList?: IdName[]
    [key: string]: any
  },

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
    enumKey?: string
    enumList?: KeyText[]
    [key: string]: any
  }

  /**
   * 使用组件 Check
   */
  check?: {
    enumKey?: string
    enumList?: KeyText[]
    [key: string]: any
  }

  /**
   * 使用组件 Switch
   */
  switch?: true | {
    trueValue?: boolean | number | string
    falseValue?: boolean | number | string
    size?: 'default' | 'small' | 'large'
    loading?: boolean
    [key: string]: any
  },

  date?: true | {
    [key: string]: any
  },

  dateRange?: true | {
    [key: string]: any
  },

  /**
   * 组件 image 的选项，若设置了该项，
   * 则说明会用 FormImage 组件渲染该项
   */
  image?: true | {
    // buttonText?: string
    [key: string]: any
  },

  /**
   * 组件 imageList 的选项，若设置了该项，
   * 则说明会用 FormImageList 组件渲染该项
   */
  imageList?: true | {
    /** 上传文件的最大个数，默认 3 个 */
    maxCount?: number
    /** 是否添加附加信息，若添加，则 value 会变成 FileItem[] */
    withExtra?: boolean
    [key: string]: any
  },

  /**
   * 组件 CompanySelect 的选项
   */
  company?: true | {
    /** 附加查询数据 */
    query?: MapType<any>
    [key: string]: any
  },

  /**
   * 组件 AdminUserSelect 的选项
   */
  adminUser?: true | {
    /** 附加查询数据 */
    query?: MapType<any>
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
const resolveProps = (field: any, name: string) => {
  const props = field[name]
  return isPlainObject(props) ? cloneDeep(props) : {}
}

// 新的方式：解析组件
const resolveComponent = (field: Field) => {
  let configRequiredRule
  const name = Object.keys(componentMap).find(key => key in field)
  if (name) {
    const {
      component,
      props: defaultProps = {},
      requiredRule
    } = componentMap[name]

    const props = resolveProps(field, name)

    configRequiredRule = requiredRule

    field = {
      ...field,
      component,
      props: {
        ...defaultProps,
        ...props
      }
    } as any
  }

  // 处理验证规则
  const rules = (field.rules || []).length == 0 && field.required
    ? [ makeRequiredRule(field, configRequiredRule) ]
    : (field.rules || [])

  field.rules = rules

  return field as any
}

/**
 * 规范化字段配置
 * @param list 待规范化的字段配置列表
 */
export function normalizeField(list: Field[]) {
  const result = list.map(resolveComponent)
  .filter(it => it.component != null)
  .map((it: Field) => {
    const { component, props = {}, placeholder } = it

    // 单独处理 enumKey
    const enumKey = props.enumKey
    delete props.enumKey

    const watch = it.watch && (
      typeof it.watch === 'function' ? { handler: it.watch } : it.watch
    )

    const field: NormalField = {
      span: 1,
      offsetLeft: 0,
      offsetRight: 0,
      visible: () => true,
      visibleCol: () => true,

      ...(it as any),

      component,
      enumKey,
      props: {
        ...props,
        // 优先使用 placeholder
        placeholder: placeholder != null ? placeholder : (props && props.placeholder)
      },
      watch,

      style: {
        width: it.width ? `${it.width}px` : '',
        minWidth: it.minWidth ? `${it.minWidth}px` : '',
        maxWidth: it.maxWidth ? `${it.maxWidth}px` : '',
      },
      auth: it.auth || '',
    }

    const classBase = kebabCase(field.name)

    field.colClass = {
      'col-field': true,
      'col-no-label': !field.label,
      'col-field-auto-width': !!field.autoWidth,
      [`col-offset-right-${field.offsetRight}`]: field.offsetRight! > 0,
      [`col-field-${classBase}`]: true,
    }

    field.class = {
      'ui-field': true,
      [`ui-field-${classBase}`]: true,
    }

    return field
  })

  return result
}

/**
 * 规范化字段配置，并根据 group 字段分组
 * @param list 待规范化的字段配置列表
 * @param data 数据对象
 */
export function normalizeAndGroupField(list: Field[], data: any) {
  const fieldList = normalizeField(list)
  if (fieldList.length == 0) {
    return []
  }

  let lastGroup: GroupField
  const group = fieldList.reduce((ret, field, index) => {
    if (field.group || index == 0) {
      lastGroup = {
        name: field.group || '',
        list: []
      }
      ret.push(lastGroup)
    }
    lastGroup.list.push(field)
    return ret
  }, [] as GroupField[])

  // 过滤掉，visibleCol 计算结果，全部为假的 group
  const result = group.filter(g => g.list.some(it => it.visibleCol!(data)))
  return result
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
    : {
      code: 0,
      // 若非 { data: { item, ... } } 格式，则包装成这种格式
      data: 'item' in data ? data : { item: data },
      msg: ''
    }
}

/**
 * 字段名与错误消息数据
 */
export interface EditErrorData {
  [name: string]: string
}

/**
 * 处理错误的数据结构
 */
export interface EditErrorHandlers {
  [code: number]: EditErrorData | ((ex: AjaxResult, { item: any }: any) => EditErrorData)
}
