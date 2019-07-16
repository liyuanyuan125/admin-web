<template>
  <table class="age-table">
    <thead>
      <th>年龄区间</th>
      <th v-for="it in model" :key="it.key">{{it.text}}</th>
    </thead>
    <tbody>
      <th>粉丝数占比</th>
      <td v-for="it in model" :key="it.key">
        <Input
          v-model="it.value"
          size="small"
          class="inner-input"
          :min="0"
          :max="100"
          number
        >
          <span slot="append">%</span>
        </Input>
      </td>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { isEqual } from 'lodash'

export interface KeyTextValue {
  key: string
  text: string
  value: number
}

@Component
export default class AgeTable extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: KeyTextValue[]

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
  max-width: 880px;
  border-collapse: collapse;
  th, td {
    border: 1px solid #e8e8e8;
    padding: 4px 8px;
    white-space: nowrap;
  }
}

.inner-input {
  display: flex;
  /deep/ input {
    text-align: center;
  }
  /deep/ .ivu-input-group-append {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
  }
}
</style>
