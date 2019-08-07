<template>
  <component
    :is="poptip === false ? 'span' : 'poptip'"
    trigger="focus"
    transfer
    class="form-input-number-wrap"
    :popper-class="`edit-form-form-input-number-poptip ${!poptipText ? 'edit-form-empty-poptip' : ''}`"
    :content="poptipText || undefined"
  >
    <span
      class="form-input-number"
      :class="{
        'form-input-number-with-prepend': prepend != '',
        'form-input-number-with-append': append != '',
      }"
    >
      <span class="input-number-prepend" v-if="prepend">
        <slot name="prepend"><i v-html="prepend"></i></slot>
      </span>
      <InputNumber
        v-model="model"
        class="input-number"
        v-bind="$attrs"
        v-on="$listeners"
        ref="input"
      />
      <span class="input-number-append" v-if="append">
        <slot name="append"><i v-html="append"></i></slot>
      </span>
    </span>
  </component>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { triggerValidate } from '@/util/form'
import WithPoptip from './withPoptip'

@Component
export default class FormInputNumber extends Mixins(ViewBase, WithPoptip) {
  @Prop({ type: [Number, String, Object], default: null }) value!: number | string | null

  @Prop({ type: String, default: '' }) prepend!: string

  @Prop({ type: String, default: '' }) append!: string

  model = this.value

  get poptipText() {
    const result = this.getPoptipText(this.model, [0], 'thousands')
    return result
  }

  castValue(value: number | string | null) {
    if (value === '' || value == null) {
      return null
    }
    const { min, max } = this.$refs.input as any
    const num = Math.min(max, Math.max(min, parseFloat(value as string) || 0))
    return num
  }

  @Watch('value')
  watchValue(value: number | string | null) {
    const num = this.castValue(value)
    this.model = num
    triggerValidate(this.$refs.input, num)
  }

  @Watch('model')
  watchMode(value: number | string | null) {
    const num = this.castValue(value)
    this.$emit('input', num)
  }
}
</script>

<style lang="less">
.edit-form-form-input-number-poptip {
  font-family: monospace;
  font-size: 16px;
}
.edit-form-empty-poptip {
  display: none;
}
</style>

<style lang="less" scoped>
.form-input-number-wrap {
  width: 100%;
  /deep/ .ivu-poptip-rel,
  /deep/ .form-input-number {
    width: 100%;
  }
}

.form-input-number {
  display: inline-flex;
  &[size=small] {
    /deep/ .ivu-input-number-handler-wrap {
      width: 18px;
      .ivu-icon {
        right: 3px;
      }
    }
    .input-number-prepend,
    .input-number-append {
      padding: 0 6px;
    }
  }
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
  user-select: none;
  i {
    font-style: normal;
  }
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
