<template>
  <div>
    <table class="price-table">
      <thead>
        <th>时长起止区间(s)</th>
        <th>时长截止区间(s)</th>
        <th style="width: 90px">折扣比例%</th>
        <th>折后转制费（元）</th>
      </thead>
      <tbody>
        <tr v-for="(it, index) in model" :key="index">
          <td>{{it.begin}}</td>
          <td>{{it.end}}</td>
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
          <td>{{it.discountCost}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { isEqual, cloneDeep } from 'lodash'
import { FormInputNumber } from '@/components/editForm'

export interface KeyTextValue {
  begin: number
  end: number
  discount: number
  discountCost: number
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

  initData: KeyTextValue[] = []

  created() {
    this.initData = cloneDeep(this.value)
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: KeyTextValue[]) {
    !isEqual(this.model, value) && (this.model = value)
  }

  @Watch('model', { deep: true })
  watchModel(value: KeyTextValue[]) {
    if (!isEqual(value, this.initData)) {
      value = value.map((it: any, index: number) => {
        return {
          begin: it.begin,
          end: it.end,
          discount: it.discount,
          discountCost: ( it.discount !== this.initData[index].discount )
          ? it.discount * (this.initData[index].discountCost / 100)
          : this.initData[index].discountCost
        }
      })
    }
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.price-table {
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
    text-align: center;
  }
}
</style>
