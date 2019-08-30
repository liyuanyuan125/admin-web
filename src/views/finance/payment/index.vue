<template>
  <div class="index-page" :key="status">
    <TabNav :value="status == 1 ? 'pend' : 'done'" :list="navList" />

    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage">
      <template slot="billMonth" slot-scope="{row}">
        <span v-if="row.billMonth == null || row.billMonth == 0">-</span>
        <span v-else>{{String(row.billMonth).slice(0, 4) + '-' + String(row.billMonth).slice(4, 6)}}</span>
      </template>
      <template
        slot="billAmount"
        slot-scope="{row}"
      >{{row.billAmount == null ? '-' : formatNumber(row.billAmount)}}</template>
      <template
        slot="availableApplyAmount"
        slot-scope="{row}"
      >{{row.availableApplyAmount == null ? '-' : formatNumber(row.availableApplyAmount)}}</template>
      <template
        slot="applyAmount"
        slot-scope="{row}"
      >{{row.applyAmount == null ? '-' : formatNumber(row.applyAmount)}}</template>
      <template
        slot="actualAmount"
        slot-scope="{row}"
      >{{row.actualAmount == null ? '-' : formatNumber(row.actualAmount)}}</template>
      <template slot="action" slot-scope="{ row }">
        <div class="row-acts">
          <span style="color: #2b85e4;cursor: pointer;" @click="view(row.id , row.applyAmount)">付款</span>
        </div>
      </template>
    </ListPage>

    <payDlg ref="addOrUpdate" v-if="addOrUpdateVisible" @done="done" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from './data'
// 资源方公司列表
import CompanyList from './files/company.vue'
// 影院列表
import cinemaList from '@/views/order/supervision/cinemaList.vue'
// 年月筛选列表
import yearMonth from './files/yearMonth.vue'
// 付款信息
import payDlg from './payDlg.vue'

import EditDialog, { Field } from '@/components/editDialog'
import { formatNumber } from '@/util/validateRules'

import TabNav from '@/components/tabNav'

