import { Component } from 'vue'
import { MapType, AjaxResult } from '@/util/types'
import { Select } from 'iview'
import { Input } from 'iview'
import { kebabCase } from 'lodash'
import Deprecated from '@/components/Deprecated.vue'
import { devError } from '@/util/dev'

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
 * 字段配置
 */
export interface Field {
  /** 名称 */
  name: string

  /** 标签 */
  label: string

  /** 默认值 */
  defaultValue: any

  /** 占用的空间大小，从 1 ~ 24 */
  span: number

  /** 要使用 component 类型 */
  type?: InnateTypes | Component

  /** placeholder */
  placeholder?: string

  /** 是否为必填的 */
  required?: boolean

  /** 验证时机 */
  trigger?: 'blur' | 'change'

  /** 自定义验证器 */
  validator?: Validator
}
