<template>
  <Input :value="json" class="input-hidden"/>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { KeyText } from '@/util/types'

// 用于触发 FormItem 的验证
@Component
export default class InputHidden extends ViewBase {
  @Prop() value!: any

  get json() {
    return JSON.stringify(this.value)
  }
}
</script>

<style lang="less" scoped>
.input-hidden {
  display: none;
}
</style>
