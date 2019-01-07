<template>
  <div class="page">
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <Form class="form flex-1" :label-width="0" @submit.prevent="search" :rules="rule" inline>
          <LazyInput v-model="query.companyName" placeholder="公司名称" class="input input-id"/>
          <FormItem label='' prop="showTime">
            <DatePicker @on-change="dateChange" @on-clear="formatTime" type="daterange" v-model="showTime" placement="right-bottom" placeholder="统计范围" class="input" style="width:200px"></DatePicker>
          </FormItem>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </Form>
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
    <!-- <DlgEdit  ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/> -->
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { advqueryList } from '@/api/advertiser'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import DlgEdit from './dlgEdit.vue'

import {confirm , warning , success, toast } from '@/ui/modal'

const years = new Date().getFullYear()
const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}


@Component({
  components: {
    DlgEdit,
  }
})
// export default class Main extends ViewBase {
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    companyName: '',
    pageIndex: 1,
    pageSize: 20,
    beginDate: new Date(`${years - 1}/1/1`).getTime(),
    endDate: new Date(`${years}/12/31`).getTime()
  }
  showTime: any = [new Date(`${years - 1}/1/1`), new Date(`${years}/12/31`)]
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


  statusList = []

  // company = []

  company2 = []
  rule = {
    showTime: [
      {}
    ]
  }

  columns = [
    { title: '项目', key: 'companyId', align: 'center', width: 80 },
    { title: '广告计划', key: 'companyName', align: 'center' },
    { title: '广告片', key: 'balance', align: 'center',
      render: (hh: any, { row: { balance } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = (balance.toFixed(2)).toLocaleString('en-US')
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '消费人',
      key: 'availableAmount',
      align: 'center',
      render: (hh: any, { row: { availableAmount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = (availableAmount.toFixed(2)).toLocaleString('en-US')
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '冻结金额（元）',
      key: 'freezeAmount',
      align: 'center',
      render: (hh: any, { row: { freezeAmount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = (freezeAmount.toFixed(2)).toLocaleString('en-US')
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '冻结时间',
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { monthRechargeCount, totalRechargeCount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span>{monthRechargeCount+'/'+totalRechargeCount}</span>
        /* tslint:enable */
      }
    },
    {
      title: '扣款金额（元）',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { monthConsumptionCount, totalConsumptionCount, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span>{monthConsumptionCount+'/'+totalConsumptionCount}</span>
        /* tslint:enable */
      }
    },
    {
      title: '扣款时间',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { monthConsumptionCount, totalConsumptionCount, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span>{monthConsumptionCount+'/'+totalConsumptionCount}</span>
        /* tslint:enable */
      }
    },
    {
      title: '退款金额（元）',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { monthConsumptionCount, totalConsumptionCount, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span>{monthConsumptionCount+'/'+totalConsumptionCount}</span>
        /* tslint:enable */
      }
    },
    {
      title: '退款时间',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { monthConsumptionCount, totalConsumptionCount, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span>{monthConsumptionCount+'/'+totalConsumptionCount}</span>
        /* tslint:enable */
      }
    }
  ]
  get cachedMap() {
    return {
      status: this.statusList,
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        statusText: it.status == 1 ? '启用' : '停用',
      }
    })
    return list
  }

  mounted() {
    this.updateQueryByParam()
    !!this.query.beginDate ? this.showTime[0] =
    moment(this.query.beginDate).format(timeFormat) : this.showTime[0] = ''
    !!this.query.endDate ? this.showTime[1] =
    moment(this.query.endDate).format(timeFormat) : this.showTime[1] = ''
  }

  formatTime() {
    this.showTime = [new Date(`${years - 1}/1/1`), new Date(`${years}/12/31`)]
  }
  dateChange(data: any) {
     // 获取时间戳
     !!data[0] ? (this.query.beginDate = new Date(data[0]).getTime() - 28800000) : this.query.beginDate = 0
     !!data[1] ? (this.query.endDate = new Date(data[1]).getTime() + 57600000) : this.query.endDate = 0
  }

  search() {
    this.query.pageIndex = 1
  }
  reloadSearch() {
    this.doSearch()
  }
  reset() {
    this.resetQuery()
    this.showTime = [new Date(`${years - 1}/1/1`), new Date(`${years}/12/31`)]
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
      } } = await advqueryList(query)
      this.list = list
      this.total = total
      this.statusList = statusList
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
    width: 180px;
    margin-left: 8px;
    margin-right: 8px;
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
</style>
