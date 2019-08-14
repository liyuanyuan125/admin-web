<template>
  <div class="index-page">
    <TabNav value="purchase" :list="navList"/>

    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      ref="listPage"
    >
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { navList, queryPurchaseList } from './data'
import { alert, toast } from '@/ui/modal'
import { EditDialog, Field } from '@/components/editForm'
import TabNav from '@/components/tabNav'
import { startDayTimestamp, endDayTimestamp } from '@/util/dealData'
import { MapType } from '@/util/types'

const typeMap: MapType = {
  1: 'kol',   // KOL业务
  2: 'before' // 映前广告
}

@Component({
  components: {
    ListPage,
    EditDialog,
    TabNav
  }
})
export default class IndexPage extends ViewBase {
  get listPage() {
    return this.$refs.listPage as ListPage
  }

  fetch = queryPurchaseList

  get filters(): Filter[] {
    return [
      {
        name: 'customerId',
        defaultValue: 0,
        company: true,
        width: 188,
        placeholder: '客户名，输入名称搜索',
      },

      {
        name: 'billNo',
        defaultValue: '',
        input: true,
        width: 138,
        placeholder: '子订单编号/账单标号'
      },

      {
        name: 'invoiceNo',
        defaultValue: '',
        input: true,
        width: 128,
        placeholder: '发票编号'
      },

      {
        name: 'invoiceType',
        defaultValue: 0,
        select: {
          enumKey: 'invoiceTypeList',
        },
        width: 128,
        placeholder: '发票类型'
      },

      {
        name: 'invoiceTime',
        defaultValue: '',
        dateRange: true,
        width: 178,
        placeholder: '发票时间',
        dealParam(value: any) {
          const [start, end] = value.split('-')
          return {
            invoiceStartTime: startDayTimestamp(start),
            invoiceEndTime: endDayTimestamp(end),
          }
        }
      },

      {
        name: 'registrationStartTime',
        defaultValue: '',
        dateRange: true,
        width: 178,
        placeholder: '登记时间',
        dealParam(value: any) {
          const [start, end] = value.split('-')
          return {
            registrationStartTime: startDayTimestamp(start),
            registrationEndTime: endDayTimestamp(end),
          }
        }
      },

      {
        name: 'businessType',
        defaultValue: 0,
        select: {
          enumKey: 'businessTypeList',
        },
        width: 98,
        placeholder: '业务类型'
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

  navList = navList

  get columns() {
    return [
      {
        title: '序号',
        key: 'id',
        width: 70,
        link: ({ item }) => ({
          name: 'finance-invoice-purchase-view',
          params: { ids: item.id }
        })
      },
      { title: '业务类型', key: 'businessType', width: 70, enum: true },
      { title: '单据类型', key: 'billType', width: 70, enum: true },
      { title: '单据编号', key: 'billINoText', minWidth: 100 },
      { title: '发票编号', key: 'invoiceNo', minWidth: 65 },

      { title: '客户编号', key: 'customerId', minWidth: 65 },
      { title: '客户名称', key: 'customerName', minWidth: 65 },
      { title: '发票类型', key: 'invoiceType', width: 100, enum: true },
      { title: '发票内容', key: 'invoiceContent', minWidth: 65, enum: true },
      { title: '发票日期', key: 'invoiceDate', width: 80, date: true },

      { title: '发票金额', key: 'totalTaxFee', minWidth: 65 },
      { title: '快递公司', key: 'expressCompany', minWidth: 65 },
      { title: '快递单号', key: 'expressNo', minWidth: 65 },
    ] as ColumnExtra[]
  }
}
</script>

<style lang="less" scoped>
/deep/ .col-bill-i-no-text span {
  white-space: pre-line;
}
</style>
