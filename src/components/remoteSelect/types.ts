/**
 * 从接口返回的项目类型
 */
export interface IdName {
  /**
   * id 字段，可为 number 或 string
   */
  id: number | string

  /**
   * 展示名
   */
  name: string
}

/**
 * 请求函数类型
 */
export type Fetch = (keyword: string) => Promise<IdName[]>
