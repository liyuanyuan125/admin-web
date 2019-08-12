<template>
  <section class="order-table">
    <Table
      :columns="columns"
      :data="value"
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
import { formatValidDateTime } from '@/util/dealData'

@Component
export default class SaleOrderTable extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: any[]

  @Prop({ type: Array, default: () => [] }) columns!: any[]
}
</script>

<style lang="less" scoped>
.order-table {
  /deep/ .ivu-table-cell {
    padding-left: 4px;
    padding-right: 4px;
    & > span,
    & > div {
      &:empty::before {
        content: '-';
      }
    }
  }
}
</style>
