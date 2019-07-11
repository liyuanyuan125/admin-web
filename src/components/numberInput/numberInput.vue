<template>
  <LazyInput
    v-model="model"
    class="number-input"
    v-bind="$attrs"
  />
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import LazyInput from '@/components/LazyInput'

@Component({
  components: {
    LazyInput
  }
})
export default class NumberInput extends ViewBase {
  @Prop({ type: Number, default: 0 }) value!: number

  @Prop({ type: Boolean, default: false }) showZero!: boolean

  model = ''

  @Watch('value', { immediate: true })
  watchValue(value: number) {
    this.model = value == 0 && !this.showZero ? '' : String(value)
  }

  @Watch('model')
  watchMode(value: string) {
    const num = parseFloat(value) || 0
    this.$emit('input', num)
  }
}
</script>

<style lang="less" scoped>
</style>
