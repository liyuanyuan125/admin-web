<template>
  <Input v-model="model" class="input-hidden"/>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { KeyText } from '@/util/types'

// 用于触发 FormItem 的验证
@Component
export default class InputHidden extends ViewBase {
  @Prop({ type: [String, Number, Boolean], default: '' }) value!: string | number | boolean

  model = this.value

  @Watch('value')
  watchValue(value: string | number | boolean) {
    this.model = value
  }

  @Watch('model')
  watchModel(value: string | number | boolean) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.input-hidden {
  display: none;
}
</style>
