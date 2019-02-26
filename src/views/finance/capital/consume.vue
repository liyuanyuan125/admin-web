<template>
  <div class="page">
    <div class="act-bar flex-box">
      <Form class="form" :label-width="0" @submit.prevent="search" inline>
        <DatePicker @on-change="dateChange" @on-clear="formatTime" type="daterange" v-model="showTime"
          placement="bottom-start" placeholder="统计范围" class="input" style="width:200px"></DatePicker>
        <LazyInput v-model="query.query" placeholder="广告" class="input input-id"/>
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </Form>
      <div v-if="totals" class="title">
        <b style="margin-left:0px">所属公司:</b>{{$route.params.title}} <span style="margin-left:8px"></span>
        <b>查询结果</b><b>共计曝光人次</b>：{{totals.count}}次   <b> 共计结算金额</b>：{{totals.amount}}元
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
import { consumeList } from '@/api/advertiser'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { formatCurrency } from '@/fn/string'
import {confirm , warning , success, toast } from '@/ui/modal'

const years = new Date().getFullYear()
const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'
const timeFormats = 'YYYY-MM-DD'

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
    { title: '项目', key: 'typeListText', align: 'center', width: 80 },
    { title: '投放公司', key: 'customerCompanyName', align: 'center',
      // render: (hh: any, { row: { withdrawalTime }, row }: any) => {
      //     /* tslint:disable */
      //     const h = jsxReactToVue(hh)
      //     const html = withdrawalTime ? moment(withdrawalTime).format(timeFormat) : ''
      //     return <span class='datetime' v-html={html}></span>
      //     /* tslint:enable */
      //   }
    },
    { title: '广告', width: 230, key: 'videoName', align: 'center',
      render: (hh: any, { row: { planId, planName, videoId, videoName } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = `[${planId}] ${planName} - [${videoId}] ${videoName}`
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '开始时间',
      key: 'amount',
      align: 'center',
      render: (hh: any, { row: { beginDate }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = beginDate ? moment(beginDate).format(timeFormats) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '结束时间',
      key: 'freezeAmount',
      align: 'center',
      render: (hh: any, { row: { endDate }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = endDate ? moment(endDate).format(timeFormats) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '总曝光人次',
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { exposureCount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = !!exposureCount || exposureCount == 0 ? formatCurrency(exposureCount).slice(0, -3) + '次' : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '结算金额',
      key: 'createName',
      align: 'center',
      render: (hh: any, { row: { amount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = !!amount ? formatCurrency(amount) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '结算时间',
      key: 'remark',
      align: 'center',
      render: (hh: any, { row: { settlementTime }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = settlementTime ? moment(settlementTime).format(timeFormats) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '报表名称',
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { reportName } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
       
        return reportName ? <span class='datetime'>{reportName}</span> : <a>生成报表</a>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { reportName }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return reportName ? <a>下载报表</a> : <span class='datetime'></span>
        /* tslint:enable */
      }
    }
  ]

  get cachedMap() {
    return {
      typeList: makeMap(this.typeList),
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        typeListText: cachedMap.typeList[it.typeCode]
      }
    })
    return list
  }

  init() {
    this.updateQueryByParam()
    !!this.query.beginDate ? this.$set(this.showTime, 0, moment(this.query.beginDate).format(timeFormat)) :  ''
    !!this.query.endDate ? this.$set(this.showTime, 1, moment(this.query.endDate).format(timeFormat)) :  ''
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

  reset() {
    this.query.query = ''
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
        items: list,
        totalCount: total,
        total: totals,
        typeList: typeList,
      } } = await consumeList(query)
      this.list = list
      this.total = total
      this.totals = totals
      if (totals) {
        this.totals.amount = totals.amount ? formatCurrency(totals.amount) : '0'
        this.totals.count = totals.count ? totals.count : '0'
      }
      this.typeList = typeList
      this.loading = false
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
