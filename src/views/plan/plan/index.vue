<template>
  <div class="page">
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <DatePicker @on-change="dateChange" type="daterange" v-model="showTime" placement="bottom-start" placeholder="投放排期" class="input" style="width: 200px"></DatePicker>
          <Select
            v-model="query.query"
            filterable
            remote
            clearable
            placeholder="计划ID/名称"
            :remote-method="authIdList"
            style="width: 160px"
            :loading="loading">
            <Option v-for="(option, index) in options" :value="option.value" :key="index">{{option.label}}</Option>
          </Select>
          <CompanyList v-model="query.companyId" />
          <Select v-model="query.status" placeholder="计划状态" clearable>
            <Option v-if="it.key != 0" v-for="it in statusList" :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
          <Select v-model="query.settlementStatus" placeholder="结算状态" clearable>
            <Option v-if="it.key != 0" v-for="it in settlementStatusList" :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </form>
        <!-- <div class="acts">
          <Button type="success" icon="md-add-circle" @click="edit(0)">新建充值</Button>
        </div> -->
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
    <DlgEdit ref="start" v-if="addShow" @refreshDataList="reloadSearch" />
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { queryList } from '@/api/ggplan'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { formatCurrency } from '@/fn/string'
import { slice, clean } from '@/fn/object'
import CompanyList from '@/components/companyList.vue'
import DlgEdit from './dlgEdit.vue'

import {confirm , warning , success, toast } from '@/ui/modal'

const years = new Date().getFullYear()
const months = new Date().getMonth() + 1
const date = new Date()

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormat = 'YYYY-MM-DD'


