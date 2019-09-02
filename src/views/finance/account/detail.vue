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
import { getcompany } from '@/api/balance'
import { one, two, three, four, filterone, filtertwo, filterthree, filterfour } from '@/views/finance/account/index.ts'
import { toMap } from '@/fn/array'
import moment from 'moment'

const makeMap = (list: any[]) => toMap(list, 'typeCode', 'typeName')
@Component({
  components: {
    ListPage
  }
})
export default class Main extends ViewBase {

  get filters() {
    let str = ''
    if (this.$route.params.time == 'month') {
      const beginDate = moment().startOf('month').format('YYYYMMDD')
      const endDate = moment().endOf('month').format('YYYYMMDD')
      str = `${beginDate}-${endDate}`
    }
    const transactionTypes: any = this.$route.params.transactionTypes
    // return filterone(str)
    if (transactionTypes == '1') {
       return filterone(str)
    } else if ( transactionTypes == '2') {
      return filtertwo(str)
    } else if ( transactionTypes == '3') {
      return filterthree(str)
    } else {
      return filterfour(str)
    }
  }

  get columns() {
    const transactionTypes = this.$route.params.transactionTypes
    if (transactionTypes == '1') {
      return one
    } else if ( transactionTypes == '2') {
      return two
    } else if ( transactionTypes == '3' ) {
      return three
    } else {
      return four
    }
  }

  get listPage() {
    return this.$refs.listPage as ListPage
  }
  statusList: any = []

  enums = [
    'statusList',
  ]
  fetch = async (query: any) => {
    const {
      data
    } = await getcompany(query)
    const status: any = []
    const filterstataus = [3, 5, 7]
    filterstataus.forEach((its: any) => {
      status.push(data.statusList.filter((it: any) => {
        return it.key == its
      })[0])
    })
    data.statusList = status
    return {
      ...data
    }
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