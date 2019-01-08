<template>
  <div class="page">
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <Form class="form flex-1" :label-width="0" @submit.prevent="search" inline>
          <FormItem label=''>
            <DatePicker @on-change="dateChange" @on-clear="formatTime" type="daterange" v-model="showTime" placement="bottom-start" placeholder="统计范围" class="input" style="width:200px"></DatePicker>
          </FormItem>
          <Select v-model="query.type" placeholder="客户类型" clearable>
            <Option v-for="it in typeList" :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </Form>
      </div>
      <div>
          查询结果：共计金额：{{altogetherAmount}}元   次数共计：{{total}}次
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
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { payList, payStatus } from '@/api/advertiser'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import DlgEdit from './dlgEdit.vue'
import { formatCurrency } from '@/fn/string'
import {confirm , warning , success, toast } from '@/ui/modal'

const years = new Date().getFullYear()
const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormat = 'YYYY-MM-DD<br/>HH:mm:ss'

const dataForm = {
  status: 1
}


@Component({
  components: {
    DlgEdit,
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    companyId: '',
    pageIndex: 1,
    pageSize: 20,
    beginDate: new Date(`${years - 1}/1/1`).getTime(),
    type: 0,
    endDate: new Date(`${years + 1}/1/1`).getTime() - 1,
    statistics: true
  }
  showTime: any = []
  query: any = {}
  shows = true
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false

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
    { title: '充值序号', key: 'id', align: 'center', width: 80 },
    { title: '汇款日期', key: 'remittanceDate', align: 'center' },
    { title: '充值类型', key: 'balance', align: 'center',
      render: (hh: any, { row: { typeListText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = typeListText
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '充值金额',
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
      title: '充值前金额',
      key: 'freezeAmount',
      align: 'center',
      render: (hh: any, { row: { beforeAmount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = beforeAmount ? formatCurrency(beforeAmount) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '充值后金额',
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { afterAmount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = afterAmount ? formatCurrency(afterAmount) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '申请人',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { applyName }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span>{applyName}</span>
        /* tslint:enable */
      }
    },
    {
      title: '申请时间',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { applyTime }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = applyTime ? moment(applyTime).format(timeFormat) : ''
        return <span v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '审核人',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { approvalName}, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span>{approvalName}</span>
        /* tslint:enable */
      }
    },
    {
      title: '审核时间',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { approvalTime }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = approvalTime ? moment(approvalTime).format(timeFormat) : ''
        return <span v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '备注',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { remark }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span>{remark}</span>
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
        typeListText: cachedMap.typeList[it.type]
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
    this.showTime = [new Date(`${years - 1}/1/1`), new Date(`${years}/12/31`)]
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
    this.showTime = [new Date(`${years - 1}/1/1`), new Date(`${years}/12/31`)]
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
        typeList: typeList,
      } } = await payList(query)
      this.list = list
      this.total = total
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

  @Watch('$route', {immediate: true})
  watch$route(val: any, oldVal: any) {
    if (val.name == 'rechargeNum') {
      this.updateQueryByParam()
      !!val.query.beginDate ? this.$set(this.showTime, 0, moment(Number(val.query.beginDate)).format(timeFormat)) : ''
      !!val.query.endDate ? this.$set(this.showTime, 1, moment(Number(val.query.endDate)).format(timeFormat)) : ''
    }
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
