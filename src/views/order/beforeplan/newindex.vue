<template>
  <div class="index-page">
    <Tabs v-model="status" type="card" class="tabs">
      <TabPane
        v-for="it in statusList"
        :key="it.value"
        :name="it.value"
        :label="it.name"
      />
    </Tabs>

    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >

      <template slot="depositAmount" slot-scope="{ row: { depositAmount   } }">
        <div class="row-acts">
          {{depositAmount == null ? '-' : formatNumber(depositAmount)}}
        </div>
      </template>
      <template slot="needPayAmount" slot-scope="{ row: { needPayAmount   } }">
        <div class="row-acts">
          {{needPayAmount == null ? '-' : formatNumber(needPayAmount)}}
        </div>
      </template>
      <template slot="action" slot-scope="{ row: { id , status  } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'order-beforeplan-detail', params: { id , status } }"
          >详情</router-link>
          <router-link v-if='status == 2'
            :to="{ name: 'order-beforeplan-detail', params: { id , status } }"
          >一级审核</router-link>
          <router-link v-if='status == 2'
            :to="{ name: 'order-beforeplan-detail', params: { id , status } }"
          >二级审核</router-link>
          <router-link v-if='status == 6 || status == 7'
            :to="{ name: 'order-beforeplan-detail', params: { id , status } }"
          >补单</router-link>
        </div>
      </template>
    </ListPage>

  </div>
</template>

<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import {
  queryList
} from '@/api/beforeplan'
// 广告主公司名称列表
import CompanyList from './files/adscompany.vue'
// 广告片名称列表
import videoList from './files/videoList.vue'

import EditDialog, { Field } from '@/components/editDialog'
import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'
import { formatNumber } from '@/util/validateRules'

// 广告计划状态列表
  const statusList: any = [
    { name: '待支付', value: '4'},
    { name: '草稿', value: '1'},
    { name: '核对中', value: '9'},
    { name: '其他', value: '50'},
  ]
  const defaultPay: any = statusList[0].value

@Component({
  components: {
    ListPage,
    EditDialog,
    // CompanyList,
    // cinemaList,
    // yearMonth,
    // payDlg
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: String, default: defaultPay }) pay!: string

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  addOrUpdateVisible = false


  status = this.pay

  statusList = statusList


  fetch = queryList


  get filters(): Filter[] {
    const firstN = [
      {
        name: 'status',
        defaultValue: this.pay,
      },
      {
        name: 'companyName',
        defaultValue: 0,
        type: CompanyList,
        width: 140,
        placeholder: '广告主公司名称'
      },

      {
        name: 'name',
        defaultValue: '',
        type: 'input',
        width: 140,
        placeholder: '广告计划名称'
      },

      {
        name: 'videoName',
        defaultValue: '',
        type: videoList,
        width: 140,
        placeholder: '广告片名称'
      },

      {
        name: 'dateRange',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '选择时间',
        dealParam(value: string) {
          const [beginDate, endDate] = value ? value.split('-') : [null, null]
          return {
            beginDate,
            endDate
          }
        }
      },

      {
        name: 'status2',
        defaultValue: null,
        type: 'select',
        width: 100,
        placeholder: '广告类型',
        enumKey: 'statusList'
      },

      {
        name: 'status3',
        defaultValue: null,
        type: 'select',
        width: 100,
        placeholder: '支付状态',
        enumKey: 'statusList'
      },

      {
        name: 'applyDate',
        defaultValue: '',
        type: 'date',
        width: 140,
        placeholder: '提交时间'
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

    const two: any = [
      {
        name: 'status',
        defaultValue: null,
        type: 'select',
        width: 100,
        placeholder: '订单状态',
        enumKey: 'statusList'
      }
    ]


    return this.status != '50' ? [...firstN] :
    [...firstN, ...two ]
  }

  enums = [
    // 'invoiceTypeList',
    'statusList',
  ]

  get formatNumber() {
    return formatNumber
  }

  get columns() {
    const firstN: any = [
      { title: '计划id', key: 'id', width: 65 },
      { title: '计划名称', key: 'name' },
      { title: '广告主公司名称', key: 'companyName'},
      { title: '广告片', key: 'videoName', maxWidth: 100 },
      { title: '广告类型', key: 'name' },
      {
        title: '投放周期',
        key: 'beginDate',
        width: 150,
        align: 'center',
        render: (hh: any, { row: { beginDate , endDate} }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const start = String(beginDate).slice(0, 4) + '-' + String(beginDate).slice(4, 6) + '-' + String(beginDate).slice(6, 8)
          const end = String(endDate).slice(0, 4) + '-' + String(endDate).slice(4, 6) + '-' + String(endDate).slice(6, 8)
          return <span> {start} ~ {end}</span>
          /* tslint:enable */
        }
      },
      { title: '接单影院/派单影院', key: 'name' },
      // { title: '预算', slot: 'budgetAmount', width: 100},
      { title: '定金', slot: 'depositAmount', width: 100},
      { title: '应结金额', slot: 'needPayAmount', width: 100},
      { title: '提交时间', key: 'applyTime', editor: 'dateTime', width: 135 },
      { title: '支付状态', key: 'status', width: 100 , editor: 'enum' },
      { title: '状态', key: 'status', width: 100 , editor: 'enum' },
      { title: '操作', slot: 'action', width: 55 }
    ]

     return  [...firstN ] as ColumnExtra[]
  }

  @Watch('status')
  watchstatus(pay: any) {
    this.$router.push({
      name: 'order-beforeplan-newindex',
      params: pay == defaultPay ? {} : { pay }
    })
  }

  @Watch('pay')
  watchPay(pay: any) {
    if (pay == '50') {
      this.listPage.query.status = ''
    } else {
      this.listPage.query.status = pay
    }
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
