/**
 * iview 的 Input 组件不支持 v-model.lazy 行为，这里 subclass 该组件，添加 lazy 行为
 * TODO: 只是临时方案，正确的方式，应该是给 iview 提交代码，支持 v-model.lazy 行为
 */
import { Input } from 'iview'

export default {
  extends: Input,

  model: {
    // 重置 model 的触发事件，不能与 clearable 一起使用，因为 Input 组件
    // 的 clearable handler 没有触发 on-input-change 等事件，无法区分
    event: 'model-value-change'
  },

  created() {
    const self = this as any
    self.$on('on-input-change', (ev: any) => {
      const value = ev.target.value
      self.$emit('model-value-change', value)
    })
  }
}
