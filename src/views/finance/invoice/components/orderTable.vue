<template>
  <section class="order-table">
    <Table
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
import { formatValidDateTime } from '@/util/dealData'

@Component
export default class OrderTable extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: any[]

  get tableData() {
    const list = (this.value || []).map(it => ({
      ...it,
      createTimeText: formatValidDateTime(it.createTime)
    }))
    return list
  }

  get columns() {
    return [
      { title: '订单编号', key: 'orderNo', width: 100, align: 'center' },
      { title: '订单名称', key: 'projectName', minWidth: 120, align: 'center' },
      { title: '客户ID', key: 'companyId', width: 80, align: 'center' },
      { title: '客户名称', key: 'companyName', width: 150, align: 'center' },
      { title: '下单时间', key: 'createTimeText', width: 130, align: 'center' },
      { title: '订单金额', key: 'confirmFee', width: 90, align: 'center' },
      { title: '支付首款金额', key: 'advanceFee', width: 90, align: 'center' },
      { title: '支付尾款金额', key: 'restFee', width: 90, align: 'center' },
      { title: '退款金额', key: 'refundFee', width: 90, align: 'center' },
      { title: '订单状态', key: 'orderStatusText', width: 90, align: 'center' },
    ]
  }
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
