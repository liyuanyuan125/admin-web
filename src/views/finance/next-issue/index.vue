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
          class="expert"
        >
          <a
            :href='href'
            download
          >
            <i class='ivu-icon ivu-icon-ios-cloud-download'></i>
            <span>导出</span>
          </a>
        </Button>
      </template>

      <template slot="weeks" slot-scope="{row: {beginDate, endDate}}">
        {{autoweek(beginDate, endDate)}}
      </template>

      <template slot="month" slot-scope="{row: { endMonth}}">
        {{automonth(endMonth)}}
      </template>

      <template slot="operate" slot-scope="{row: { checkStatus, id, audit }}">
        <a v-if="checkStatus == 1 && audit" @click="sure(id)">核对 </a>
        <router-link v-if='checkStatus == 1 && audit' style="margin-right: 8px" :to="{ name: 'finance-next-issue-detail', params: { id, status: 1 } }">详情</router-link>
        <router-link v-else style="margin-right: 8px" :to="{ name: 'finance-next-issue-detail', params: { id, status: 2 }}">详情</router-link>
      </template>
    </ListPage>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList, xadvertconfirm } from '@/api/nextissue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import company from '../payroll/data/company.vue'
import moouth from './mouth.vue'
import { clean } from '@/fn/object'

const dateFormat = 'YYYY-MM-DD'
const makeMap = (list: any[]) => toMap(list, 'typeCode', 'typeName')
@Component({
  components: {
    ListPage,
  }
})
export default class Main extends ViewBase {
  ajaxBase = VAR.ajaxBaseUrl
  query: any = null

  filters: Filter[] = [
    {
      name: 'planName',
      defaultValue: '',
      input: true,
      width: 108,
      placeholder: '计划名称'
    },
    {
      name: 'companyName',
      defaultValue: '',
      input: true,
      width: 120,
      placeholder: '公司名称'
    },
    {
      name: 'videoName',
      defaultValue: '',
      input: true,
      width: 108,
      placeholder: '广告片'
    },
    {
      name: 'advertTypeCode',
      defaultValue: '',
      select: true,
      width: 108,
      placeholder: '广告类型',
      enumKey: 'advertTypeList'
    },
    {
      name: 'endMonth',
      defaultValue: '',
      component: moouth,
      width: 140,
      placeholder: '投放结束月份',
      dealParam(value: string) {
        return {
          endMonth: value ? value.replace(/\-/, '')  : ''
        }
      }
    },
    {
      name: 'planId',
      defaultValue: '',
      input: true,
      width: 108,
      placeholder: '计划ID'
    },
    {
      name: 'channelCode',
      defaultValue: '',
      width: 108,
      select: true,
      placeholder: '渠道',
      enumKey: 'channelList'
    },
    {
      name: 'checkStatus',
      defaultValue: '',
      select: true,
      width: 200,
      placeholder: '核对状态',
      enumKey: 'checkStatusList'
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
    'checkStatusList',
    'advertTypeList',
    'channelList'
  ]

  columns = [
    { title: '计划ID', key: 'planId', minWidth: 65 },
    { title: '计划名称', key: 'planName', minWidth: 60 },
    { title: '公司名称', key: 'companyName', minWidth: 60 },
    { title: '广告片', key: 'videoName', minWidth: 60 },
    { title: '广告类型', key: 'advertTypeCode', minWidth: 100, enum: 'advertTypeList' },
    { title: '渠道', key: 'channelCode', minWidth: 60, enum: 'channelList' },
    { title: '实际执行周期', key: 'beginDates', minWidth: 100, slot: 'weeks' },
    { title: '投放结束月份', key: 'endMonth', minWidth: 100, slot: 'month' },
    { title: '实际执行影院数量', key: 'cinemaCount', minWidth: 100 },
    { title: '实际曝光人次', key: 'personCountCheck', minWidth: 60 },
    { title: '状态', key: 'checkStatus', minWidth: 100, enum: true },
    { title: '操作', slot: 'operate', minWidth: 90 },
  ]

  fetch = async (query: any) => {
    const res = await queryList(query)
    ; (res.data.item || []).map((it: any) => {
      const loacl = moment().format('YYYYMM')
      const last = moment().month(moment().month() - 1).format('YYYYMM')
      const loacltime = moment().format('YYYYMMDD')
      const treee = moment().date(3).format('YYYYMMDD')
      it.audit = false
      if (it.endMonth == loacl) {
        if (!moment(loacltime).isBefore(treee)) {
          it.audit = true
        }
      } else if (last == it.endMonth) {
        if (moment(loacltime).isBefore(treee)) {
          it.audit = true
        }
      }
      return it
    })
    return res
  }

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  get href() {
    this.$nextTick(() => {
       this.query = this.listPage
    })
    if (this.query) {
      let str = ''
      /* tslint:disable */
      for (let i in clean(this.query.query)) {
        str += `${i}=${this.query.query[i] || ''}&`
      }
      return `${this.ajaxBase}/xadvert/checkplan/export?${str.slice(0, -1)}`
    }
    return `${this.ajaxBase}/xadvert/checkplan/export`
  }

  autoweek(begin: number, end: number) {
    console.log(begin, end)
    if (begin) {
      return moment(begin, 'YYYYMMDD').format(dateFormat) + '-' + moment(end, 'YYYYMMDD').format(dateFormat)
    }
    return '-'
  }

  automonth(end: any) {
    if (end) {
      return moment(end, 'YYYYMM').format('YYYY-MM')
    }
    return '-'
  }

  async sure(id: any) {
    try {
      await xadvertconfirm({
        id
      })
      this.listPage.update()
    } catch(ex) {
      this.handleError(ex)
    }
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