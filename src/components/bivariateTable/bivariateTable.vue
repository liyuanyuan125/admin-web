<template>
  <section class="bivariate-table">
    <Table
      :show-header="false"
      :columns="columns"
      :data="tableData"
      size="small"
      stripe
      border
      disabled-hover
    />
  </section>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { MapType } from '@/util/types'

/**
 * 二维表，将字符串二维数组映射为一个表格
 */
@Component
export default class BivariateTable extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: any[][]

  @Prop({ type: Array, default: () => [] }) widths!: number[]

  @Prop({ type: Array, default: () => [] }) aligns!: Array<'center' | 'left' | 'right'>

  get tableData() {
    const list = (this.value || []).map(sub =>
      sub.reduce((ret, text, i) => {
        ret[`col${i}`] = text
        return ret
      }, {} as MapType<any>)
    )
    return list
  }

  get columns() {
    const value = this.value
    if (value.length == 0) {
      return []
    }
    const count = value[0].length
    const widths = this.widths || []
    const aligns = this.aligns || []
    const list = Array(count).fill(1).map((it, i) => ({
      key: `col${i}`,
      width: widths[i] || 'auto',
      align: aligns[i] || 'center',
    }))
    return list
  }
}
</script>

<style lang="less" scoped>
.bivariate-table {
  /deep/ th,
  /deep/ td {
    height: auto;
    line-height: 1.5;
    padding: 6px 0;
  }
  /deep/ .ivu-table-column-left {
    .ivu-table-cell {
      padding-left: 1em;
    }
  }
}
</style>
