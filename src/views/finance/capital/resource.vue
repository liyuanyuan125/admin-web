<template>
  <div class="page">
    <div class="act-bar flex-box">
      <Form class="form flex-1" :label-width="0" @submit.prevent="search" inline>
        <LazyInput v-model="query.companyName" placeholder="公司名称" class="input input-id"/>
          <DatePicker @on-change="dateChange" @on-clear="formatTime" type="daterange"
            v-model="showTime" placement="bottom-start" placeholder="统计范围"
            class="input" style="width:200px"></DatePicker>
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </Form>
    </div>

    <Table :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table">
      <template slot="freezeAmount" slot-scope="{row}" >
        <div v-auth="'finance.resource:withdrawals-list'">
          <router-link :to="{name: 'finance-capital-withdraw', params: {companyId: row.companyId, title: row.companyName}, query: { beginDate: row.beginDateGetTime, endDate: row.endDateGetTime }}">
          <span>{{row.monthWithdrawalCount}}</span>/</router-link>
          <router-link :to="{name: 'finance-capital-withdraw', params: {companyId: row.companyId, title: row.companyName}, query: { beginDate: query.beginDate, endDate: query.endDate }}">
          <span>{{row.totalWithdrawalCount}}</span>
          </router-link>
        </div>
        <div v-auth-not="'finance.resource:withdrawals-list'">
          <span>{{row.monthWithdrawalCount}}</span> / <span>{{row.totalWithdrawalCount}}</span>
        </div>
      </template>
      <template slot="availableAmount" slot-scope="{row}" >
        <div v-auth="'finance.resource:settlements-list'">
          <router-link :to="{name: 'finance-capital-consume', params: {companyId: row.companyId, title: row.companyName}, query: { beginDate: row.beginDateGetTime, endDate: row.endDateGetTime }}">
          <span>{{row.monthSettlementCount}}</span>/</router-link>
          <router-link :to="{name: 'finance-capital-consume', params: {companyId: row.companyId, title: row.companyName}, query: { beginDate: query.beginDate, endDate: query.endDate }}">
          <span>{{row.totalSettlementCount}}</span>
          </router-link>
        </div>
        <div v-auth-not="'finance.resource:settlements-list'">
          <span>{{row.monthSettlementCount}}</span> / <span>{{row.totalSettlementCount}}</span>
        </div>
      </template>
      <template slot="action" slot-scope="{row}" >
        <router-link v-auth="'finance.resource:withdrawals'" :to="{name: 'finance-capital-withdrawalBill', params: { id: row.companyId, show: 'show' }}">添加提现账单</router-link>
      </template>
      <template slot="action" slot-scope="{row}" >
        <router-link v-auth="'finance.resource:withdrawals'" :to="{name: 'finance-capital-withdrawalBill', params: { id: row.companyId, show: 'show' }}">添加提现账单</router-link>
      </template>
    </Table>

    <div class="page-wrap" v-if="total > 0">
      <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { resqueryList } from '@/api/advertiser'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { formatCurrency } from '@/fn/string'
import {confirm , warning , success, toast } from '@/ui/modal'

const years = new Date().getFullYear()
const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}

