<template>
  <div>
     <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage">

      <template slot="year" slot-scope="{row: {year, month}}">
        <span>{{year}}-{{month && String(month).length == 1 ? `0${month}` : month}}</span>
      </template>

      <template slot="operate" slot-scope="{row: { status, id }}">
        <router-link v-if='status == 1' style="margin-right: 8px" :to="{ name: 'finance-balance-withdrawal-status', params: { id, status: 1 } }">审核</router-link>
        <router-link v-if='status == 3' style="margin-right: 8px" :to="{ name: 'finance-balance-withdrawal-status', params: { id, status: 3 } }">汇款</router-link>
        <router-link style="margin-right: 8px" :to="{ name: 'finance-balance-withdrawal-status', params: { id }}">详情</router-link>
      </template>
    </ListPage>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from '@/api/withdrawal'
import { toMap } from '@/fn/array'
import moment from 'moment'
import company from '../payroll/data/company.vue'

const makeMap = (list: any[]) => toMap(list, 'typeCode', 'typeName')
@Component({
  components: {
    ListPage
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  filters: Filter[] = [
    {
      name: 'companyId',
      defaultValue: '',
      type: company,
      width: 108,
      placeholder: '公司名称'
    },
    {
      name: 'billNo',
      defaultValue: '',
      type: 'input',
      width: 200,
      placeholder: '提现申请单'
    },

    {
      name: 'dateRange',
      defaultValue: '',
      type: 'dateRange',
      width: 200,
      placeholder: '提现申请日期区间',
      dealParam(value: string) {
        const [beginDate, endDate] = value ? value.split('-') : [null, null]
        return {
          beginDate: beginDate ? moment(beginDate).valueOf() : '',
          endDate: endDate ? moment(endDate).valueOf() : ''
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

  enums = [
    'withdrawalTypeList',
    'statusList'
  ]

  columns = [
    { title: '序号', key: 'id', minWidth: 65 },
    { title: '公司ID', key: 'companyId', minWidth: 60 },
    { title: '公司名称', key: 'companyName', minWidth: 60 },
    { title: '提现申请单编号', key: 'billNo', minWidth: 60 },
    { title: '提现金额', key: 'amount', minWidth: 100 },
    { title: '提现方式', key: 'withdrawalType', minWidth: 60, editor: 'enum' },
    { title: '提现申请时间', key: 'createTime', minWidth: 100, editor: 'dateTime' },
    { title: '提现单状态', key: 'status', minWidth: 100, editor: 'enum' },
    { title: '操作', slot: 'operate', minWidth: 90 },
  ]

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  editShow(id?: any) {
    this.$router.push({
      name: 'client-producers-edit',
      params: {
        id
      }
    })
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