<template>
  <table class="price-table">
    <colgroup>
      <col width="auto">
      <col width="150">
      <col width="150">
    </colgroup>
    <thead>
      <th>分类</th>
      <th>结算价</th>
      <th>结算价有效期</th>
    </thead>
    <tbody>
      <tr v-for="it in model" :key="it.key">
        <td>{{it.text}}</td>
        <td>
          <FormInputNumber
            v-model="it.value"
            size="small"
            :min="0"
            :disabled="disabled"
            placeholder="结算价"
            prepend="&yen;"
            poptip
            class="inner-input"
          />
        </td>
        <td>
          <DatePicker
            v-model="it.date"
            size="small"
            :disabled="disabled"
            placeholder="选择日期"
            class="inner-date"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { isEqual } from 'lodash'
import { FormInputNumber } from '@/components/editForm'

export interface PriceItem {
  key: string
  text: string
  value: number
  date: Date
}

@Component({
  components: {
    FormInputNumber
  }
})
export default class PriceTable extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: PriceItem[]

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  model: PriceItem[] = []

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: PriceItem[]) {
    !isEqual(this.model, value) && (this.model = value)
  }

  @Watch('model', { deep: true })
  watchModel(value: PriceItem[]) {
    !isEqual(this.value, value) && this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.price-table {
  max-width: 880px;
  border-collapse: collapse;
  thead {
    th {
      height: 32px;
      background-color: #f8f8f9;
    }
  }
  th, td {
    border: 1px solid #e8e8e8;
    padding: 4px 8px;
    white-space: nowrap;
  }
}

.inner-input {
  /deep/ .input-number-prepend {
    color: #888;
  }
}
</style>