@Component
// export default class Main extends ViewBase {
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    companyName: '',
    pageIndex: 1,
    pageSize: 20,
    beginDate: new Date(`${years}/1/1`).getTime(),
    endDate: new Date(`${years + 1}/1/1`).getTime() - 1
  }

  showTime: any = []
  query: any = {}
  addOrUpdateVisible = false
  changeVisible = false
  examine = false

  loading = false
  list = []
  total = 0
  oldQuery: any = {}
  typeList = []

  get columns() {
    return [
      { title: '公司ID', key: 'companyId', align: 'center', width: 80 },
      { title: '公司名称', key: 'companyName', align: 'center' },
      { title: '账户余额（元）', key: 'balance', align: 'center',
        render: (hh: any, { row: { balance } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const html = formatCurrency(balance)
          return <span class='datetime' v-html={html}></span>
          /* tslint:enable */
        }
      },
      {
        title: '',
        slot: 'availableAmount',
        align: 'center',
        /* tslint:disable */
        renderHeader: (hh: any) => {
          const h = jsxReactToVue(hh)
          return <span class='table-money'>结算次数<br/>（本月/累计）</span>
        }
        /* tslint:enable */
      },
      {
        title: '',
        slot: 'freezeAmount',
        align: 'center',
        /* tslint:disable */
        renderHeader: (hh: any) => {
          const h = jsxReactToVue(hh)
          return <span class='table-money'>提现次数<br/>（本月/累计）</span>
        }
        /* tslint:enable */
      },
      {
        title: '进账明细',
        key: 'statusText',
        align: 'center',
        render: (hh: any, { row: { monthRechargeCount, totalRechargeCount, companyId } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <span></span>
          /* tslint:enable */
        }
      },
      {
        title: '操作',
        slot: 'action',
        align: 'center'
      }
    ]
  }

  get tableData() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const beginDateGetTime = new Date(`${year}/${month}/1`).getTime()
    const endDateGetTime = new Date(`${year}/${month + 1}/1`).getTime() - 1
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        year,
        month,
        beginDateGetTime,
        endDateGetTime
      }
    })
    return list
  }

  created() {
    if ( this.showTime.length < 2 ) {
      this.showTime = [new Date(`${years}/1/1`), new Date(`${years}/12/31`)]
    }
  }

  init() {
    this.updateQueryByParam()
    !!this.query.beginDate ? this.$set(this.showTime, 0, new Date(moment(this.query.beginDate).format(timeFormat)))
     : ''
    !!this.query.endDate ? this.$set(this.showTime, 1,  new Date(moment(this.query.endDate).format(timeFormat)))
    : ''
  }

  mounted() {
    this.init()
  }

  activated() {
    this.init()
  }

  formatTime() {
    this.showTime = [new Date(`${years}/1/1`), new Date(`${years}/12/31`)]
  }

  dateChange(data: any) {
     // 获取时间戳
     !!data[0] ? (this.query.beginDate = new Date(data[0]).getTime() - 28800000) : this.query.beginDate = 0
     !!data[1] ? (this.query.endDate = new Date(data[1]).getTime() + 57599999) : this.query.endDate = 0
  }

  search() {
    this.query.pageIndex = 1
  }

  reloadSearch() {
    this.doSearch()
  }

  reset() {
    this.resetQuery()
    this.showTime = [new Date(`${years}/1/1`), new Date(`${years}/12/31`)]
  }

  async doSearch() {
    if (this.loading) {
      return
    }
    this.oldQuery = { ...this.query }
    this.updateUrl()
    this.loading = true
    const query: any = {}
    for (const [key, value] of Object.entries(this.oldQuery)) {
      if (key != 'beginDate' && value != 0) {
        query[key] = value
      }
      if (key != 'endDate' && value != 0) {
        query[key] = value
      }
    }
    try {
      const { data: {
        items: list,
        totalCount: total,
      } } = await resqueryList(query)
      this.list = list
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

   // 新增
  edit(id: number, row: any) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      (this.$refs.addOrUpdate as any).init(id)
    })
  }

  dlgEditDone() {
    this.doSearch()
  }

  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.doSearch()
  }
}
</script>

<style lang="less" scoped>
.form {
  .input,
  /deep/ .ivu-select {
    width: 180px;
    margin-left: 8px;
    margin-right: 8px;
    &:first-child {
      margin-left: 0;
    }
  }
  .ivu-form-item {
    margin-bottom: 12px;
  }
  .input-corp-id {
    width: 80px;
  }
}

.btn-search,
.btn-reset {
  margin-left: 8px;
}

.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}

.info {
  width: 35%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  top: 20%;
  left: 20%;
  font-size: 14px;
  z-index: 10;
}
.info-ver {
  width: 100%;
  height: 43px;
  line-height: 43px;
  padding-left: 3%;
  border-bottom: 1px solid #ccc;
}
.info-ver .info-Icon {
  float: right;
  margin-right: 3%;
  font-weight: bold;
  margin-top: 10px;
}
.info-type {
  padding: 17px;
}
.info-type-t {
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.info-type-t div {
  display: inline-block;
  width: 50%;
}
.info-type-t div span {
  margin-left: 10%;
}
.info-type-t .ivu-radio-group {
  margin-left: 5%;
}
.info-inp {
  margin-left: 5%;
}

.table {
  margin-top: 10px;
  /deep/ .status-2,
  /deep/ .aptitude-status-3 {
    color: #ed4014;
  }
  /deep/ .aptitude-status-2 {
    color: #19be6b;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
  /deep/ .table-money {
    display: inline-block;
    padding-top: 4px;
    height: 46px;
  }
}
</style>
