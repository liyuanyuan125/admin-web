<template>
  <i-input type="textarea" ref="ui" :disabled='disabled' :rows="4" :placeholder="placeholder" v-model="inner"></i-input>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class RemarkTextarea extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: String, default: '' }) value!: string

  /**
   * 只读
   */
  @Prop({ type: Boolean, default: false }) disabled!: boolean

  /**
   * 提示文字
   */
  @Prop({ type: String, default: '输入文字...' }) placeholder!: string


  inner: string = this.value

  list: any[] = []

  @Watch('value')
  watchValue(value: string) {
    this.inner = value
  }

  @Watch('inner')
  watchInner(value: string) {
    this.$emit('input', value)
  }
}
</script>
<style lang="less" scoped>
</style>
