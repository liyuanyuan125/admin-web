<template>
  <DatePicker v-model="inner" @on-change='change' type="month" placeholder="账单月份" style="width: 100px"></DatePicker>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Months extends ViewBase {
  @Prop({default: ''}) value!: any

  inner: any = this.value

  change(value: any) {
    this.$emit('input', value)
  }

  @Watch('value')
  watchValue(value: any) {
    this.inner = value
  }

  // @Watch('inner')
  // watchInner(value: any) {
  //   this.$emit('input', value)
  // }

}
</script>

<style lang="less" scoped>
</style>
