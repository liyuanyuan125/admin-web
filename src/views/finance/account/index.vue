<template>
  <div>
     <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage">

      <template slot="add" slot-scope="{row: {monthRechargeCount, totalRechargeCount, companyId}}">
        <div>
          <a @click="push({
            companyId: companyId,
            time: 'month',
            transactionTypes: 1
          })">{{monthRechargeCount}}</a> / <a @click="push({
            companyId: companyId,
            time: 'all',
            transactionTypes: 1
          })">{{totalRechargeCount}}</a>
        </div>
      </template>

      <template slot="consume" slot-scope="{row: {monthConsumptionCount, totalConsumptionCount, companyId}}">
        <div>
          <a @click="push({
            companyId: companyId,
            time: 'month',
            transactionTypes: 2
          })">{{monthConsumptionCount}}</a> / <a @click="push({
            companyId: companyId,
            time: 'all',
            transactionTypes: 2
          })">{{totalConsumptionCount}}</a>
        </div>
      </template>

      <template slot="refund" slot-scope="{row: {monthRefundCount, totalRefundCount, companyId}}">
        <div>
          <a  @click="push({
            companyId: companyId,
            time: 'month',
            transactionTypes: 3
          })">{{monthRefundCount}}</a> / <a  @click="push({
            companyId: companyId,
            time: 'all',
            transactionTypes: 3
          })">{{totalRefundCount}}</a>
        </div>
      </template>

      <template slot="deposit" slot-scope="{row: {monthWithdrawalCount, totalWithdrawalCount, companyId}}">
        <div>
          <a @click="push({
            companyId: companyId,
            time: 'month',
            transactionTypes: 4
          })">{{monthWithdrawalCount}}</a> / <a @click="push({
            companyId: companyId,
            time: 'all',
            transactionTypes: 4
          })">{{totalWithdrawalCount}}</a>
        </div>
      </template>


      <template slot="operate" slot-scope="{row}">
         <a @click='open(row)'>申请提现</a>
         <a style='margin-left: 10px' @click='addmoeny(row.companyId)'>充值</a>
      </template>
    </ListPage>
    <accountModel ref='account' @done='uplist' />
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from '@/api/balance'
import { toMap } from '@/fn/array'
import accountModel from './model.vue'
import moment from 'moment'

const makeMap = (list: any[]) => toMap(list, 'typeCode', 'typeName')
@Component({
  components: {
    ListPage,
    accountModel
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  get filters() {
    const beginDate = moment().startOf('month').format('YYYYMMDD')
    const endDate = moment().endOf('month').format('YYYYMMDD')
    return [
      {
        name: 'companyName',
        defaultValue: '',
        input: true,
        width: 108,
        placeholder: '公司名称'
      },


      {
        name: 'beginDate',
        defaultValue: beginDate
      },

      {
        name: 'endDate',
        defaultValue: endDate
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

  enums = [
    'applyTypeList',
    'invoiceContentCodeList',
    'invoiceStatusList',
    'invoiceTypeCodeList',
    'payStatusList',
    'billStatusList'
  ]

  columns = [
    { title: '公司ID', key: 'companyId' },
    { title: '公司名称', key: 'companyName' },
    { title: '账户余额', key: 'balance' },
    { title: '可用金额', key: 'availableAmount' },
    { title: '冻结金额', key: 'freezeAmount' },
    { title: '充值次数（本月/累计）', key: 'modifyTime', slot: 'add' },
    { title: '消费次数（本月/累计）', key: 'amount', slot: 'consume' },
    { title: '退款次数（本月/累计）', key: 'status', slot: 'refund'},
    { title: '提现次数（本月/累计）', key: 'approveStatus', slot: 'deposit'},
    { title: '操作', slot: 'operate', minWidth: 90 },
  ]

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  addmoeny(companyId?: any) {
    this.$router.push({
      name: 'finance-account-balance-edit',
      params: {
        companyId
      }
    })
  }

  push(row: any) {
    this.$router.push({
      name: 'finance-account-balance-detail',
      params: {
        ...row
      }
    })
  }

  open(row: any) {
    this.$nextTick(() => {
      (this.$refs.account as any).init(row)
    })
  }

  uplist() {
    this.listPage.update()
  }

  // async editStatus(id: number, status: number) {
  //   const statu = status == 1 ? '停用' : '启用'
  //   const statusType = status == 1 ? 2 : 1
  //   await confirm(`确定要${statu}该项吗？`)
  //   try {
  //     await stop(id, { status: statusType})
  //     this.listPage.update()
  //   } catch (ex) {
  //     setTimeout(() => {
  //       this.handleError(ex)
  //     }, 1000)
  //   }

  // }
}
</script>
<style lang='less' scoped>
.operate-btn {
  span {
    cursor: pointer;
    color: #2d8cf0;
    margin: 4px 6px;
  }
}
</style>