import { Select } from 'iview'
import { Component } from 'vue'
import { ParamDeal, Param } from '@/util/param'
import { MapType, KeyText } from '@/util/types'
import LazyInput from '@/components/LazyInput'
import NumberInput from '@/components/numberInput'
import DatePicker from './components/datePicker.vue'
import DateRangePicker from './components/dateRangePicker.vue'

// 老版的 filter

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

/** 老版的数据结构 */
export interface OldFilter extends Param {
  /** 老式的用法，要使用 component 类型 */
  type?: InnateTypes | Component
}

/** 老的，基于 type 的解析方式 */
export function resolveByType(item: OldFilter) {
  // 老的方式，通过 type
  const isStringType = typeof item.type === 'string'
  const stringType = item.type as string
  const component = isStringType ? innateTypeMap[stringType] : item.type as Component
  const part = {
    component,
    props: isStringType ? defaultPropsMap[stringType] : {}
  }
  return part
}
