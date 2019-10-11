<template>
  <div>
     <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      ref="listPage">

      <template slot="year" slot-scope="{row: {year, month}}">
        <span>{{year}}-{{month && String(month).length == 1 ? `0${month}` : month}}</span>
      </template>

      <template slot="operate" slot-scope="{row: {billStatus, id}}">
        <div class="operate-btn">
          <span @click="$router.push({name: 'finance-billmanage-detail', params: {id}})">详情</span><br />
          <span v-if="billStatus == 1"
           @click="$router.push({name: 'finance-billmanage-confirmbill', params: {id}})">运营确定账单</span>

           <span v-if="billStatus == 3"
           @click="$router.push({name: 'finance-billmanage-detail', params: {id, audit: 2}})">运营审核账单</span>
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
import {list} from '@/api/financeBill'
import remoteselect from '../payroll/data/index.vue'
import company from '../payroll/data/company.vue'
import yearMonth from '../payment/files/yearMonth.vue'

@Component({
  components: {
    ListPage
  }
})
export default class Main extends ViewBase {
  fetch = list

  filters: Filter[] = [
    {
      name: 'cinemaId',
      defaultValue: 0,
      component: remoteselect,
      width: 108,
      placeholder: '影城名称'
    },
    {
      name: 'code',
      defaultValue: '',
      input: true,
      width: 100,
      placeholder: '影城专资码'
    },

    {
      name: 'resourceId',
      defaultValue: 0,
      component: company,
      width: 100,
      placeholder: '资源方公司名称'
    },

    {
      name: 'resourceBillNo',
      defaultValue: '',
      input: true,
      width: 100,
      placeholder: '账单编号',
    },
    {
      name: 'billStatus',
      defaultValue: '',
      select: true,
      width: 100,
      placeholder: '账单状态',
    },

    {
      name: 'invoiceStatus',
      defaultValue: 0,
      select: true,
      width: 100,
      placeholder: '发票状态',
      enumKey: 'invoiceStatusList'
    },
    {
      name: 'yearMonth',
      defaultValue: null,
      component: yearMonth,
      width: 108,
      placeholder: '账单月份'
    },
    {
      name: 'payStatus',
      defaultValue: '',
      select: true,
      width: 100,
      placeholder: '付款状态',
      enumKey: 'payStatusList'
    },
    {
      name: 'advertType',
      defaultValue: '',
      select: true,
      width: 100,
      placeholder: '广告片类型',
      enumKey: 'advertTypeCodeList'
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

  columns = [
    { title: '账单编号', key: 'resourceBillNo', minWidth: 65 },
    { title: '影城名称', key: 'cinemaName', minWidth: 100 },
    { title: '影城专资码', key: 'code', minWidth: 60 },
    { title: '资源方名称', key: 'resourceName', minWidth: 60 },
    { title: '合同编号', key: 'contractNo', minWidth: 100 },
    { title: '账单月份', slot: 'year', minWidth: 60 },
    { title: '账单生成时间', key: 'createTime', minWidth: 100, editor: 'dateTime'},
    { title: '曝光场次', key: 'showCount', minWidth: 60 },
    { title: '曝光人次/人次', key: 'personCount', minWidth: 60 },
    { title: '广告片类型', key: 'advertType', minWidth: 100, emum: true},
    { title: '账单金额', key: 'amount', minWidth: 100 },
    { title: '账单状态', key: 'billStatus', minWidth: 60, enum: true},
    { title: '发票状态', key: 'invoiceStatus', minWidth: 60, enum: true},
    { title: '付款状态', key: 'payStatus', minWidth: 60, enum: true},
    { title: '操作', slot: 'operate', minWidth: 90 },
  ]
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