@Component({
  components: {
    ListPage,
    EditDialog,
    CompanyList,
    cinemaList,
    yearMonth,
    payDlg,
    TabNav
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: [String, Number], default: 1 }) status!: string

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  addOrUpdateVisible = false

  navList = [
    {
      name: 'pend',
      label: '待付款',
      route: {
        name: 'finance-payment'
      }
    },
    {
      name: 'done',
      label: '已付款',
      route: {
        name: 'finance-payment',
        params: { status: 2 }
      }
    }
  ]

  // status = this.pay

  // statusList = statusList

  fetch = queryList

  get filters(): Filter[] {
    const firstN = [
      {
        name: 'status',
        defaultValue: this.status
      },
      {
        name: 'billNo',
        defaultValue: '',
        type: 'input',
        width: 168,
        placeholder: '对账单编号'
      },

      {
        name: 'no',
        defaultValue: '',
        type: 'input',
        width: 168,
        placeholder: '付款单编号'
      },

      {
        name: 'applyNo',
        defaultValue: '',
        type: 'input',
        width: 168,
        placeholder: '请款单编号'
      }
    ]

    const two: any = [
      {
        name: 'cinemaId',
        defaultValue: 0,
        type: cinemaList,
        width: 168,
        placeholder: '影城名称'
      },

      {
        name: 'cinemaCode',
        defaultValue: '',
        type: 'input',
        width: 168,
        placeholder: '影城专资码'
      },

      {
        name: 'resourceId',
        defaultValue: 0,
        type: CompanyList,
        width: 108,
        placeholder: '资源方公司名称'
      },

      {
        name: 'invoiceType',
        defaultValue: 0,
        type: 'select',
        width: 108,
        placeholder: '发票类型'
      },

      {
        name: 'invoiceContent',
        defaultValue: 0,
        type: 'select',
        width: 108,
        placeholder: '发票内容'
      },

      {
        name: 'billMonth',
        defaultValue: null,
        type: yearMonth,
        width: 108,
        placeholder: '账单月份'
      },

      {
        name: 'dateRange1',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '对账完成时间',
        dealParam(value: string) {
          const [finishStartTime, finishEndTime] = value
            ? value.split('-')
            : [null, null]
          return {
            finishStartTime: finishStartTime
              ? Number(
                  new Date(
                    String(finishStartTime).slice(0, 4) +
                      '-' +
                      String(finishStartTime).slice(4, 6) +
                      '-' +
                      String(finishStartTime).slice(6, 8)
                  ).getTime() -
                    8 * 60 * 60 * 1000
                )
              : null,
            finishEndTime: finishEndTime
              ? Number(
                  new Date(
                    String(finishEndTime).slice(0, 4) +
                      '-' +
                      String(finishEndTime).slice(4, 6) +
                      '-' +
                      String(finishEndTime).slice(6, 8)
                  ).getTime() +
                    (16 * 60 * 60 * 1000 - 1)
                )
              : null
          }
        }
      },

      {
        name: 'dateRange2',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '请款时间',
        dealParam(value: string) {
          const [applyStartTime, applyEndTime] = value ? value.split('-') : [null, null]
          return {
            applyStartTime: applyStartTime
              ? Number(
                  new Date(
                    String(applyStartTime).slice(0, 4) +
                      '-' +
                      String(applyStartTime).slice(4, 6) +
                      '-' +
                      String(applyStartTime).slice(6, 8)
                  ).getTime() -
                    8 * 60 * 60 * 1000
                )
              : null,
            applyEndTime: applyEndTime
              ? Number(
                  new Date(
                    String(applyEndTime).slice(0, 4) +
                      '-' +
                      String(applyEndTime).slice(4, 6) +
                      '-' +
                      String(applyEndTime).slice(6, 8)
                  ).getTime() +
                    (16 * 60 * 60 * 1000 - 1)
                )
              : null
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

    const threeID: any = [
      {
        name: 'dateRange3',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '付款完成时间',
        dealParam(value: string) {
          const [payStartTime, payEndTime] = value ? value.split('-') : [null, null]
          return {
            payStartTime: payStartTime
              ? Number(
                  new Date(
                    String(payStartTime).slice(0, 4) +
                      '-' +
                      String(payStartTime).slice(4, 6) +
                      '-' +
                      String(payStartTime).slice(6, 8)
                  ).getTime() -
                    8 * 60 * 60 * 1000
                )
              : null,
            payEndTime: payEndTime
              ? Number(
                  new Date(
                    String(payEndTime).slice(0, 4) +
                      '-' +
                      String(payEndTime).slice(4, 6) +
                      '-' +
                      String(payEndTime).slice(6, 8)
                  ).getTime() +
                    (16 * 60 * 60 * 1000 - 1)
                )
              : null
          }
        }
      }
    ]

    return this.status == '1' ? [...firstN, ...two] : [...firstN, ...two, ...threeID]
  }

  enums = ['invoiceTypeList', 'invoiceContentList', 'invoiceStatusList']

  get formatNumber() {
    return formatNumber
  }

  get columns() {
    const firstN: any = [
      { title: '付款单编号', key: 'no', width: 60 },
      { title: '请款单编号', key: 'applyNo', width: 60 },
      { title: '对账单编号', key: 'billNo', width: 60 }
    ]

    const firstID: any = [
      { title: '付款单ID', key: 'id', width: 60 },
      { title: '请款单ID', key: 'applyId', width: 60 },
      { title: '对账单ID', key: 'billId', width: 60 }
    ]

    const two: any = [
      { title: '影城名称', key: 'cinemaName', minWidth: 65 },
      { title: '影城专资编码', key: 'cinemaCode', width: 65 },
      { title: '资源方名称', key: 'resourceName', width: 60 },
      { title: '账单月份', slot: 'billMonth', width: 60 },
      { title: '账单金额', slot: 'billAmount', width: 60 },
      { title: '可申请付款金额', slot: 'availableApplyAmount', width: 60 },
      { title: '请款金额', slot: 'applyAmount', width: 60 }
    ]
    const overmoney: any = [{ title: '付款金额', slot: 'actualAmount', width: 60 }]
    const overlist: any = [
      { title: '发票状态', key: 'invoiceStatus', width: 65, editor: 'enum' },
      { title: '发票类型', key: 'invoiceType', width: 65, editor: 'enum' },
      { title: '发票内容', key: 'invoiceContent', width: 65, editor: 'enum' },
      { title: '发票号', key: 'invoiceNo', width: 65 },
      { title: '收款账户名', key: 'receiveAccountName', width: 65 },
      { title: '收款银行', key: 'receiveBank', width: 65 },
      { title: '对账完成时间', key: 'finishTime', width: 75, editor: 'dateTime' }
    ]

    const threeN = [
      { title: '请款时间', key: 'applyTime', width: 75, editor: 'dateTime' },
      { title: '操作', slot: 'action', width: 65 }
    ]

    const threeID = [
      { title: '申请付款时间', key: 'applyTime', width: 75, editor: 'dateTime' },
      { title: '付款完成时间', key: 'payTime', width: 75, editor: 'dateTime' }
    ]

    return this.status == '2'
      ? [...firstN, ...two, ...overmoney, ...overlist, ...threeID]
      : ([...firstN, ...two, ...overlist, ...threeN] as ColumnExtra[])
  }

  // mounted() {
  //   this.pay = this.statusList[0].value
  // }

  done() {
    this.refresh()
  }

  refresh() {
    this.listPage.update()
  }

  // 新增
  view(id: number, applyAmount: any) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id, applyAmount)
    })
  }

}
</script>

<style lang="less" scoped>
.settlement-price-list {
  text-align: left;
}

.price-table {
  margin: 4px 0;
  /deep/ th,
  /deep/ td {
    height: 24px;
    background-color: #fff !important;
  }
}
/deep/ .ivu-input {
  margin-bottom: 15px;
}
/deep/ .ivu-select {
  margin-bottom: 15px;
}
/deep/ .ivu-btn {
  margin-bottom: 15px;
}
/deep/ .ivu-page .ivu-select {
  margin-bottom: 0;
}
</style>
