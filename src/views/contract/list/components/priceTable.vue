<template>
  <table class="price-table">
    <colgroup>
      <col width="auto">
      <col width="150">
      <col width="150">
    </colgroup>
    <thead>
      <th>城市等级</th>
      <th>单人次结算价格（元/人次）</th>
      <th>预告片单人次结算价格（元/人次）</th>
    </thead>
    <tbody>
      <tr v-for="it in enumList" :key="it.key">
        <td>{{it.text}}</td>
        <td>
          <FormInputNumber
            v-model="model[it.key].commonPrice"
            size="small"
            :min="0"
            :disabled="disabled"
            placeholder="价格"
            prepend="&yen;"
            class="inner-input"
          />
        </td>
        <td>
          <FormInputNumber
            v-model="model[it.key].trailerPrice"
            size="small"
            :min="0"
            :disabled="disabled"
            placeholder="价格"
            prepend="&yen;"
            class="inner-input"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { isEqual, isEmpty } from 'lodash'
import { FormInputNumber } from '@/components/editForm'
import { MapType, KeyText } from '@/util/types'

export interface PriceItem {
  /** 单人次结算价格（元/人次） */
  commonPrice: number
  /** 预告片单人次结算价格（元/人次） */
  trailerPrice: number
}

@Component({
  components: {
    FormInputNumber
  }
})
export default class PriceTable extends ViewBase {
  @Prop({ type: Object, default: () => ({}) }) value!: MapType<PriceItem>

  @Prop({ type: Array, default: () => [] }) enumList!: KeyText[]

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  model: Array<KeyText & PriceItem> = []

  @Watch('enumList', { immediate: true })
  watchEnumList() {
    if (isEmpty(this.model)) {
      this.model = this.enumList.reduce((map, it) => {
        map[it.key] = { commonPrice: 0, trailerPrice: 0 }
        return map
      }, {} as MapType<PriceItem>)
    }
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: MapType<PriceItem>) {
    !isEqual(this.model, value) && (this.model = value)
  }

  @Watch('model', { deep: true })
  watchModel(value: MapType<PriceItem>) {
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
