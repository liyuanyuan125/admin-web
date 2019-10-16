<template>
  <div>
    <h3 style="padding: 8px 0">{{title}}</h3>
    <table class="age-table">
      <thead>
        <th>定价等级</th>
        <th>折扣比例（%）</th>
      </thead>
      <tbody>
        <tr v-for="it in model" :key="it.bizGrade">
          <th>{{it.bizGrade}}</th>
          <td>
            <FormInputNumber
              v-model="it.discount"
              size="small"
              :min="0"
              :max="100"
              :disabled="disabled"
              placeholder="百分比"
              class="inner-input"
              append="%"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
export default class BizPricingTable extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: KeyTextValue[]

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  @Prop({ type: String, default: '' }) title!: string

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
