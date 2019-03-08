import Vue, { VNode } from 'vue'
import { hasPerm } from '@/store'
import { DirectiveBinding } from 'vue/types/options'

const authAct = async (not: boolean, el: HTMLElement, binding: DirectiveBinding, vnode: VNode) => {
  // 先隐藏元素，预防元素显示出来
  const oldVisibility = el.style.visibility
  el.style.visibility = 'hidden'

  const perm = String(binding.value).trim()
  // 若 perm 为空，则认为是有权限的
  const has = perm !== '' ? await hasPerm(perm) : true

  // 若 not，则翻转 has
  const status = not ? !has : has

  if (status) {
    // 恢复原有的显示状态
    el.style.visibility = oldVisibility
  } else if (vnode.elm) {
    // 若没有相应的权限，则去除相应元素
    const parentEl = vnode.elm.parentElement
    parentEl && parentEl.removeChild(vnode.elm)
  }
}

// 定义全局权限验证指令，应用在需要相应权限才能看到的元素上
Vue.directive('auth', {
  async inserted(el, binding, vnode) {
    authAct(false, el, binding, vnode)
  }
})

// 上一条指令的「非」指令
Vue.directive('auth-not', {
  async inserted(el, binding, vnode) {
    authAct(true, el, binding, vnode)
  }
})
