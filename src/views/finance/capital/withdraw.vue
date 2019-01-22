<template>
  <div class="page">
    <div class="act-bar flex-box">
      <Form class="form" :label-width="0" @submit.prevent="search" inline>
        <DatePicker @on-change="dateChange" @on-clear="formatTime" type="daterange" v-model="showTime"
          placement="bottom-start" placeholder="统计范围" class="input" style="width:200px"></DatePicker>
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </Form>
      <div v-if="totals" class="title">
        <b style="margin-left:0px">所属公司:</b>{{$route.params.title}} <span style="margin-left:8px"></span>
        <b>查询结果</b><b>共计金额</b>：{{totals.amount}}元   <b>次数共计</b>：{{total}}次
      </div>
    </div>
    <Table :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table"></Table>

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
import { resIdqueryList } from '@/api/advertiser'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { formatCurrency } from '@/fn/string'
import {confirm , warning , success, toast } from '@/ui/modal'

const years = new Date().getFullYear()
const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}

@Component
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    companyId: '',
    pageIndex: 1,
    pageSize: 20,
    beginDate: new Date(`${years}/1/1`).getTime(),
    endDate: new Date(`${years + 1}/1/1`).getTime() - 1,
    statistics: true
  }

  showTime: any = []
  query: any = {}

  addOrUpdateVisible = false
  changeVisible = false
  totals: any = null
  examine = false
  // query = { ...defQuery }
  altogetherAmount: any = ''
  loading = false
  list = []
  total = 0
  oldQuery: any = {}
  typeList = []

  // company = []

  company2 = []

  columns = [
    { title: '提现序号', key: 'id', align: 'center', width: 80 },
    { title: '提现时间', key: 'withdrawalTime', align: 'center',
      render: (hh: any, { row: { withdrawalTime }, row }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const html = withdrawalTime ? moment(withdrawalTime).format(timeFormat) : ''
          return <span class='datetime' v-html={html}></span>
          /* tslint:enable */
        }
    },
    { title: '项目', key: 'typeListText', align: 'center',
      render: (hh: any, { row: { typeName } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = typeName
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '提现金额',
      key: 'amount',
      align: 'center',
      render: (hh: any, { row: { amount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = amount ? formatCurrency(amount) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '提现前可用余额',
      key: 'freezeAmount',
      align: 'center',
      render: (hh: any, { row: { beforeWithdrawalAmount }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = !!beforeWithdrawalAmount ? formatCurrency(beforeWithdrawalAmount) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '提现后可用余额',
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { afterWithdrawalAmount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = !!afterWithdrawalAmount ? formatCurrency(afterWithdrawalAmount) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作员',
      key: 'createName',
      align: 'center'
    },
    {
      title: '备注',
      key: 'remark',
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <router-link to={{name: 'finance-capital-withdrawDetail', params: {id}}}>详情</router-link>
        /* tslint:enable */
      }
    }
  ]
  get cachedMap() {
    return {
      typeList: this.typeList,
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        typeListText: (cachedMap.typeList[it.type] as any)[it.type]
      }
    })
    return list
  }

  mounted() {
    this.updateQueryByParam()
    !!this.query.beginDate ? this.$set(this.showTime, 0, moment(this.query.beginDate).format(timeFormat)) :  ''
    !!this.query.endDate ? this.$set(this.showTime, 1, moment(this.query.endDate).format(timeFormat)) :  ''
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

  reset() {
    this.resetQuery()
    this.showTime = [new Date(`${years}/1/1`), new Date(`${years}/12/31`)]
  }

  async doSearch() {
    if (this.loading) {
      return
    }
    this.query.companyId = this.$route.params.companyId
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
        altogetherAmount: altogetherAmount,
        items: list,
        totalCount: total,
        total: totals,
        typeList: typeList,
      } } = await resIdqueryList(query)
      this.list = list
      this.total = total
      this.totals = totals
      if (totals) {
        this.totals.amount = totals.amount ? formatCurrency(totals.amount) : '0'
      }
      this.typeList = typeList
      this.altogetherAmount = altogetherAmount ? formatCurrency(altogetherAmount) : '0'
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
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
  float: left;
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
}
.title {
  float: left;
  margin-top: 8px;
  margin-left: 20px;
  b {
    margin-left: 10px;
    margin-right: 4px;
  }
}
</style>
