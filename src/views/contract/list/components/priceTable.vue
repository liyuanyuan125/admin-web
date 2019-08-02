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
import { dot } from '@/util/dealData'
import { devLog } from '@/util/dev'

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

  model: MapType<PriceItem> = {}

  makeModel(priceMap: MapType<PriceItem> = {}) {
    const result = this.enumList.reduce((map, it) => {
      map[it.key] = {
        commonPrice: dot(priceMap, it.key + '.commonPrice') || null,
        trailerPrice: dot(priceMap, it.key + '.trailerPrice') || null
      }
      return map
    }, {} as MapType<PriceItem>)
    return result
  }

  @Watch('enumList', { immediate: true })
  watchEnumList() {
    if (isEmpty(this.model)) {
      this.model = this.makeModel()
      this.$emit('input', this.model)
    }
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: MapType<PriceItem>) {
    !isEqual(this.model, value) && (this.model = this.makeModel(value))
  }

  @Watch('model', { deep: true })
  watchModel(value: MapType<PriceItem>) {
    !isEqual(this.value, value) && this.$emit('input', this.makeModel(value))
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
