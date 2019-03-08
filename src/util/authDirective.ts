import Vue from 'vue'
import { getUser, hasPerm } from '@/store'

// 定义全局权限验证指令，应用在需要相应权限才能看到的元素上
Vue.directive('auth', {
  async inserted(el, binding, vnode) {
    // 先隐藏元素，预防元素显示出来
    const oldVisibility = el.style.visibility
    el.style.visibility = 'hidden'

    const user = getUser()

    const perm = binding.value as string
    const has = await hasPerm(perm)

    if (has) {
      // 恢复原有的显示状态
      el.style.visibility = oldVisibility
    } else if (vnode.elm) {
      // 若没有相应的权限，则去除相应元素
      const parentEl = vnode.elm.parentElement
      parentEl && parentEl.removeChild(vnode.elm)
    }
  }
})