@Component({
  components: {
    DlgEdit,
    CompanyList
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    id: '',
    pageIndex: 1,
    pageSize: 20,
    beginDate: '',
    endDate: '',
    companyId: 0,
    status: 0,
    query: '',
    settlementStatus: 0
  }
  query: any = {}
  shows = true
  addShow = false
  // query = { ...defQuery }
  options: any = []
  loading = false
  list = []
  total = 0
  oldQuery: any = {}
  settlementStatusList = []
  statusList = []
  showTime: any = []

  // 状态列表
  approveStatusList = []

  // 公司列表
  company: any = []
  columns = [
    { title: '计划ID', key: 'id', width: 60 , align: 'center' },
    { title: '计划名称', key: 'name', align: 'center',
      render: (hh: any, { row: { name } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class='row-hidden' title={name} v-html={name}></span>
        /* tslint:enable */
      }
    },
    { title: '广告片', key: 'videoName', align: 'center' },
    { title: '规格', key: 'amount', align: 'center' , width: 50,
      render: (hh: any, { row: { specification } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return specification == null ? <span class='datetime' v-html='-'></span> : <span class='datetime' v-html={specification + 's'}></span>
        /* tslint:enable */
      }
    },
    {
      title: '时长',
      key: 'remittanceDate',
      align: 'center',
      width: 60,
      render: (hh: any, { row: { length } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return length == null ? <span class='datetime' v-html='-'></span> : <span class='datetime' v-html={length + 's'}></span>
        /* tslint:enable */
      }
    },
    {
      title: '投放排期',
      key: 'statusText',
      width: 100,
      align: 'center',
      render: (hh: any, { row: { beginDate, endDate } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const beginDates = beginDate ? moment(beginDate).format(timeFormat) : ''
        const endDates = endDate ? moment(endDate).format(timeFormat) : ''
        const html = beginDate ? `${beginDates}</br>~${endDates}` : ''
        return <span v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '投放周期（天）',
      key: 'action',
      width: 100,
      align: 'center',
      render: (hh: any, { row: { cycle }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = cycle ? `${cycle}` : ''
        return <span v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '冻结金额(元)', key: 'id', width: 100 , align: 'center',
      render: (hh: any, { row: { freezeAmount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = freezeAmount ? formatCurrency(freezeAmount) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '计划状态', key: 'statusText', align: 'center' },
    { title: '结算状态', key: 'setText', align: 'center' },
    { title: '结算金额(元)', width: 100, key: 'amount', align: 'center',
      render: (hh: any, { row: { settlementAmount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = settlementAmount ? formatCurrency(settlementAmount) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '创建时间', key: 'createTime', width: 80 , align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const createTimes = createTime ? moment(createTime).format(timeFormat) : ''
        const html = createTimes ? `${createTimes}` : ''
        return <span v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '所属公司', key: 'companyName', align: 'center' },
    { title: '操作', key: 'accountName', width: 100, align: 'center',
      render: (hh: any, {row: { id, status }}: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const edit = status == 2 ? '审核' : '详情'
        const detail = status == 2 ? 'audit' : 'detail'
        // <a on-click={this.edittime.bind(this, id, 'start')}>开始</a>
        return <div>
          <router-link to={{name: 'ggtising-plan-edit', params: {id, edit: detail}}}>{edit}</router-link>
        </div>
        /* tslint:disable */
      }
    },
  ]

  get cachedMap() {
    return {
      settlementStatusList: makeMap(this.settlementStatusList),
      statusList: makeMap(this.statusList)
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    console.log(cachedMap)
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        setText: cachedMap.settlementStatusList[it.settlementStatus],
        statusText: cachedMap.statusList[it.status],
      }
    })
    return list
  }

  // 新建
  edit(id: number) {
    const params: any = id > 0 ? { id } : {}
    this.$router.push({ name: 'finance-examine-edit', params })
  }

  async authIdList(query: any) {
    if (query !== '') {
      this.loading = true
      try {
        const {
          data: {
            items
          }
        } = await queryList({
          query: decodeURIComponent(query),
          pageIndex: 1,
          pageSize: 100
        })
        const ids: any = []
        const datas = items
        const name: any = []
        datas.forEach((it: any) => {
          if (it.name.includes(query)) {
            name.push({
              value: it.name,
              label: it.name
            })
          }
          const id = it.id + ''
          if (id.includes(query)) {
            ids.push({
              value: it.id + '',
              label: it.id + ''
            })
          }
        })
        this.options = [...ids, ...name]
        this.loading = false
      } catch (ex) {
        this.options = []
      }
    } else {
      this.options = []
    }
  }

  mounted() {
    this.updateQueryByParam()
    !!this.query.beginDate ? this.showTime[0] = moment(Number(this.query.beginDate)).format(timeFormat) : ''
    !!this.query.endDate ? this.showTime[1] = moment(Number(this.query.endDate)).format(timeFormat) : ''
  }

  dateChange(data: any) {
    // 获取时间戳
    !!data[0] ? (this.query.beginDate = new Date(data[0]).getTime() - 28800000) : this.query.beginDate = ''
    !!data[1] ? (this.query.endDate = new Date(data[1]).getTime() + 57600000 - 1) : this.query.endDate = ''
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

  edittime(id: any, type: string) {
    this.addShow = true
    this.$nextTick(() => {
      (this.$refs.start as any).init(id, type)
    })
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }
    this.updateUrl()
    this.loading = true
    // const query = clean({ ...this.query })
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
      // 获取列表页
      const { data: {
        items: list,
        totalCount: total,
        settlementStatusList: settlementStatusList,
        statusList: statusList
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.statusList = statusList ? statusList.filter((it: any) => it.key != 0) : []
      this.settlementStatusList = settlementStatusList ? settlementStatusList.filter((it: any) => it.key != 0) : []
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

  @Watch('item', { deep: true })
  watchitem(val: any) {
    const form = 'dataForms'
    if (val.approveStatus == 3) {
      (this.$refs[form] as any).fields.forEach((e: any) => {
        if (e.prop == 'validityPeriodDate') {
          e.resetField()
        }
      })
    } else if (val.approveStatus == 1) {
      (this.$refs[form] as any).fields.forEach((e: any) => {
        if (e.prop == 'refusedReason') {
          e.resetField()
        }
      })
    }
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
  /deep/ .status-2,
  /deep/ .aptitude-status-3 {
    color: #19be6b;
  }
  /deep/ .row-hidden {
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/ .aptitude-status-2 {
    color: #000;
  }
  /deep/ .aptitude-status-4 {
    color: #ed4014;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
// .info-type-inp span {
//   margin-left: 1%;
//   color: #53A1F3;
//   cursor: pointer;
//   text-decoration: underline;
// }
// .info-type Button {
//   margin-top: 2%;
//   margin-left: 24%;
// }
  </style>
