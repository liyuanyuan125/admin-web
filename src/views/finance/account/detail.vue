<template>
  <div>
     <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage">

      <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          @click="editShow()"
        >片商管理</Button>
      </template>

      <template slot="add" slot-scope="{row: {monthRechargeCount, totalRechargeCount}}">
        <div>
          <a>{{monthRechargeCount}}</a> / <a>{{totalRechargeCount}}</a>
        </div>
      </template>

      <template slot="consume" slot-scope="{row: {monthConsumptionCount, totalConsumptionCount}}">
        <div>
          <a>{{monthConsumptionCount}}</a> / <a>{{totalConsumptionCount}}</a>
        </div>
      </template>

      <template slot="refund" slot-scope="{row: {monthRefundCount, totalRefundCount}}">
        <div>
          <a>{{monthRefundCount}}</a> / <a>{{totalRefundCount}}</a>
        </div>
      </template>

      <template slot="deposit" slot-scope="{row: {monthWithdrawalCount, totalWithdrawalCount}}">
        <div>
          <a>{{monthWithdrawalCount}}</a> / <a>{{totalWithdrawalCount}}</a>
        </div>
      </template>

    </ListPage>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from '@/api/balance'

import { one, two, three, four, filterone } from './detail'
import { toMap } from '@/fn/array'
import moment from 'moment'

const makeMap = (list: any[]) => toMap(list, 'typeCode', 'typeName')
@Component({
  components: {
    ListPage
  }
})
export default class Main extends ViewBase {
  fetch = queryList
  filterone = filterone

  get filters() {
    let str = ''
    if (this.$route.params.time == 'month') {
      const beginDate = moment().startOf('month').format('YYYYMMDD')
      const endDate = moment().endOf('month').format('YYYYMMDD')
      str = `${beginDate}-${endDate}`
    }
    return filterone(str)
  }

  enums = [
    'applyTypeList',
    'invoiceContentCodeList',
    'invoiceStatusList',
    'invoiceTypeCodeList',
    'payStatusList',
    'billStatusList'
  ]

  get columns() {
    return one
  }

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  addmoeny(id?: any) {
    this.$router.push({
      name: 'client-producers-edit',
      params: {
        id
      }
    })
  }

  open(row: any) {
    this.$nextTick(() => {
      (this.$refs.account as any).init(row)
    })
  }

  uplist() {
    // this.listPage.refresh()
  }
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