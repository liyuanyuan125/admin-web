import Vue from 'vue'
import documentOffset from 'document-offset'

export interface ScrollOptions {
  offsetTop?: number
  offsetLeft?: number
}

/**
 * 跳转到 FormItem 错误发生的位置
 * @param box 一般为 form 或 Form 对象
 * @param options 选项
 */
export function scrollToError(
  box: Element | Vue,
  {
    offsetTop = 0,
    offsetLeft = 0
  } = {} as ScrollOptions
) {
  const el = (box as Element).querySelector ? box as Element : (box as Vue).$el
  const node = el.querySelector('.ivu-form-item-error')
  if (node) {
    const html = document.documentElement
    const { top, left } = documentOffset(node)
    html.scroll({
      top: top + offsetTop,
      left: left + offsetLeft,
      behavior: 'smooth'
    })
  }
}

/**
 * 触发 form item 验证
 * @param ui iview 组件引用
 * @param value 值
 */
export function triggerValidate(ui: any, value: any) {
  ui && ui.dispatch && ui.dispatch('FormItem', 'on-form-change', value)
}
