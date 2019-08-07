<template>
  <div class="index-page">
    <TabNav value="sale" :list="typeList"/>

    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      ref="listPage"
    >
      <template slot="action" slot-scope="{ row: { id, status } }">
        <div class="row-acts">
          <router-link :to="editRoute('audit', id)" v-if="status == 1">商务审核</router-link>
          <router-link :to="editRoute('new', id)" v-if="status == 3">开票</router-link>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { typeList, querySaleList } from './data'
import { alert, toast } from '@/ui/modal'
import { EditDialog, Field } from '@/components/editForm'
import TabNav from '@/components/tabNav'

// status: 1 待商务审核，2 商务审核不通过，3 待开票，4 已开票

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

  fetch = querySaleList

  get filters(): Filter[] {
    return [
      {
        name: 'companyId',
        defaultValue: 0,
        company: true,
        width: 238,
      },

      {
        name: 'orderNo',
        defaultValue: '',
        input: true,
        width: 188,
        placeholder: '订单编号'
      },

      {
        name: 'invoiceNo',
        defaultValue: '',
        input: true,
        width: 188,
        placeholder: '发票编号'
      },

      {
        name: 'status',
        defaultValue: 0,
        select: {
          enumKey: 'statusList',
        },
        width: 128,
        placeholder: '发票状态'
      },

      {
        name: 'applyTime',
        defaultValue: '',
        dateRange: true,
        width: 178,
        placeholder: '申请时间',
        dealParam(value: any) {
          const [start, end] = value.split('-')
          return {
            applyStartTime: start || null,
            applyEndTime: end || null,
          }
        }
      },

      {
        name: 'billingTime',
        defaultValue: '',
        dateRange: true,
        width: 178,
        placeholder: '开票时间',
        dealParam(value: any) {
          const [start, end] = value.split('-')
          return {
            BillingStartTime: start || null,
            BillingEndTime: end || null,
          }
        }
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

  typeList = typeList

  get columns() {
    return [
      {
        title: '序号',
        key: 'id',
        minWidth: 65,
        link: {
          name: 'finance-invoice-sale-edit',
          params: item => ({ action: 'view', id: item.id })
        }
      },
      { title: '发票金额', key: 'totalTaxFee', minWidth: 65 },
      { title: '发票类型', key: 'invoiceType', width: 100, enum: 'invoiceTypeList' },
      { title: '发票内容', key: 'invoiceContent', minWidth: 65 },
      { title: '单位名称', key: 'name', minWidth: 65 },

      { title: '纳税人识别号', key: 'taxId', minWidth: 80 },
      { title: '公司ID', key: 'companyId', minWidth: 65 },
      { title: '公司名称', key: 'companyName', minWidth: 65 },
      { title: '订单编号', key: 'orderNoText', minWidth: 65 },
      { title: '业务类型', key: 'businessType', minWidth: 65, enum: 'businessTypeList' },

      { title: '申请时间', key: 'applyTime', width: 130, dateTime: true },
      { title: '开票时间', key: 'billingTime', width: 130, dateTime: true },
      { title: '发票编号', key: 'invoiceNo', minWidth: 65 },
      { title: '发票状态', key: 'status', width: 100, enum: 'statusList' },
      { title: '操作', slot: 'action', minWidth: 70 }
    ] as ColumnExtra[]
  }

  editRoute(action: string, id: number) {
    return {
      name: 'finance-invoice-sale-edit',
      params: { action, id }
    }
  }
}
</script>

<style lang="less" scoped>
.button-crawl {
  margin-left: 12px;
}

.price-table {
  margin: 4px 0;
  /deep/ th,
  /deep/ td {
    height: 24px;
    background-color: #fff !important;
  }
}
</style>
