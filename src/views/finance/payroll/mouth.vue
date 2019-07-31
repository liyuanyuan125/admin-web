<template>
  <DatePicker v-model="value" @change='change' type="month" placeholder="对账时间" style="width: 200px"></DatePicker>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class IndexPage extends ViewBase {
  @Prop() value!: any

  change(value: any) {
    this.$emit('input', value)
  }

}
</script>

<style lang="less" scoped>
</style>
