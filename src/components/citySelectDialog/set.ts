import { intersection } from 'lodash'

/**
 * 集合关系
 */
export enum SetRelation {
  /** 没有关系 */
  None,

  /** 半交：有交集，但又互不包含 */
  Half,

  /** 集合 A 在集合 B 中 */
  AInB,

  /** 集合 B 在集合 A 中 */
  BInA,

  /** 两个集合相等 */
  Equal
}

/**
 * 获取集合 A 与 B 的关系
 * @param setA 集合 A
 * @param setB 集合 B
 */
export function getRelation(setA: ArrayLike<any>, setB: ArrayLike<any>) {
  const inter = intersection(setA, setB)

  const count = inter.length
  const alen = setA.length
  const blen = setB.length

  return (
    // 没有交集
    count == 0
    ? SetRelation.None
    // 若差集个数小于两个集合的个数，一定是「半交」，否则一定有包含关系
    : count < alen && count < blen
    ? SetRelation.Half
    : alen == blen
    ? SetRelation.Equal
    : alen < blen
    ? SetRelation.AInB
    : SetRelation.BInA
  )
}

/**
 * 判断集合 set 是否包含在集合 store 中（相等也算作包含）
 * @param store 大集合
 * @param set 小集合
 */
export function includes(store: ArrayLike<any>, set: ArrayLike<any>) {
  const rel = getRelation(store, set)
  return rel == SetRelation.BInA || rel == SetRelation.Equal
}
