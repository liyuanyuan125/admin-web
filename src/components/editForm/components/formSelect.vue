<template>
  <Select v-model="model" class="form-select">
    <Option
      v-for="it in enumList"
      :key="it.key"
      :value="it.key"
    >{{it.text}}</Option>
  </Select>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { KeyText } from '@/util/types'

@Component
export default class FormSelect extends ViewBase {
  @Prop({ type: [ Number, String ], default: '' }) value!: number | string

  @Prop({ type: Array, default: () => [] }) enumList!: KeyText[]

  model: number | string = this.value

  @Watch('value')
  watchValue(value: number | string) {
    this.model = value
  }

  @Watch('model')
  watchModel(value: number | string) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
</style>
