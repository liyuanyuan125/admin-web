<template>
  <span
    class="form-input-number"
    :class="{
      'form-input-number-with-prepend': prepend != '',
      'form-input-number-with-append': append != '',
    }"
  >
    <span class="input-number-prepend" v-if="prepend">{{prepend}}</span>
    <InputNumber
      v-model="model"
      class="input-number"
      v-bind="$attrs"
      ref="input"
    />
    <span class="input-number-append" v-if="append">{{append}}</span>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { triggerValidate } from '@/util/form'

@Component
export default class FormInputNumber extends ViewBase {
  @Prop({ type: Number, default: 0 }) value!: number

  @Prop({ type: String, default: '' }) prepend!: string

  @Prop({ type: String, default: '' }) append!: string

  model = this.value

  numberValue(value: number | string) {
    const { min, max } = this.$refs.input as any
    const num = Math.min(max, Math.max(min, parseFloat(value as string) || 0))
    return num
  }

  @Watch('value')
  watchValue(value: number) {
    const num = this.numberValue(value)
    this.model = num
    triggerValidate(this.$refs.input, num)
  }

  @Watch('model')
  watchMode(value: number) {
    const num = this.numberValue(value)
    this.$emit('input', num)
  }
}
</script>

<style lang="less" scoped>
.form-input-number {
  display: inline-flex;
}

.input-number-prepend,
.input-number-append {
  display: flex;
  align-items: center;
  padding: 0 8px;
  white-space: nowrap;
  color: #515a6e;
  background-color: #f8f8f9;
  border: 1px solid #dcdee2;
  border-radius: 4px;
}

.form-input-number-with-prepend {
  .input-number {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.form-input-number-with-append {
  .input-number {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.input-number-prepend {
  border-right: 0;
  border-radius: 3px 0 0 3px;
}

.input-number-append {
  border-left: 0;
  border-radius: 0 3px 3px 0;
}
</style>
