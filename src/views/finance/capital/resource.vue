<template>
  <div class="page">
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <Form class="form flex-1" :label-width="0" @submit.prevent="search" inline>
          <LazyInput v-model="query.companyName" placeholder="公司名称" class="input input-id"/>
          <FormItem label='' >
            <DatePicker @on-change="dateChange" @on-clear="formatTime" type="daterange" v-model="showTime" placement="bottom-end" placeholder="统计范围" class="input" style="width:200px"></DatePicker>
          </FormItem>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </Form>
        <div class="acts">
          <Button type="success" icon="md-add-circle" @click="edit(0)">新建</Button>
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
    <!-- <DlgEdit  ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/> -->
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { resqueryList } from '@/api/advertiser'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import DlgEdit from './dlgEdit.vue'
import { formatCurrency } from '@/fn/string'
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
    endDate: new Date(`${years + 1}/1/1`).getTime() - 1
  }
  showTime: any = []
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

  // company = []

  company2 = []

  get columns() {
    return [
      { title: '公司ID', key: 'companyId', align: 'center', width: 80 },
      { title: '公司名称', key: 'companyName', align: 'center' },
      { title: '账户余额（元）', key: 'balance', align: 'center',
        render: (hh: any, { row: { balance } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const html = formatCurrency(balance)
          return <span class='datetime' v-html={html}></span>
          /* tslint:enable */
        }
      },
      {
        title: '',
        key: 'availableAmount',
        align: 'center',
        render: (hh: any, { row: { monthSettlementCount, totalSettlementCount } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <router-link to={{name: 'consume'}}>{monthSettlementCount + '/' + totalSettlementCount}</router-link>
          /* tslint:enable */
        },
        /* tslint:disable */
        renderHeader: (hh: any) => {
          const h = jsxReactToVue(hh)
          return <span>结算次数<br/>（本月/累计）</span>
        }
        /* tslint:enable */
      },
      {
        title: '',
        key: 'freezeAmount',
        align: 'center',
        render: (hh: any, { row: { monthWithdrawalCount, totalWithdrawalCount, companyId } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <router-link to={{name: 'withdraw', params: {companyId: companyId}, query: { beginDate: this.query.beginDate, endDate: this.query.endDate }}}>
          {monthWithdrawalCount + '/' + totalWithdrawalCount}</router-link>
          /* tslint:enable */
        },
        /* tslint:disable */
        renderHeader: (hh: any) => {
          const h = jsxReactToVue(hh)
          return <span>提现次数<br/>（本月/累计）</span>
        }
        /* tslint:enable */
      },
      {
        title: '进账明细',
        key: 'statusText',
        align: 'center',
        render: (hh: any, { row: { monthRechargeCount, totalRechargeCount, companyId } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <router-link to={{name: 'rechargeNum', params: {companyId: companyId}}}>查询</router-link>
          /* tslint:enable */
        }
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (hh: any, { row: { companyId }, row }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const showTime = this.showTime
          return <router-link to={{name: 'withdrawalBill', params: { id: companyId }}}>添加提现账单</router-link>
          /* tslint:enable */
        }
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
      this.showTime = [new Date(`${years - 1}/1/1`), new Date(`${years}/12/31`)]
    }
  }

  mounted() {
    this.updateQueryByParam()
    !!this.query.beginDate ? this.$set(this.showTime, 0, new Date(moment(this.query.beginDate).format(timeFormat)))
     : ''
    !!this.query.endDate ? this.$set(this.showTime, 1,  new Date(moment(this.query.endDate).format(timeFormat)))
    : ''
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
      } } = await resqueryList(query)
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
      (this.$refs.addOrUpdate as any).init(id)
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
