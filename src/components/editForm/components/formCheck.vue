<template>
  <CheckboxGroup
    v-model="model"
    class="form-check"
  >
    <Checkbox
      v-for="it in enumList"
      :key="it.key"
      :label="it.key"
      :disabled="disabled"
      class="form-check-item"
    >{{it.text}}</Checkbox>

    <InputHidden :value="model"/>
  </CheckboxGroup>
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
export default class FormCheck extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: Array<number | string>

  @Prop({ type: Array, default: () => [] }) enumList!: KeyText[]

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  model = this.value

  @Watch('value', { deep: true })
  watchValue(value: Array<number | string>) {
    this.model = value
  }

  @Watch('model', { deep: true })
  watchModel(value: Array<number | string>) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.form-check {
  user-select: none;
}

.form-check-item {
  margin-right: 18px;
}
</style>
