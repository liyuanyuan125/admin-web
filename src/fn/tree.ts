/**
 * 对 tree 进行操作，本文件所指的 Tree 为没有根的 tree
 * TODO: 未来增加对带有根节点的 tree 的支持
 * TODO: 下面的代码，与业务逻辑捆绑太死，需要重构！！
 * @author zhangpeng
 */

import { groupBy, Dictionary } from 'lodash'

export interface TreeOptions {
  /** 生成的 tree 数据中，包含子级列表的 key */
  childrenKey?: string
}

const treeDefaultOptions: TreeOptions = {
  childrenKey: 'children',
}

/**
 * listToTree 工具函数选项
 */
export interface ListToTreeOptions extends TreeOptions {
  /** 主键 key */
  idKey?: string
  /** 父级 key */
  parentKey?: string
  /** 根节点的值 */
  rootValue?: any
}

const listToTreeDefaultOptions = {
  ...treeDefaultOptions,
  idKey: 'id',
  parentKey: 'pid',
  rootValue: 0,
}

const makeTree = (list: any[], group: Dictionary<any[]>, opts: ListToTreeOptions) => {
  list.forEach(it => {
    const id = it[opts.idKey!]
    const children = group[id]
    if (children != null) {
      it[opts.childrenKey!] = children
      makeTree(children, group, opts)
    }
  })
}

/**
 * 将平坦化的 list 数据，加工成 tree 数据
 * @param list
 * @param options
 */
export function listToTree(list: any[], options = {} as ListToTreeOptions) {
  const opts = { ...listToTreeDefaultOptions, ...options }
  const group = groupBy(list, opts.parentKey)
  const root = group[opts.rootValue] || []
  makeTree(root, group, opts)
  return root
}

/**
 * walkTree 工具函数选项
 */
export interface WalkTreeOptions<T> extends TreeOptions {
  /**
   * 可以在 onEach 时，添加额外的 children，该选项控制额外的 children 是否添加到最后
   */
  extraChildrenInsertAfter?: boolean

  /**
   * 遍历每一个节点之前时的回调
   * @param node 当前节点
   * @param parentNodes 所有父级节点
   * @return 可以返回新节点，也可什么都不返回，返回新节点将生成一棵新的树
   */
  onEachBefore?(node: T, parentNodes: any[]): any

  /**
   * 遍历每一个节点之后时的回调，若明确地返回 false，则删除该节点
   * @param newNode 当前新节点，注意与 onEachBefore 的区别，这里是 onEachBefore 返回的新节点
   * @param parentNodes 所有父级节点
   * @return 可以返回新节点，也可什么都不返回，返回新节点将生成一棵新的树
   */
  onEachAfter?(newNode: any, parentNodes: any[]): any
}

// 深度优先遍历树，树的节点必须为对象
const doWalkTree = <T>(nodes: T[], opts: WalkTreeOptions<T>, parentNodes: any[]) => {
  const childrenKey = opts.childrenKey!

  const list = (nodes || []).map(node => {
    const newNode = opts.onEachBefore!(node, parentNodes) || node

    const children = (node as any)[childrenKey]
    if (children != null) {
      // 确保 parentNodes 里都是新节点，此时刚添加的新节点还没有 children
      const newParentNodes = [ ...parentNodes ].concat(newNode)

      // 深度遍历子节点
      const newChildren = doWalkTree(children, opts, newParentNodes) || children

      // 如果新节点是全新节点，支持在 newNode 中添加扩展 children
      // 只有是全新节点时，才获取全新节点中的子节点
      const extraChildren = newNode !== node && newNode[childrenKey] || []

      // 与处理后的原节点的子节点进行合并
      const newNodeChildren = opts.extraChildrenInsertAfter!
        ? newChildren.concat(extraChildren)
        : extraChildren.concat(newChildren)

      // 重新赋值给新节点
      newNode[childrenKey] = newNodeChildren
    }

    // 若 onEachAfter 明确地返回 false，则删除该节点
    const afterNode = opts.onEachAfter!(newNode, parentNodes)
    const finalNode = afterNode === false ? null : (afterNode || newNode)

    return finalNode
  })

  // 过滤掉为 null 的节点
  const result = list.filter(it => it != null)

  return result
}

const walkTreeDefaultOptions = {
  ...treeDefaultOptions,
  onEachBefore: () => {},
  onEachAfter: () => {},
  extraChildrenInsertAfter: false,
}

/**
 * 遍历 tree，并执行特定的动作
 * @param nodes 要遍历的 nodes
 * @param options 选项
 */
export function walkTree<T>(nodes: T[], options = {} as WalkTreeOptions<T>) {
  const opts = { ...walkTreeDefaultOptions, ...options }
  return doWalkTree(nodes, opts, [])
}
