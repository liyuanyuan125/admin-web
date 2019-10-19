import { Component } from 'vue'
import { MapType, KeyText } from '@/util/types'
import LazyInput from '@/components/LazyInput'
import NumberInput from '@/components/numberInput'
import { kebabCase, isPlainObject, cloneDeep } from 'lodash'
import DatePicker from './components/datePicker.vue'
import DateRangePicker from './components/dateRangePicker.vue'
import WeekPicker from './components/weekPicker.vue'
import { FormSelect } from '@/components/editForm'
import RemoteSelect, {
  Fetch as RemoteSelectFetch,
  Backfill as RemoteSelectBackfill
} from '@/components/remoteSelect'
import CompanySelect from '@/components/companySelect'
import { OldFilter, resolveByType } from './oldFilter'
import { devWarn } from '@/util/dev'

interface ComponentItem {
  component: Component
  props?: MapType<any>
}

const componentMap: MapType<ComponentItem> = {
  input: {
    component: LazyInput
  },

  number: {
    component: NumberInput
  },

  select: {
    component: FormSelect,
    props: {
      clearable: true,
    }
  },

  date: {
    component: DatePicker
  },

  dateRange: {
    component: DateRangePicker
  },

  week: {
    component: WeekPicker
  },

  remoteSelect: {
    component: RemoteSelect
  },

  company: {
    component: CompanySelect
  }
}

/**
 * 查询项
 */
export interface Filter extends OldFilter {
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

  /** 组件，一般用于自定义组件 */
  component?: Component

  /**
   * 传递给组件的 props
   */
  props?: MapType<any>

  /**
   * 权限配置
   */
  auth?: string

  // --------------------------------------------------
  // 新的语法，参考 echarts 的配置语法，每个组件占用一个 key
  // --------------------------------------------------

  /** 组件 LazyInput 的选项 */
  input?: true | {
    [key: string]: any
  },

  /** 组件 Select 的选项 */
  select?: true | {
    enumKey?: string
    enumList?: KeyText[]
    [key: string]: any
  },

  /**
   * 组件 remoteSelect 的选项，若设置了该项，
   * 则说明会用 RemoteSelect 组件渲染该项
   */
  remoteSelect?: true | {
    fetch: RemoteSelectFetch,
    backfill?: RemoteSelectBackfill
    [key: string]: any
  },

  /** 组件 DatePicker 的选项 */
  date?: true | {
    /**
     * 模式，默认 date
     * date  - 日选择模式
     * month - 月选择模式
     * year  - 年选择模式
     */
    type?: 'date' | 'month' | 'year'
    [key: string]: any
  },

  /** 组件 DateRangePicker 的选项 */
  dateRange?: true | {
    [key: string]: any
  },

  /** 组件 WeekDatePicker 的选项 */
  week?: true | {
    [key: string]: any
  },

  // TODO: company 这种业务组件，不应该放在这里，将来重构时移除

  /**
   * 组件 companySelect 的选项
   * 默认请求有效的公司列表（启用 status: 1 且审核通过的 approveStatus: 2）
   */
  company?: true | {
    /**
     * 附加查询条件，参见：https://yapi.aiads-dev.com/project/34/interface/api/287
     * 默认请求有效的公司列表（启用 status: 1 且审核通过的 approveStatus: 2）
     */
    query?: MapType<any>
    [key: string]: any
  }
}

/**
 * 规范化后的查询项
 */
export interface NormalFilter extends Filter {
  /** class 或 class 列表 */
  class: string | string[]

  /** 样式对象 */
  style: MapType
}

// 为了支持 true 作为属性的占位符
const resolveProps = (item: any, name: string) => {
  const props = item[name]
  return isPlainObject(props) ? cloneDeep(props) : {}
}

// 新的方式：解析组件
const resolveComponent = (item: Filter) => {
  let part: any = null

  if (item.type != null) {
    part = resolveByType(item)
    devWarn('=> [ListPage] filter type 已过时，请使用新形式，name:', item.name)
  } else {
    // 新的方式，通过组件名
    const name = Object.keys(componentMap).find(key => key in item)
    if (name) {
      const {
        component,
        props: defaultProps = {},
      } = componentMap[name]

      part = {
        component,
        props: {
          ...defaultProps,
          ...resolveProps(item, name)
        }
      }
    }
  }

  const newItem = {
    ...item,
    component: part && part.component || item.component,
    props: {
      ...item.props,
      ...(part && part.props),
    }
  }

  return newItem
}

/**
 * 规范化查询项
 * @param list 待规范化的查询项列表
 */
export function normalizeFilter(list: Filter[]) {
  const result = list.map(resolveComponent)
  .filter(it => it.component != null)
  .map(it => {
    const { component, props = {} } = it

    // 单独处理 enumKey
    const enumKey = props.enumKey
    delete props.enumKey

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
      enumKey: enumKey || it.enumKey || it.name.replace(/Code$|$/, 'List'),
      auth: it.auth || '',
    }

    return item
  })

  return result
}
