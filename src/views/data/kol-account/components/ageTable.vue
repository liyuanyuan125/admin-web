<template>
  <table class="age-table">
    <thead>
      <th>年龄区间</th>
      <th v-for="it in model" :key="it.key">{{it.text}}</th>
    </thead>
    <tbody>
      <th>粉丝数占比</th>
      <td v-for="it in model" :key="it.key">
        <FormInputNumber
          v-model="it.value"
          size="small"
          :min="0"
          :max="100"
          :disabled="disabled"
          class="inner-input"
          append="%"
        />
      </td>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { isEqual } from 'lodash'
import { FormInputNumber } from '@/components/editForm'

export interface KeyTextValue {
  key: string
  text: string
  value: number
}

@Component({
  components: {
    FormInputNumber
  }
})
export default class AgeTable extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: KeyTextValue[]

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  model: KeyTextValue[] = []

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: KeyTextValue[]) {
    !isEqual(this.model, value) && (this.model = value)
  }

  @Watch('model', { deep: true })
  watchModel(value: KeyTextValue[]) {
    !isEqual(this.value, value) && this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.age-table {
  max-width: 900px;
  border-collapse: collapse;
  thead {
    th {
      height: 32px;
      background-color: #f8f8f9;
    }
  }
  th, td {
    border: 1px solid #e8e8e8;
    padding: 4px;
    white-space: nowrap;
  }
}
</style>
