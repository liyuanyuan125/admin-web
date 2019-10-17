<template>
  <div class="page">
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <LazyInput v-model="query.planId" placeholder="广告计划ID" class="input"/>
          <LazyInput v-model="query.planName" placeholder="广告计划名称" class="input"/>
          <DatePicker type="daterange" @on-change="dateChange" v-model="showTime" placement="bottom-end" placeholder="查询日期" class="input" style="width: 200px"></DatePicker>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
          <!-- <Button type="default" class="btn-reset">...</Button> -->
          <a v-if='this.list.length > 0' class='exp' :href='herf' download='导出' >导出</a>
          
        </form>
      </div>
      <Table ref='table' :columns="columns" :data="list" :loading="loading"
        border stripe disabled-hover size="small" class="table">
          <template slot="budgetFinishDate" slot-scope="{row}" >
            <span v-if='row.budgetFinishDate== null'>-</span>
            <span v-else >{{String(row.budgetFinishDate).slice(0, 4) +
            '-' +
            String(row.budgetFinishDate).slice(4, 6) +
            '-' +
            String(row.budgetFinishDate).slice(6, 8)}}</span>
          </template>
          <template slot="todayFinishRate" slot-scope="{row}" >
            <span v-if='row.todayFinishRate== null'>-</span>
            <span v-bind:class="{ red: (row.todayFinishRate >= 95) }" v-else >{{row.todayFinishRate}}%</span>
          </template>
          <template slot="tomorrowFinishRate" slot-scope="{row}" >
            <span v-if='row.tomorrowFinishRate== null'>-</span>
            <span v-bind:class="{ red: (row.tomorrowFinishRate >= 95) }" v-else >{{row.tomorrowFinishRate}}%</span>
          </template>
          <template slot="budgetPersonCount" slot-scope="{row}" >
            <span v-if='row.budgetPersonCount== null'>-</span>
            <span v-else >{{formatNumber(row.budgetPersonCount , 2)}}</span>
          </template>
          <template slot="personCount" slot-scope="{row}" >
            <span v-if='row.personCount == null'>-</span>
            <span v-else >{{formatNumber(row.personCount , 2)}}</span>
          </template>
          <template slot="budgetShowCount" slot-scope="{row}" >
            <span v-if='row.budgetShowCount == null'>-</span>
            <span v-else >{{formatNumber(row.budgetShowCount , 2)}}</span>
          </template>
          <template slot="showCount" slot-scope="{row}" >
            <span v-if='row.showCount == null'>-</span>
            <span v-else >{{formatNumber(row.showCount , 2)}}</span>
          </template>
          <template slot="cost" slot-scope="{row}" >
            <span v-if='row.cost == null'>-</span>
            <span v-else >{{formatNumber(row.cost , 2)}}</span>
          </template>
          <template slot="spaction" slot-scope="{row}" >
            <router-link  style='margin-left: 10px;' :to="{ name: 'datareport-nextissue-detail', params: { id: row.id } }">详情</router-link>
        </template>
        </Table>

      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="page => query.pageIndex = page"
          @on-page-size-change="pageSize => query.pageSize = pageSize"/>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { nextList , reportsexport } from '@/api/dataReport'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import { formatNumber } from '@/util/validateRules'
import Decimal from 'decimal.js'
import {confirm , warning , success, toast } from '@/ui/modal'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}


