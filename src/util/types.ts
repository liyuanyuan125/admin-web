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
