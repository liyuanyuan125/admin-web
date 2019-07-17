<template>
  <RadioGroup
    v-model="model"
    class="form-radio"
  >
    <Radio
      v-for="it in enumList"
      :key="it.key"
      :label="it.key"
      :disabled="disabled"
      class="form-radio-item"
    >{{it.text}}</Radio>

    <InputHidden v-model="model"/>
  </RadioGroup>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { KeyText } from '@/util/types'
import InputHidden from '@/components/inputHidden'

@Component({
  components: {
    InputHidden
  }
})
export default class FormRadio extends ViewBase {
  @Prop({ type: [Number, String], default: '' }) value!: number | string

  @Prop({ type: Array, default: () => [] }) enumList!: KeyText[]

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  model = this.value

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
.form-radio {
  user-select: none;
}

.form-radio-item {
  margin-right: 18px;
}
</style>
