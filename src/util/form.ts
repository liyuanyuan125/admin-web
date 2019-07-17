import Vue from 'vue'
import scrollIntoView from 'scroll-into-view-if-needed'

/**
 * 跳转到 FormItem 错误发生的位置
 * @param box 一般为 form 或 Form 对象
 */
export function scrollToError(box: Element | Vue) {
  const el = (box as Element).querySelector ? box as Element : (box as Vue).$el
  const node = el.querySelector('.ivu-form-item-error')
  node && scrollIntoView(node, {
    behavior: 'smooth',
    block: 'start',
  })
}
