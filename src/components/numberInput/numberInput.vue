<template>
  <LazyInput
    v-model="model"
    class="number-input"
    v-bind="$attrs"
    ref="input"
  >
    <span slot="prepend" v-if="prepend">{{prepend}}</span>
    <span slot="append" v-if="append">{{append}}</span>
  </LazyInput>
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

  @Prop({ type: Number, default: -Infinity }) min!: number

  @Prop({ type: Number, default: Infinity }) max!: number

  @Prop({ type: Boolean, default: false }) showZero!: boolean

  @Prop({ type: String, default: '' }) prepend!: string

  @Prop({ type: String, default: '' }) append!: string

  model = ''

  numberValue(value: number | string) {
    const min = this.min
    const max = this.max
    const num = Math.min(max, Math.max(min, parseFloat(value as string) || 0))
    return num
  }

  updateModel(num: number) {
    this.model = num == 0 && !this.showZero ? '' : String(num)
    // TODO: HACK IT
    const input = this.$refs.input as any
    input && (input.currentValue = this.model)
  }

  @Watch('value', { immediate: true })
  watchValue(value: number) {
    const num = this.numberValue(value)
    this.updateModel(num)
  }

  @Watch('model')
  watchMode(value: string) {
    const num = this.numberValue(value)
    this.$emit('input', num)

    // 若 this.value == num 不会触发 watchValue，此时
    // 如果 value 不等于 num 或等于 0，说明 model 是非法的
    this.value == num && this.updateModel(num)
  }
}
</script>

<style lang="less" scoped>
</style>
