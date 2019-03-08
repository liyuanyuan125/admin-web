<template>
  <div class="page">
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <LazyInput v-model="query.companyName" placeholder="公司名称" class="input" style="width: 200px"/>
          <DatePicker type="daterange" @on-change="dateChange" @on-clear="formatTime" v-model="showTime" placement="bottom-end" placeholder="汇款日期" class="input" style="width: 200px"></DatePicker>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </form>
        <div class="acts">
          <Button v-auth="'finance.recharges:add'" type="success" icon="md-add-circle" @click="edit(0)">新建充值</Button>
        </div>
      </div>
      <Table :columns="columns" :data="tableData" :loading="loading"
        border stripe disabled-hover size="small" class="table">
          <template slot="spaction" slot-scope="{row}">
          <router-link v-show='row.approvalStatus == 1' v-auth="'finance.recharges:approval'" :to="{ name: 'finance-examine-detail', params: { id : row.id , approvalStatus : row.approvalStatus } }">审核</router-link>
          <router-link v-show='row.approvalStatus != 1' v-auth="'finance.recharges:info'" :to="{ name: 'finance-examine-detail', params: { id : row.id , approvalStatus : row.approvalStatus } }">详情</router-link>
        </template>
        </Table>

      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="page => query.pageIndex = page"
          @on-page-size-change="pageSize => query.pageSize = pageSize"/>
      </div>
    </div>
    <!-- <DlgEdit  ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/> -->
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { queryList } from '@/api/examine'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
// import DlgEdit from './dlgEdit.vue'

import {confirm , warning , success, toast } from '@/ui/modal'

const years = new Date().getFullYear()
const months = new Date().getMonth() + 1
const date = new Date()
// const currentMonth=date.getMonth()
// const nextMonth=months
const nextMonthFirstDay = new Date(years, months, 1)
const oneDay = 1000 * 60 * 60 * 24



const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD'


@Component({
  components: {
    // DlgEdit,
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    id: '',
    companyName: '',
    pageIndex: 1,
    pageSize: 20,
    beginDate: new Date(`${years}/${months}/1`).getTime(),
    endDate: nextMonthFirstDay.getTime() - oneDay
  }
  query: any = {}
  shows = true
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false


  examine = false
  // query = { ...defQuery }

  loading = false
  list = []
  total = 0
  oldQuery: any = {}
  typeList = []
  showTime: any = []

  // 状态列表
  approveStatusList = []

  // 公司列表
  company: any = []

  columns = [
    { title: '序号', key: 'id', width: 100 , align: 'center' },
    { title: '公司名称', key: 'companyName', align: 'center' },
    { title: '汇款人姓名', key: 'accountName', align: 'center' },
    { title: '充值金额', key: 'amount', align: 'center' ,
      render: (hh: any, { row: { amount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        // const html = moment(amount).format(timeFormat)
        return amount == null ? <span class='datetime' v-html='-'></span> : <span class='datetime' v-html={amount + '.00'}></span>
        /* tslint:enable */
      }
    },
    {
      title: '汇款日期',
      key: 'remittanceDate',
      align: 'center',
      render: (hh: any, { row: { remittanceDate } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(remittanceDate).format(timeFormat)
        return remittanceDate == null ? <span class='datetime' v-html='-'></span> : <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '状态',
      key: 'statusText',
      width: 100,
      align: 'center',
      render: (hh: any, { row: { approvalStatus, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (approvalStatus == 0){
          return <span class={`status-${0}`}>-</span>
        } else if (approvalStatus == 1) {
          return <span class={`status-${1}`}>待审核</span>
        } else if (approvalStatus == 2) {
          return <span class={`status-${2}`}>通过</span>
        } else if (approvalStatus == 3) {
          return <span class={`status-${3}`}>拒绝</span>
        }
        
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      slot: 'spaction',
      width: 100,
      align: 'center',
    }
  ]
  get cachedMap() {
    return {
      approvalStatus: this.approveStatusList,
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        statusText: it.approveStatus,
      }
    })
    return list
  }
  // 新建
  edit(id: number) {
    const params: any = id > 0 ? { id } : {}
    this.$router.push({ name: 'finance-examine-edit', params })
  }

  created() {
    // this.formatTime()

    if ( this.showTime.length < 2 ) {
      this.showTime = [new Date(`${years}/${months}/1`) , new Date(nextMonthFirstDay.getTime() - oneDay)]
    }
  }

  mounted() {

    this.updateQueryByParam()
    // this.showTime = [new Date(`${years}/${months}/1`), new Date(nextMonthFirstDay.getTime() - oneDay)]
    // !!this.query.beginDate ? this.showTime[0] =
    // moment(this.query.beginDate).format(timeFormat) : this.showTime[0] = ''
    // !!this.query.endDate ? this.showTime[1] =
    // moment(this.query.endDate).format(timeFormat) : this.showTime[1] = ''
    !!this.query.beginDate ? this.$set(this.showTime, 0, new Date(moment(this.query.beginDate).format(timeFormat)))
     : ''
    !!this.query.endDate ? this.$set(this.showTime, 1,  new Date(moment(this.query.endDate).format(timeFormat)))
    : ''
    // console.log(this.query.endDate)
  }

  formatTime() {
    this.showTime = [new Date(`${years}/${months}/1`), new Date(nextMonthFirstDay.getTime() - oneDay)]
  }

  dateChange(data: any) {
     // 获取时间戳
     !!data[0] ? (this.query.beginDate = new Date(data[0]).getTime() - 28800000) : this.query.beginDate = 0
     !!data[1] ? (this.query.endDate = new Date(data[1]).getTime() + 57600000) : this.query.endDate = 0
    //  console.log(data[1])
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
        approvalStatusList: approvalStatusList,
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.approveStatusList = approvalStatusList
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