@Component({
  components: {
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    planId: '',
    planName: '',
    beginDate: 0,
    endDate: 0,
    pageIndex: 1,
    pageSize: 20
  }
  str: any = ''
  query: any = {}
  shows = true
  showDlg = false
  addOrUpdateVisible = false

  loading = false
  list: any = []
  total = 0
  oldQuery: any = {}
  showTime: any = []
  statusList = []

  ids: any = 0

  bbb: any = [
    {
      exportDate: moment((new Date().getTime())).format(timeFormat),
      query: '计划ID' + !this.query.planId ? '全部' : this.query.planId +
      '计划名称' + !this.query.planName ? '全部' : this.query.planName +
      '查询日期' + !this.query.beginDate ? '全部' : this.query.beginDate + '~' + this.query.endDate,
      ...this.list[0]
    }
  ]


  columns = [
    { title: '广告计划ID', key: 'planId', align: 'center', width: 100 },
    { title: '广告计划名称', key: 'planName', align: 'center' },
    { title: '今日订单完成率', slot: 'todayFinishRate', align: 'center' },
    { title: '明日订单完成率' , slot: 'tomorrowFinishRate', align: 'center' },
    { title: '预计完成日期' , slot: 'budgetFinishDate', align: 'center' },
    { title: '预计总人次' , slot: 'budgetPersonCount', align: 'center' },
    { title: '实际累计人次' , slot: 'personCount', align: 'center' },
    { title: '预计总场次' , slot: 'budgetShowCount', align: 'center' },
    { title: '实际累计场次' , slot: 'showCount', align: 'center' },
    { title: '花费' , slot: 'cost', align: 'center' },
    { title: '更新时间' , key: 'updateTime', align: 'center',
      render: (hh: any, { row: { updateTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = updateTime == 'updateTime' ? '-' : moment(updateTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      slot: 'spaction',
      align: 'center',
      width: 100,
    }
  ]

  exportcolumns = [
    { title: '导出时间', key: 'exportDate', align: 'center', width: 100 },
    { title: '筛选条件', key: 'query', align: 'center', width: 100 },
    { title: '广告计划ID', key: 'planId', align: 'center', width: 100 },
    { title: '广告计划名称', key: 'planName', align: 'center' },
    { title: '今日订单完成率', key: 'todayFinishRate', align: 'center' },
    { title: '明日订单完成率' , key: 'tomorrowFinishRate', align: 'center' },
    { title: '预计完成日期' , key: 'budgetFinishDate', align: 'center' },
    { title: '预计总人次' , key: 'budgetPersonCount', align: 'center' },
    { title: '实际累计人次' , key: 'personCount', align: 'center' },
    { title: '预计总场次' , key: 'budgetShowCount', align: 'center' },
    { title: '实际累计场次' , key: 'showCount', align: 'center' },
    { title: '花费' , key: 'cost', align: 'center' },
    { title: '更新时间' , key: 'updateTime', align: 'center',
      render: (hh: any, { row: { updateTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = updateTime == 'updateTime' ? '-' : moment(updateTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
  ]

  mounted() {
    this.updateQueryByParam()
    const a = this.query.beginDate == 0 ? 0 : new Date(String(this.query.beginDate).slice(0, 4)
      + '-' + String(this.query.beginDate).slice(4, 6) + '-' + String(this.query.beginDate).slice(6, 8))
    const b = this.query.endDate == 0 ? 0 : new Date(String(this.query.endDate).slice(0, 4)
      + '-' + String(this.query.endDate).slice(4, 6) + '-' + String(this.query.endDate).slice(6, 8))
    !!this.query.beginDate ? this.showTime[0] =
    moment(a).format(timeFormat) : this.showTime[0] = ''
    !!this.query.endDate ? this.showTime[1] =
    moment(b).format(timeFormat) : this.showTime[1] = ''
  }

  dateChange(data: any) {
     // 获取时间戳
    const ba = new Date(data[0]).getFullYear()
    const bb = Number(new Date(data[0]).getMonth()) + 1 < 10 ? '0' + Number(new Date(data[0]).getMonth() + 1)
    : Number(new Date(data[0]).getMonth() + 1)
    const bc = new Date(data[0]).getDate() < 10 ? '0' + new Date(data[0]).getDate()
    : new Date(data[0]).getDate()
    // 开始时间
     !!data[0] ? (this.query.beginDate = String(ba) + String(bb) + String(bc)) : this.query.beginDate = 0

     const ea = new Date(data[1]).getFullYear()
    const eb = new Date(data[1]).getMonth() + 1 < 10 ? '0' + (new Date(data[1]).getMonth() + 1)
    : new Date(data[1]).getMonth() + 1
    const ec = new Date(data[1]).getDate() < 10 ? '0' + new Date(data[1]).getDate()
    : new Date(data[1]).getDate()
    // 结束时间
     !!data[1] ? (this.query.endDate = String(ea) + String(eb) + String(ec)) : this.query.endDate = 0
  }

  get formatNumber() {
    return formatNumber
  }

  // // 下载
  // async exportData() {
  //   // this.oldQuery = { ...this.query , pageIndex: null, pageSize: null }
  //   // const query: any = {}
  //   // for (const [key, value] of Object.entries(this.oldQuery)) {
  //   //   if (key != 'beginDate' && value != 0) {
  //   //     query[key] = value
  //   //   }
  //   //   if (key != 'endDate' && value != 0) {
  //   //     query[key] = value
  //   //   }
  //   // }
  //   // const { data: {
  //   //     items: list,
  //   //     totalCount: total,
  //   //     statusList: statusList,
  //   //     sumBudgetPersonCount, // 合计预估总人次
  //   //     sumPersonCount, // 合计累计总人次
  //   //     sumBudgetShowCount, // 合计预估总场次
  //   //     sumShowCount, // 合计累计总场次
  //   //   } } = await reportsexport(query)
  //   //   this.list = list == null ? [] : list.map((it: any) => {
  //   //     return {
  //   //       ...it,
  //   //       // todayFinishRate: new Decimal(it.todayFinishRate).div(100),
  //   //       // tomorrowFinishRate: new Decimal(it.tomorrowFinishRate).div(100)
  //   //     }
  //   //   })
  //   (this.$refs.table as any).exportCsv({
  //       filename: '下刊监控列表',
  //       columns: this.exportcolumns,
  //       data: ([...this.bbb, ...this.list.slice(1)]).map((it: any) => {
  //         return {
  //           ...it,
  //           updateTime: (it.updateTime == null || it.updateTime == 'updateTime') ? ''
  //           : moment(it.updateTime).format(timeFormat)
  //         }
  //       })
  //   })
  // }

  get herf() {
    const query: any = {}
    for (const [key, value] of Object.entries(this.oldQuery)) {
      if (key != 'beginDate' && value != 0) {
        query[key] = value
      }
      if (key != 'endDate' && value != 0) {
        query[key] = value
      }
    }
    this.str = `${VAR.ajaxBaseUrl}/bi/off-shelf-reports/export`
    if (query.planId != undefined) {
      if (this.str.indexOf('?') == -1) {
        this.str = this.str + `?planId=${query.planId}`
      } else {
        this.str = this.str + `&planId=${query.planId}`
      }
    }
    if (query.planName != undefined) {
      if (this.str.indexOf('?') == -1) {
        this.str = this.str + `?planName=${query.planName}`
      } else {
        this.str = this.str + `&planName=${query.planName}`
      }
    }
    if (query.beginDate != undefined) {
      if (this.str.indexOf('?') == -1) {
        this.str = this.str + `?beginDate=${query.beginDate}&endDate=${query.endDate}`
      } else {
        this.str = this.str + `&beginDate=${query.beginDate}&endDate=${query.endDate}`
      }
    }
    return this.str
  }

  search() {
    this.query.pageIndex = 1
  }
  reloadSearch() {
    this.doSearch()
  }
  reset() {
    this.resetQuery()
    this.showTime = []
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
        statusList: statusList,
        sumBudgetPersonCount, // 合计预估总人次
        sumPersonCount, // 合计累计总人次
        sumBudgetShowCount, // 合计预估总场次
        sumShowCount, // 合计累计总场次
      } } = await nextList(query)
      this.list = list == null ? [] : list.map((it: any) => {
        return {
          ...it,
          // todayFinishRate: new Decimal(it.todayFinishRate).div(100),
          // tomorrowFinishRate: new Decimal(it.tomorrowFinishRate).div(100)
        }
      })
      // if (this.list.length > 0) {
      //   this.list.push({
      //     planId: '总计',
      //     budgetPersonCount: sumBudgetPersonCount,
      //     personCount: sumPersonCount,
      //     budgetShowCount: sumBudgetShowCount,
      //     showCount: sumShowCount,
      //     updateTime: 'updateTime'
      //   })
      // }
      // const a = !query.planId ? '计划ID : 全部' : '计划ID' + query.planId
      // const b = !query.planName ? '计划名称 : 全部' : '计划名称' + query.planName
      // const c = !query.beginDate ? '查询日期 : 全部' : '查询日期' + (query.beginDate + '~' + query.endDate)

      // this.bbb = [
      //   {
      //     exportDate: moment((new Date().getTime())).format(timeFormat),
      //     query: a + ' ' + b + ' ' + c,
      //     ...this.list[0]
      //   }
      // ]
      this.total = total
      this.statusList = statusList
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
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id)
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
    width: 100px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
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
.Add-Inp {
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 15px;
}
.Add-Inp span {
  display: inline-block;
  width: 7%;
  text-align: right;
  margin-right: 4%;
}
.Add-Inp input {
  display: inline-block;
}
.button2 {
  width: 6%;
  height: 40px;
  margin-left: 5%;
}
.page-f {
  margin-top: 10px;
  font-size: 15px;
}
.bge {
  background: #fff;
  padding: 5px;
}

.table {
  margin-top: 16px;
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
.red {
  color: red;
}
.exp {
  display: inline-block;
  margin-left: 1%;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1.5;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 5px 15px 6px;
  font-size: 12px;
  border-radius: 4px;
  transition: color .2s linear, background-color .2s linear, border .2s linear, box-shadow .2s linear;
  color: #515a6e;
  background-color: #fff;
  border-color: #dcdee2;
}
</style>

