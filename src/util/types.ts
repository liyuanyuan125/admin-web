///
/// 通用类型，非通用的不要声明在这里
///

/** 通用 Map 泛型，为了与新标准中的 Map 类相区分，这里使用名称 MapType */
export interface MapType<T = string> {
  [key: string]: T
  [index: number]: T
}

/** 可取消的事件 */
export interface CancelableEvent {
  canceled: boolean
}

/** 全站枚举类型 */
export interface KeyText {
  key: string | number
  text: string
}

/** 全站枚举类型 ControlStatus 字段的类型  */
export type ControlStatus = 1 | 2

/** 全站枚举类型，带 controlStatus */
export interface KeyTextControlStatus extends KeyText {
  controlStatus: ControlStatus
}

/** 权限页 */
export interface PermPage {
  /** 名称 */
  name: string
  /** 路径，本系统为 route name */
  path: string
  /** 图标 */
  icon: string
  /** 层级，从 1 开始 */
  level: number
  /** 子级页面 */
  children: PermPage[]
}

/**
 * ajax 调用结果
 */
export interface AjaxResult {
  code: number
  data: any
  msg: string
}

/**
 * 判断 object 是否为 AjaxResult（只要含有 code 就行）
 * @param object 对象
 */
export function isAjaxResult(object: any) {
  return !!(object && typeof object === 'object' && 'code' in object)
}

/**
 * 获取 KOL 平台列表
 */
export function getChannelList() {
  return [
    { name: '微信', value: 'wechat' },
    { name: '微博', value: 'weibo' },
    { name: '快手', value: 'kuaishou' },
    { name: '抖音', value: 'douyin' },
  ]
}

