<template>
  <div >
    <div  class="pages" >
    <Row class="shouDlg-header">
      <Col span="4">
        <AreaSelect v-model="area" :maxLevel='2'/>
      </Col>
      <Col style='margin-left: 15px;' span="4">
        <Select
             class='sels'
             v-model='dataForm.cinemaId'
             clearable
             filterable
             placeholder="影城名称"
             style='width: 150px;'
             remote
             :remote-method="cinemaMethod"
             @on-clear="getcinemaList = []"
              >
              <Option
                v-for="(item, index) in getcinemaList"
                :key="item.id"
                :value="item.id + '-' + item.officialName"
              >{{item.officialName}}</Option>
            </Select>
      </Col>
      <Col style='margin-left: 15px;' span="4">
        <Select v-model="dataForm.pricingLevelCode" placeholder="影城级别" clearable>
            <Option v-for="it in pricingLevelList" :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
      </Col>
      <Col style='margin-left: 15px;' span="6">
        <Button type="primary" @click="search">搜索</Button>
        <Button v-if='this.checkId.length > 0' style='margin-left: 15px;' type="primary" @click="changeAll">批量下刊</Button>
        <Button v-if='this.list.length > 0' style='margin-left: 15px;' type="primary" @click="exportData">导出</Button>
      </Col>
    </Row>

    <Table ref="selection" :columns="columns" @on-selection-change="check" :data="list" :loading="loading"
      border stripe disabled-hover size="small" class="table">
      <template slot="offShelfDate" slot-scope="{row}" >
        <span v-if='row.offShelfDate == null'>-</span>
        <span v-else >{{String(row.offShelfDate).slice(0, 4) +
        '-' +
        String(row.offShelfDate).slice(4, 6) +
        '-' +
        String(row.offShelfDate).slice(6, 8)}}</span>
      </template>
      <template slot="todayFinishRate" slot-scope="{row}" >
        <div v-if='row.todayFinishRate == "总计"'>总计</div>
        <div v-else >
          <span v-if='row.todayFinishRate == null'>-</span>
          <span v-else >{{row.todayFinishRate}}%</span>
        </div>
      </template>
      <template slot="tomorrowFinishRate" slot-scope="{row}" >
        <span v-if='row.tomorrowFinishRate== null'>-</span>
        <span v-else >{{row.tomorrowFinishRate}}%</span>
      </template>
      <template slot="todayPersonCount" slot-scope="{row}" >
        <span v-if='row.todayPersonCount== null'>-</span>
        <span v-else >{{formatNumber(row.todayPersonCount , 2)}}</span>
      </template>
      <template slot="todayShowCount" slot-scope="{row}" >
        <span v-if='row.todayShowCount== null'>-</span>
        <span v-else >{{formatNumber(row.todayShowCount , 2)}}</span>
      </template>
      <template slot="tomorrowPersonCount" slot-scope="{row}" >
        <span v-if='row.tomorrowPersonCount== null'>-</span>
        <span v-else >{{formatNumber(row.tomorrowPersonCount , 2)}}</span>
      </template>
      <template slot="tomorrowShowCount" slot-scope="{row}" >
        <span v-if='row.tomorrowShowCount== null'>-</span>
        <span v-else >{{formatNumber(row.tomorrowShowCount , 2)}}</span>
      </template>
      <template slot="personCount" slot-scope="{row}" >
        <span v-if='row.personCount== null'>-</span>
        <span v-else >{{formatNumber(row.personCount , 2)}}</span>
      </template>
      <template slot="budgetPersonCount" slot-scope="{row}" >
        <span v-if='row.budgetPersonCount== null'>-</span>
        <span v-else >{{formatNumber(row.budgetPersonCount , 2)}}</span>
      </template>
      <template slot="showCount" slot-scope="{row}" >
        <span v-if='row.showCount== null'>-</span>
        <span v-else >{{formatNumber(row.showCount , 2)}}</span>
      </template>
      <template slot="budgetShowCount" slot-scope="{row}" >
        <span v-if='row.budgetShowCount== null'>-</span>
        <span v-else >{{formatNumber(row.budgetShowCount , 2)}}</span>
      </template>
      <template slot="action" slot-scope="{row}" >
        <a v-if='row.todayFinishRate != "总计" &&  row.status == false ' @click="change( row.id)">通知下刊</a>
        <a v-else href="javascript:;">-</a>
      </template>
    </Table>
    <div class="page-wrap" v-if="total > 0">
       <Page class="page" :total="total" :current="dataForm.pageIndex" :page-size="dataForm.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="sizeChangeHandle"
          @on-page-size-change="currentChangeHandle"/>
    </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { nextList , nextItem , nextCinema , cinemaOff , callCinemaOff , districts } from '@/api/dataReport'
