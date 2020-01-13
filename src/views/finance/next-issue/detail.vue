<template>
  <div>
     <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :updateUrlByCode="false"
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

      <template slot="code" slot-scope="{index}">
        <span>{{codes(index)}}</span>
      </template>

      <template slot="specification" slot-scope="{row: {specification}}">
        <span>{{specification || '-'}}</span><span v-if="specification">s</span>
      </template>

      <template slot="unitPriceCheck" slot-scope="{row: {unitPriceCheck, id}}">
        <PoptipInput :value="autoquery(unitPriceCheck, id, 'unitPriceCheck')" @change="editquery" />
      </template>

      <template slot="amountCheck" slot-scope="{row: {personCountCheck, unitPriceCheck}}">
        <span>{{plusFloat(personCountCheck, unitPriceCheck)}}</span>
      </template>
      <template slot="showCountCheck" slot-scope="{row: {showCountCheck, id}}">
        <PoptipInput :value="autoquery(showCountCheck, id, 'showCountCheck')" @change="editquery" />
      </template>

      <template slot="weeks" slot-scope="{row: {beginDate, endDate}}">
        {{autoweek(beginDate, endDate)}}
      </template>

      <template slot="personCountCheck" slot-scope="{row: {personCountCheck, id}}">
        <PoptipInput :value="autoquery(personCountCheck, id, 'personCountCheck')" @change="editquery"/>
      </template>

      <template slot="remark" slot-scope="{row: { remark, id }}">
        <PoptipInput :value="autoquery(remark, id, 'remark')" @change="editquery" />
      </template>
    </ListPage>
    <div>操作日志</div>
    <div v-for="(item, index) in logs" :key="index">
      {{item.createUserName}} 在 {{formattime(item.createTime)}} {{item.description}}
    </div>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { checkplan, update } from '@/api/nextissue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import company from '../payroll/data/company.vue'
import moouth from './mouth.vue'
import { clean } from '@/fn/object'
import Xselect from './city.vue'
import PoptipInput from '@/components/PoptipInput.vue'
import resouse from './resouse.vue'
import { edit, detail} from './data'

const dateFormat = 'YYYY-MM-DD'
const makeMap = (list: any[]) => toMap(list, 'typeCode', 'typeName')
@Component({
  components: {
    ListPage,
    Xselect,
    PoptipInput,
    resouse
  }
})
export default class Main extends ViewBase {
  loglist: any = []
  ajaxBase = VAR.ajaxBaseUrl
  query: any = null
  selectedIds: any = []

  get filters() {
    const id = this.$route.params.id
    return [
      {
        name: 'cityId',
        defaultValue: 0,
        type: Xselect,
        width: 108,
        placeholder: '影院归属城市'
      },
      {
        name: 'resourceId',
        defaultValue: 0,
        type: resouse,
        width: 120,
        placeholder: '资源方公司'
      },
      {
        name: 'query',
        defaultValue: '',
        type: 'input',
        width: 128,
        placeholder: '专资编号或影院名称'
      },
      {
        name: this.$route.params.detail ? 'detailId' : 'planId',
        defaultValue: id
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
  }

  enums = [
    'logList'
  ]

  fetch = async (query: any) => {
    const res = await checkplan(query)
    this.loglist = (res.data.logList || []).map((it: any) => {
      return {
        ...it,
        createTime: moment(it.createTime).format('YYYY-MM-DD HH:SS')
      }
    })
    return res
  }

  formattime(time: any) {
    return moment(time).format('YYYY-MM-DD HH:mm')
  }

  get logs() {
    this.$nextTick(() => {
       this.query = this.listPage
    })
    if (this.query) {
      return this.query.enumType.logList
    }
    return []
  }
  mounted() {
    (this.$refs.listPage as any).resetQuery()
  }

  get columns() {
    const { status } = this.$route.params
    if (status == '1') {
      return edit
    } else {
      return detail
    }
  }

  plusFloat(num1: any, num2: any) {
    let r1 = 0
    let r2 = 0
    let m = 0
    try {
      r1 = num1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = num2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    const num = ((num1 * m) * (num2 * m)) / (m * m)
    return num.toFixed(2)
  }

  batchInvoice() {

  }

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  codes(index: any) {
    this.$nextTick(() => {
       this.query = this.listPage
    })
    return (this.query.query.pageIndex - 1) * this.query.query.pageSize + (index + 1)
  }

  get href() {
    this.$nextTick(() => {
       this.query = this.listPage
    })
   if (this.query) {
      /* tslint:disable */
      let str = ''
      /* tslint:disable */
      for (let i in clean(this.query.query)) {
        str += `${i}=${this.query.query[i] || ''}&`
      }
      return `${this.ajaxBase}/xadvert/checkplan/detailExport?${str.slice(0, -1)}`
    }
    return `${this.ajaxBase}/xadvert/checkplan/detailExport`
  }

  autoquery(query: any, id: any, text: any) {
    return {
      value: query,
      id: id,
      text: text,
      intext: query
    }
  }

  async editquery({ id, value, text, showLoading, hideLoading }: any) {
    this.$nextTick(() => {
       this.query = this.listPage
    })
    const item = this.query.list.find((it: any) => it.id == id)
    try {
      showLoading()
      const query: any ={
        detailId: this.$route.params.id,
        id: id,
      }
      query[text] = value
      await update(query)
      item[text] = value
    } catch (ex) {
      this.handleError(ex)
    } finally {
      hideLoading()
    }
  }

  autoweek(begin: number, end: number) {
    if (begin) {
      return moment(begin, 'YYYYMMDD').format(dateFormat) + '-' + moment(end, 'YYYYMMDD').format(dateFormat)
    }
    return '-'
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