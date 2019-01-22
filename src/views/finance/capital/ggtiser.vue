<template>
  <div class="page">
    <div class="act-bar flex-box">
      <Form class="form flex-1" :label-width="0" @submit.prevent="search" inline>
        <LazyInput v-model="query.companyName" placeholder="公司名称" class="input input-id"/>
        <DatePicker v-model="showTime" type="daterange" placement="bottom-start" class="input"
          @on-change="dateChange" @on-clear="formatTime" placeholder="统计范围" style="width:200px"></DatePicker>
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </Form>
    </div>

    <Table :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table">
      <template slot-scope="{ row: { balance } }" slot="balance">
        <span class="datetime">{{balance|currency}}</span>
      </template>

      <template slot-scope="{ row: { availableAmount } }" slot="availableAmount">
        <span class="datetime">{{availableAmount|currency}}</span>
      </template>

      <template slot-scope="{ row: { freezeAmount } }" slot="freezeAmount">
        <span class="datetime">{{freezeAmount|currency}}</span>
      </template>
    </Table>

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
import { advqueryList } from '@/api/advertiser'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { formatCurrency } from '@/fn/string'
import {confirm , warning , success, toast } from '@/ui/modal'

const years = new Date().getFullYear()
const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}

@Component({
  filters: {
    currency: formatCurrency
  }
})
// export default class Main extends ViewBase {
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    companyName: '',
    pageIndex: 1,
    pageSize: 20,
    beginDate: new Date(`${years}/1/1`).getTime(),
    endDate: new Date(`${years + 1}/1/1`).getTime() - 1
  }
  showTime: any = []
  query: any = {}

  addOrUpdateVisible = false
  changeVisible = false

  examine = false

  loading = false
  list = []
  total = 0
  oldQuery: any = {}
  typeList = []

  get columns() {
    return [
      { title: '公司ID', key: 'companyId', align: 'center', width: 80 },
      { title: '公司名称', key: 'companyName', align: 'center' },
      { title: '账户余额（元）', key: 'balance', align: 'center', slot: 'balance' },
      { title: '可用余额（元）', key: 'availableAmount', align: 'center', slot: 'availableAmount' },
      { title: '冻结金额（元）', key: 'freezeAmount', align: 'center', slot: 'freezeAmount' },
      {
        title: '',
        key: 'statusText',
        align: 'center',
        render: (hh: any, { row: { monthRechargeCount, totalRechargeCount, companyId, companyName } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const start = new Date(this.showTime[0]).getTime()
          const end = new Date(this.showTime[1]).getTime()
          const year = new Date().getFullYear()
          const month = new Date().getMonth() + 1
          const beginDate = new Date(`${year}/${month}/1`).getTime()
          const endDate = new Date(`${year}/${month + 1}/1`).getTime() -1
          return <div>
            <router-link class="router" to={{name: 'finance-capital-rechargeNum',
              params: {companyId: companyId, title: companyName },
              query: { beginDate: beginDate, endDate: endDate }}}>
              <span v-html={monthRechargeCount}></span>/
            </router-link>
            <router-link class="router" to={{name: 'finance-capital-rechargeNum',
              params: {companyId: companyId, title: companyName },
              query: { beginDate: this.query.beginDate, endDate: this.query.endDate }}}>
              <span v-html={totalRechargeCount}></span>
            </router-link>
          </div>
          /* tslint:enable */
        },
        /* tslint:disable */
        renderHeader: (hh: any) => {
          const h = jsxReactToVue(hh)
          return <span class='table-money'>充值次数<br/>（本月/累计）</span>
        }
        /* tslint:enable */
      },
      {
        title: '',
        key: 'action',
        align: 'center',
        render: (hh: any, { row: { companyId, companyName, monthConsumptionCount, totalConsumptionCount } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const start = new Date(this.showTime[0]).getTime()
          const end = new Date(this.showTime[1]).getTime()
          const year = new Date().getFullYear()
          const month = new Date().getMonth() + 1
          const beginDate = new Date(`${year}/${month}/1`).getTime()
          const endDate = new Date(`${year}/${month + 1}/1`).getTime() - 1
          // <router-link to={{name: 'payRank'}}>{monthConsumptionCount+'/'+totalConsumptionCount}</router-link>
          return <div>
            <router-link class="router" to={{name: 'finance-capital-payRank',
              params: {companyId: companyId, title: companyName },
              query: { beginDate: beginDate, endDate: endDate }}}>
              <span v-html={monthConsumptionCount}></span>/
            </router-link>
            <router-link class="router" to={{name: 'finance-capital-payRank',
              params: {companyId: companyId, title: companyName },
              query: { beginDate: this.query.beginDate, endDate: this.query.endDate }}}>
              <span v-html={totalConsumptionCount}></span>
            </router-link>
          </div>
          /* tslint:enable */
        },
        /* tslint:disable */
        renderHeader: (hh: any) => {
          const h = jsxReactToVue(hh)
          return <span class='table-money'>消费次数<br/>（本月/累计）</span>
        }
        /* tslint:enable */
      }
    ]
  }

  get tableData() {
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
      }
    })
    return list
  }

  created() {
    if ( this.showTime.length < 2 ) {
      this.showTime = [new Date(`${years}/1/1`), new Date(`${years}/12/31`)]
    }
  }

  init() {
    this.updateQueryByParam()
    !!this.query.beginDate
      ? this.$set(this.showTime, 0, new Date(moment(this.query.beginDate).format(timeFormat)))
      : ''
    !!this.query.endDate
      ? this.$set(this.showTime, 1,  new Date(moment(this.query.endDate).format(timeFormat)))
      : ''
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

  reloadSearch() {
    this.doSearch()
  }

  reset() {
    this.resetQuery()
    this.showTime = [new Date(`${years}/1/1`), new Date(`${years}/12/31`)]
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
      } } = await advqueryList(query)
      this.list = list
      this.total = total
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
  /deep/ .router > a:only-child:empty {
    &::before {
      content: '0';
    }
  }
  /deep/ .table-money {
    display: inline-block;
    padding-top: 4px;
    height: 46px;
  }
}
</style>
