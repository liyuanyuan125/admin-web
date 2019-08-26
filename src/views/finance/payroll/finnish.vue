<template>
  <div class="index-page">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >

      <template slot="month" slot-scope="{ row: { billMonth } }">
        <div class="row-acts">
          {{format(billMonth)}}
        </div>
      </template>

      <template slot="action" slot-scope="{ row: { id, invoiceStatus, payStatus } }">
        <div class="row-acts">
          <a v-if='invoiceStatus < 2'>发票登记</a>
          <a v-if='payStatus < 2' @click='pay([id])'>发票付款</a>
        </div>
      </template>
    </ListPage>
    <Pay @done='refresh' ref='pay' />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { beforeList, finishlist } from '@/api/payroll'
import { alert, toast } from '@/ui/modal'
import { finishfetch, finishnum, finshcoulm } from './finnish'
import Pay from './paymodel.vue'
import { EditDialog, Field } from '@/components/editForm'
import BatchAudit from '@/components/batchAudit'
import moouth from './mouth.vue'
import remoteselect from './data/index.vue'
import company from './data/company.vue'

@Component({
  components: {
    ListPage,
    EditDialog,
    BatchAudit,
    Pay
  }
})
export default class IndexPage extends ViewBase {

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  get fetch() {
    return finishlist
  }

  get filters() {
    return [
      {
        name: 'cinemaId',
        defaultValue: 0,
        type: remoteselect,
        width: 108,
        placeholder: '影城名称'
      },

      {
        name: 'code',
        defaultValue: '',
        type: 'input',
        width: 88,
        placeholder: '影城专资码'
      },

      {
        name: 'resourceId',
        defaultValue: 0,
        type: company,
        width: 168,
        placeholder: '资源方公司名称'
      },

      {
        name: 'hasSettlementPrice',
        defaultValue: '',
        type: 'input',
        width: 128,
        placeholder: '账单编号',
      },

      {
        name: 'invoiceType',
        defaultValue: 0,
        type: 'select',
        width: 100,
        placeholder: '发票类型',
        enumKey: 'invoiceTypeList'
      },

      {
        name: 'invoiceContent',
        defaultValue: '',
        type: 'select',
        width: 100,
        placeholder: '发票内容',
        enumKey: 'invoiceContentList'
      },

      {
        name: 'status',
        defaultValue: '',
        type: 'select',
        width: 100,
        placeholder: '请款状态',
        enumKey: 'statusList'
      },

      {
        name: 'time',
        defaultValue: '',
        type: moouth,
        width: 200,
        placeholder: '账单月份',
        dealParam(value: string) {
          return {
            yearMonth: value ? new Date(value).getTime() : ''
          }
        }
      },

      {
        name: 'dateRange',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '对账时间',
        dealParam(value: string) {
          const [beginDate, endDate] = value ? value.split('-') : [null, null]
          return {
            finishStartTime	: beginDate,
            finishEndTime: endDate
          }
        }
      },

      {
        name: 'dateRanges',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '请款日期',
        dealParam(value: string) {
          const [beginDate, endDate] = value ? value.split('-') : [null, null]
          return {
            applyStartTime: beginDate,
            applyEndTime: endDate
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

  get enums() {
    return  [
      'statusList',
      'invoiceTypeList',
      'invoiceContentList',
      'invoiceStatusList'
    ]
  }

  get columns() {
    return [
      { title: '账单编号', key: 'billNo', minWidth: 65 },
      { title: '请款单编号', key: 'applyNo', minWidth: 65 },
      { title: '影城名称', key: 'cinemaName', minWidth: 100 },
      { title: '影城专资码', key: 'cinemaCode', minWidth: 60 },
      { title: '资源方名称', key: 'resourceName', minWidth: 60 },
      {
        title: '账单月份',
        key: 'billMonth',
        minWidth: 90,
        slot: 'month'
      },
      { title: '账单金额', key: 'billAmount', minWidth: 90 },
      { title: '可申请付款金额单金额', key: 'availableApplyAmount', minWidth: 130 },
      { title: '申请付款金额', key: 'applyAmount', minWidth: 90 },
      { title: '请款状态', key: 'status', minWidth: 100,  editor: 'enum', enumKey: 'status' },
      { title: '发票状态', key: 'invoiceStatus', minWidth: 60, editor: 'enum', enumKey: 'invoiceStatus' },
      { title: '发票类型', key: 'invoiceType', minWidth: 100,  editor: 'enum', enumKey: 'invoiceType' },
      { title: '发票内容', key: 'invoiceContent', minWidth: 65, editor: 'enum', enumKey: 'invoiceContent'},
      { title: '发票号', key: 'invoiceNo', minWidth: 100 },
      { title: '收款账户名', key: 'receiveAccountName', minWidth: 90 },
      { title: '收款银行', key: 'receiveBank', minWidth: 120 },
      { title: '收款账号', key: 'receiveNo',  minWidth: 120 },
      { title: '对账完成时间', key: 'finishTime', minWidth: 100, editor: 'dateTime' },
      { title: '申请付款时间', key: 'payTime', minWidth: 100, editor: 'dateTime' },
    ]
  }

  selectedIds = [] as number[]

  format(val: any) {
    if (val) {
      const month = `${(val + '').substr(0, 4)} 年 ${(val + '').substr(4)}月`
      return month
    }
    return '-'
  }

  pay(id: any) {
    this.$nextTick(() => {
      (this.$refs.pay as any).init(id)
    })
  }

  refresh() {
    this.listPage.update()
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
