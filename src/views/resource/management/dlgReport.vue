<template>
  <Modal v-model="value.showDlg" title="刊例价报价详情" :width="700" cancel-text="">
    <Table
      :columns="columns"
      :data="list"
      size="small"
      stripe
      :border="false"
      disabled-hover
    />
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cloneDeep } from 'lodash'
import { toMap } from '@/fn/array'
import { centToYuan } from '@/util/filters'

interface Item {
  cpm: number
  discount: number
  trailerDiscount: number
  company: {
    companyName: string
    companyTypeCode: string
  }
}

interface FlatItem {
  cpm: string
  discount: string
  trailerDiscount: string
  companyName: string
  companyTypeName: string
}

export interface CompanyType {
  code: string
  desc: string
}

interface Value {
  showDlg: boolean
  list: Item[]
}

@Component
export default class ComponentMain extends ViewBase {
  @Prop({ type: Object, default: () => {}, required: true }) value!: Value

  @Prop({ type: Array, default: () => {}, required: true }) companyTypes!: CompanyType[]

  inner = {} as Value

  get companyTypeMap() {
    const map = toMap(this.companyTypes, 'code', 'desc')
    return map
  }

  get list(): FlatItem[] {
    const list = (cloneDeep(this.inner.list) || [])
    .sort((a, b) => a.cpm - b.cpm)
    .map(it => {
      const { companyName, companyTypeCode } = it.company
      const companyTypeName = this.companyTypeMap[companyTypeCode] || ''
      return {
        cpm: String(it.cpm),
        discount: `${it.discount}%`,
        trailerDiscount: `${it.trailerDiscount}%`,
        companyName,
        companyTypeName,
      }
    })
    return list
  }

  columns = [
    { title: '公司名', key: 'companyName' },
    { title: '公司类型', key: 'companyTypeName', align: 'center', width: 100 },
    { title: 'CPM', key: 'cpm', align: 'center', width: 100 },
    { title: '折扣', key: 'discount', width: 100 },
    { title: '预告片折扣', key: 'trailerDiscount', width: 100 },
  ]

  @Watch('value', { deep: true })
  watchValue(value: Value) {
    this.inner = value
  }

  @Watch('inner', { deep: true })
  watchInValue(value: Value) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-table-row:first-of-type {
  td:last-of-type {
    position: relative;
    &::after {
      content: '最低';
      position: absolute;
      top: 8px;
      right: 8px;
      color: #fff;
      background-color: #09ca25;
      border-radius: 2px;
      padding: 2px 8px;
    }
  }
}
</style>
