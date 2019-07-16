<template>
  <Input
    v-model="model"
    class="form-input"
    v-bind="$attrs"
  >
    <span slot="prepend" v-if="prepend">{{prepend}}</span>
    <span slot="append" v-if="append">{{append}}</span>
  </Input>
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
export default class FormInput extends ViewBase {
  @Prop({ type: String, default: '' }) value!: string

  @Prop({ type: String, default: '' }) prepend!: string

  @Prop({ type: String, default: '' }) append!: string

  model = this.value

  @Watch('value')
  watchValue(value: string) {
    this.model = value
  }

  @Watch('model')
  watchMode(value: string) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.form-input /deep/ textarea {
  font-size: 12px;
}
</style>
