<template>
  <div class="index-page">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
    >
      <template slot="acts-2">
        <a
          :href='`${ajaxBase}/bi/export-amount-receivable-payable-months?month=${id}`'
          class="ivu-btn ivu-btn-default"
          download
        >
          <i class='ivu-icon ivu-icon-ios-cloud-download'></i>
          <span>导出</span>
        </a>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <a
            :href='`${ajaxBase}/bi/export-amount-receivable-payables?id=${id}`'
            class="ivu-btn ivu-btn-default ivu-btn-small"
            download
          >
            <span>导出每日明细</span>
          </a>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryReceivePayList } from './data'

@Component({
  components: {
    ListPage
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: Number, required: true }) id!: number

  ajaxBase = VAR.ajaxBaseUrl

  fetch = queryReceivePayList

  get filters(): Filter[] {
    return [
      {
        name: 'month',
        defaultValue: this.id
      },

      {
        name: 'pageIndex',
        defaultValue: 1
      },

      {
        name: 'pageSize',
        defaultValue: 20
      }
    ]
  }

  get columns() {
    return [
      {
        title: '计划ID',
        key: 'planId',
        width: 70,
      },
      {
        title: '计划名称',
        key: 'name',
        width: 160,
      },
      {
        title: '广告片',
        key: 'videoName',
        width: 130,
      },
      {
        title: '广告主公司ID',
        key: 'companyId',
        width: 100,
      },
      {
        title: '广告主公司名称',
        key: 'companyName',
        minWidth: 130,
      },
      {
        title: '资源方公司ID',
        key: 'resourceId',
        width: 100,
      },
      {
        title: '资源方公司名称',
        key: 'resourceName',
        minWidth: 130,
      },
      {
        title: '影城专资码',
        key: 'cinemaNo',
        width: 80,
      },
      {
        title: '影城名称',
        key: 'shortName',
        width: 80,
      },
      {
        title: '订单编号',
        key: 'advertId',
        width: 80,
      },
      {
        title: '曝光场次',
        key: 'exposureSession',
        width: 80,
      },
      {
        title: '曝光人次',
        key: 'exposurePerson',
        width: 80,
      },
      {
        title: '应收金额',
        key: 'amountReceivableFormat',
        width: 80,
      },
      {
        title: '应付金额',
        key: 'amountPayableFormat',
        width: 80,
      },
      {
        title: '应收-应付',
        key: 'amountReceivablePayableFormat',
        width: 80,
      },
      {
        title: '操作',
        slot: 'action',
        width: 120,
      },
    ] as ColumnExtra[]
  }
}
</script>

<style lang="less" scoped>
/deep/ .act-bar ~ .act-bar {
  margin-top: 0 !important;
}
</style>