import {
  queryList,
} from '@/api/cinema'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import {confirm , warning , success, toast , info } from '@/ui/modal'
import AreaSelect from '@/components/areaSelect'

import { formatNumber } from '@/util/validateRules'
import Decimal from 'decimal.js'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}

@Component({
  components: {
    AreaSelect,
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  // 影城级别
  @Prop({ type: Array, default: () => [] }) pricingLevelList!: []
  // 影城级别
  @Prop({ type: Number, default: 0 }) planId!: number

  dataForm: any = {
    pageIndex: 1,
    pageSize: 20,
    cinemaId: null,
    provinceId: 0,
    cityId: 0,
    countyId: 0,
    pricingLevelCode: null,
    planId: this.planId,
  }
  cinemaArray: any = []
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false
  area: any = []
  totalPage = 0
  loading = false
  list: any = []
  total = 0
  typeList = []
  showTime: any = []
  checkId: any = []

  loadings: any = false
  // 影城列表
  getcinemaList: any = []

  bbb: any = []

  provinceIdName: any = ''
  cityIdName: any = ''

  get columns() {
    const data: any = [
      {
        type: 'selection',
        title: '全选',
        width: 60,
        align: 'center'
      },
      { title: '预计今日完成率', slot: 'todayFinishRate', width: 100, align: 'center' },
      { title: '预计明日完成率', width: 100, slot: 'tomorrowFinishRate', align: 'center' },
      { title: '预计完成日期', width: 110, slot: 'offShelfDate', align: 'center' },
      { title: '影城名称', width: 120, key: 'cinemaName', align: 'center' },
      { title: '专资编码', width: 70, key: 'code', align: 'center' },
      { title: '当日人次', width: 110, slot: 'todayPersonCount', align: 'center' },
      { title: '当日场次', width: 110, slot: 'todayShowCount', align: 'center' },
      { title: '明日人次', width: 110, slot: 'tomorrowPersonCount', align: 'center' },
      { title: '明日场次', width: 110, slot: 'tomorrowShowCount', align: 'center' },
      { title: '实际累计人次', width: 110, slot: 'personCount', align: 'center' },
      { title: '预计总人次', width: 110, slot: 'budgetPersonCount', align: 'center' },
      { title: '实际累计场次', width: 110, slot: 'showCount', align: 'center' },
      { title: '预计总场次', width: 110, slot: 'budgetShowCount', align: 'center' },
    ]
    const opernation = [
       {
        title: '操作',
        key: 'status',
        align: 'center',
        width: 70,
        slot: 'action'
      }
    ]
    return [...data, ...opernation]
  }

  get exportcolumns() {
    const data: any = [
      { title: '导出时间', key: 'exportDate', align: 'center', width: 100 },
      { title: '筛选条件', key: 'query', align: 'center', width: 100 },
      { title: '预计今日完成率', key: 'todayFinishRate', width: 100, align: 'center' },
      { title: '预计明日完成率', width: 100, key: 'tomorrowFinishRate', align: 'center' },
      { title: '预计完成日期', width: 110, key: 'offShelfDate', align: 'center' },
      { title: '影城名称', width: 120, key: 'cinemaName', align: 'center' },
      { title: '专资编码', width: 70, key: 'code', align: 'center' },
      { title: '当日人次', width: 110, key: 'todayPersonCount', align: 'center' },
      { title: '当日场次', width: 110, key: 'todayShowCount', align: 'center' },
      { title: '明日人次', width: 110, key: 'tomorrowPersonCount', align: 'center' },
      { title: '明日场次', width: 110, key: 'tomorrowShowCount', align: 'center' },
      { title: '实际累计人次', width: 110, key: 'personCount', align: 'center' },
      { title: '预计总人次', width: 110, key: 'budgetPersonCount', align: 'center' },
      { title: '实际累计场次', width: 110, key: 'showCount', align: 'center' },
      { title: '预计总场次', width: 110, key: 'budgetShowCount', align: 'center' },
    ]
    return [ ...data ]
  }

  get formatNumber() {
    return formatNumber
  }

  mounted() {
    this.list = []
    this.search()
  }

  // 下载
  exportData() {
    (this.$refs.selection as any).exportCsv({
        filename: '影城列表',
        columns: this.exportcolumns,
        data: [...this.bbb, ...this.list.slice(1)]
    })
  }

  // 影城列表搜索
  async cinemaMethod(querys: any) {
    try {
      if (querys) {
        this.loadings = true
        const {
          data: { items }
        } = await queryList({
          name: querys,
        })
        this.getcinemaList = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }

  check(row: any , selection: any) {
    this.checkId = row.map((it: any) => {
      return it.id
    })
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.dataForm.pageIndex = val
    this.search()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.dataForm.pageSize = val
    this.search()
  }

  async search() {
    if (this.loading) {
      return
    }
    this.loading = true
    // this.dataForm.cinemaId == null ? null : this.dataForm.cinemaId.split('-')[0]
    // console.log(this.dataForm.cinemaId)
    const query = clean({
      ...this.dataForm,
      cinemaId: this.dataForm.cinemaId == null ? null : this.dataForm.cinemaId.split('-')[0],
      cinemaName: this.dataForm.cinemaId == null ? null : this.dataForm.cinemaId.split('-')[1]
    })
    try {
        // 订单列表
      const { data: {
        items: list,
        totalCount: total,
        statusList: statusList,
        planTypeList: planTypeList,
        sumTodayShowCount,
        sumTodayPersonCount,
        sumTomorrowShowCount,
        sumTomorrowPersonCount,
        sumBudgetPersonCount,
        sumPersonCount,
        sumBudgetShowCount,
        sumShowCount,
      } } = await nextCinema(query)
      this.list = list == null ? [] : list.map((it: any) => {
        return {
          ...it,
          // todayFinishRate: new Decimal(it.todayFinishRate).div(100),
          // tomorrowFinishRate: new Decimal(it.tomorrowFinishRate).div(100)
        }
      })
      if (this.list.length > 0) {
        this.list.push({
          _disabled: true,
          todayFinishRate: '总计',
          todayPersonCount: sumTodayPersonCount,
          todayShowCount: sumTodayShowCount,
          tomorrowPersonCount: sumTomorrowPersonCount,
          tomorrowShowCount: sumTomorrowShowCount,
          personCount: sumPersonCount  ,
          budgetPersonCount: sumBudgetPersonCount,
          showCount: sumShowCount,
          budgetShowCount: sumBudgetShowCount,
        })
      }
      if (query.provinceId != undefined) {
        const cityone = await districts(query.provinceId)
        this.provinceIdName = (cityone.data || []).map((it: any) => {
          return it.nameCn
        })
      }
      if (query.cityId != undefined) {
        const citytwo = await districts(query.cityId)
        this.cityIdName = (citytwo.data || []).map((it: any) => {
          return it.nameCn
        })
      }
      const a = !query.provinceId ? '选择地区 : 全部' : '选择地区' + this.provinceIdName
      const b = !query.cityId ? '' : '/' + this.cityIdName
      const c = !query.cinemaId ? '影院名称 : 全部' : '影院名称' + query.cinemaName
      const d = !query.pricingLevelCode ? '影城级别 : 全部' : '影城级别' + query.pricingLevelCode
      this.bbb = [
        {
          exportDate: moment((new Date().getTime())).format(timeFormat),
          query: a + ' ' + b + ' ' + c + ' ' + d,
          ...this.list[0]
        }
      ]
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  async change(id: any) {
    try {
      await confirm('您确认要通知下刊吗？')
      const a = await callCinemaOff(id)
      toast('通知下刊成功')
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async changeAll() {
    if (this.checkId.length == 0) {
      info('请先选择需要通知下刊的影城')
      return
    }
    try {
      await confirm('您确认要通知下刊吗？')
      const a = await cinemaOff({ids: this.checkId})
      toast('通知下刊成功')
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('area', {immediate : true})

  watchArea(val: number[]) {
    this.dataForm.provinceId = !!val[0] ? val[0] : ''
    this.dataForm.cityId = !!val[1] ? val[1] : ''
    this.dataForm.countyId = !!val[2] ? val[2] : ''
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
  margin-top: 16px;
  /deep/ .status-2 {
    color: #19be6b;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
.pages {
  padding: 20px 10px 2px 10px;
}
</style>
