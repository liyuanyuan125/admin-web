/**
 * 品牌项
 */
export interface Brand {
  id: number
  name: string
}

/**
 * 品牌加上是否绑定
 */
export interface BrandBind extends Brand {
  hasBind: boolean
}
