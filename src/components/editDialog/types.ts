import { Component } from 'vue'
import { MapType } from '@/util/types'
import { Select } from 'iview'
import { Input } from 'iview'
import { kebabCase } from 'lodash'
import { Param } from '@/util/param'

/**
 * 固定类型列表
 */
export type InnateTypes = 'input' | 'select'

/**
 * 固定类型 Map
 */
const innateTypeMap: MapType<Component> = {
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

/**
 * 字段配置
 */
export interface Field extends Param {
  /**
   * 要使用的编辑器 component 类型，不设置则不使用编辑器，不会出现在 from 中
   */
  type?: InnateTypes | Component

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
   * placeholder
   */
  placeholder?: string

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

const defaultPlaceholderMap: MapType = {
  input: '请输入',
  select: '请选择',
}

/**
 * 规范化字段配置
 * @param list 待规范化的字段配置列表
 */
export function normalizeField(list: Field[]) {
  const result = list.filter(it => it.type != null).map(it => {
    const typeIsString = typeof it.type === 'string'
    const type = it.type as string
    const component = typeIsString ? innateTypeMap[type] : it.type as Component

    const item: NormalField = {
      span: 1,
      ...it,
      component,
      placeholder: it.placeholder != null
        ? it.placeholder
        : typeIsString ? defaultPlaceholderMap[type] : undefined,
      class: [
        'ui-field',
        kebabCase(component.name + '-' + it.name),
      ],
      style: {
        // width: it.width ? `${it.width}px` : '',
        // minWidth: it.minWidth ? `${it.minWidth}px` : '',
        // maxWidth: it.maxWidth ? `${it.maxWidth}px` : '',
      },
      enumKey: it.enumKey || it.name.replace(/Code$|$/, 'List'),
      props: it.props || {},
    }

    return item
  })

  return result
}
