<template>
  <component
    :is="poptip === false ? 'span' : 'poptip'"
    trigger="focus"
    transfer
    class="form-input-wrap"
    :popper-class="`edit-form-form-input-poptip ${!poptipText ? 'edit-form-empty-poptip' : ''}`"
    :content="poptipText || undefined"
  >
    <Input
      v-model="model"
      class="form-input"
      v-bind="$attrs"
      ref="input"
    >
      <span slot="prepend" v-if="prepend">{{prepend}}</span>
      <span slot="append" v-if="append">{{append}}</span>
    </Input>
  </component>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { triggerValidate } from '@/util/form'
import WithPoptip from './withPoptip'

@Component
export default class FormInput extends Mixins(ViewBase, WithPoptip) {
  @Prop({ type: String, default: '' }) value!: string

  @Prop({ type: String, default: '' }) prepend!: string

  @Prop({ type: String, default: '' }) append!: string

  model = this.value

  get poptipText() {
    const result = this.getPoptipText(this.model, [''])
    return result
  }

  @Watch('value')
  watchValue(value: string) {
    this.model = value
    triggerValidate(this.$refs.input, value)
  }

  @Watch('model')
  watchMode(value: string) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less">
.edit-form-form-input-poptip {
  font-family: monospace;
  font-size: 16px;
}
.edit-form-empty-poptip {
  display: none;
}
</style>

<style lang="less" scoped>
.form-input-wrap {
  width: 100%;
  /deep/ .ivu-poptip-rel,
  /deep/ .form-input {
    width: 100%;
  }
}

.form-input /deep/ textarea {
  font-size: 12px;
}
</style>
