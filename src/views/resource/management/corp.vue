<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <Select style="width:90px" v-model="date.numdate" filterable>
          <Option v-for="it in dates" :key="it.key" :value="it.key">{{it.name}}</Option>
        </Select>
        <DatePicker v-if="date.numdate == 1" type="daterange" @on-change="dateChange" v-model="showTime" placement="bottom-start" placeholder="选择时间" class="input" style="width: 230px"></DatePicker>
        <LazyInput  v-if="date.numdate == 2" @on-focus='checkShow' v-model="date.calendarName" placeholder="档期" class="input"/>
        <Select style="width:240px" v-model="query.companyName" filterable>
          <Option v-for="it in companys" v-if='it.status==1' :key="it.name" :value="it.name">{{it.name}}</Option>
        </Select>
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </form>
      <div class="acts" v-auth="'advert.cpms:add'">
        <Button type="success" :to="{name: 'resource-management-edit'}" >新建刊例价</Button>
      </div>
    </div>

    <Table :columns="columns2" :data="list2" :loading="loading"
      border stripe disabled-hover size="small" class="table">
      <template slot="action" slot-scope="{row}" >
        <a v-auth="'advert.cpms:info'"  @click="edit(row.id)" class="operation" >详情</a>
      </template>
    </Table>

    <div class="page-wrap" v-if="total2 > 0">
      <Page :total="total2" :current="query.pageIndex" :page-size="query.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
    <!-- <DlgEdit v-if="diariesShow" v-model="diaries" @input='getdates(diaries)'/> -->
    <DlgEdit ref="diaries" v-if="diariesShow" v-model="diaries" @input='getdates(diaries)'/>

  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { pingqueryList, comqueryList, companysList, dels } from '@/api/management'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import DlgEdit from './dlgEdit.vue'

import {confirm , warning , success, toast } from '@/ui/modal'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD'

@Component({
  components: {
    DlgEdit
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    calendarId: null,
    gradeCode: null,
    companyName: '',
    beginDate: 0,
    endDate: 0,
    pageIndex: 1,
    pageSize: 20,
  }
  query: any = {}
  shows = true
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false
  diaries = {
    id: '',
    name: ''
  }
  diariesShow = false
  examine = false

  loading = false

  list2: any = [] // 公司刊例价



  total2 = 0

  oldQuery: any = {}
  typeList = []
  showTime: any = []




  statusList = []
  // 公司
  companys = []
  // 等级
  gradeList = []

  // 日期
  date = {
    numdate: 1,
    calendarName: '',
  }
  dates = [
    {
      key: 1,
      name: '有效日期'
    },
    {
      key: 2,
      name: '档期'
    }
  ]

  columns2 = [
    { title: '序号', key: 'id', align: 'center' },
    { title: '公司名称', key: 'companyName', align: 'center' },
    { title: '影响影院', key: 'cinemaCount', align: 'center',
    //  render: (hh: any, { row: { customerId , customerName } }: any) => {
    //     /* tslint:disable */
    //     const h = jsxReactToVue(hh)
    //     const html = '[' + customerId + '] '+ customerName
    //     return <span class='datetime' v-html={html}></span>
    //     /* tslint:enable */
    //   }
    },
    { title: '30秒刊例价(元/千人次)', key: 'cpm', align: 'center',
     render: (hh: any, { row: { cpm } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = cpm + '.00'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '15秒折扣', key: 'discount', align: 'center',
      render: (hh: any, { row: { discount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = discount + '%'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '预告片折扣', key: 'trailerDiscount', align: 'center',
     render: (hh: any, { row: { trailerDiscount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = trailerDiscount + '%'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '档期', key: 'calendarName', align: 'center',
      // render: (hh: any, { row: { transFee } }: any) => {
      //   /* tslint:disable */
      //   const h = jsxReactToVue(hh)
      //   const html = transFee + '.00'
      //   return <span class='datetime' v-html={html}></span>
      //   /* tslint:enable */
      // }
    },
    {
      title: '开始日期',
      key: 'beginDate',
      align: 'center',
      render: (hh: any, { row: { beginDate } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = String(beginDate).slice(0, 4) + '-' + String(beginDate).slice(4, 6) + '-' + String(beginDate).slice(6, 8)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '结束日期',
      key: 'endDate',
      align: 'center',
      render: (hh: any, { row: { endDate } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = String(endDate).slice(0, 4) + '-' + String(endDate).slice(4, 6) + '-' + String(endDate).slice(6, 8)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      slot: 'action',
      width: 90,
      align: 'center'
    }
  ]

  mounted() {
    this.updateQueryByParam()
    // this.doSearch()
    !!this.query.beginDate ? this.showTime[0] =
    moment(this.query.beginDate).format(timeFormat) : this.showTime[0] = ''
    !!this.query.endDate ? this.showTime[1] =
    moment(this.query.endDate).format(timeFormat) : this.showTime[1] = ''

  }

  dateChange(data: any) {
     // 获取时间戳
     const a = (moment(new Date(data[0]).getTime() - 28800000).format(timeFormat)).split('-')
     const b = (moment(new Date(data[1]).getTime() + 57600000).format(timeFormat)).split('-')

     !!data[0] ? (this.query.beginDate = a[0] + a[1] + a[2]) : this.query.beginDate = 0
     !!data[1] ? (this.query.endDate = b[0] + b[1] + b[2]) : this.query.endDate = 0
  }

  getdates(diaries: any) {
    this.query.calendarId = diaries.id
    this.date.calendarName = diaries.name
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
    this.date.calendarName = ''
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
      // 待审核
      const { data: {
        items: list2,
        totalCount: total2,
      } } = await comqueryList(query)

      this.list2 = list2 // 公司刊例价

      this.total2 = total2 // 公司刊例价
      // 公司列表
      const { data: {
        items: companys
      } } = await companysList({ pageSize: 1000000 })
      this.companys = companys
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  async del(id: any) {
    // console.log(id)
    try {
      await confirm('您确定删除当前刊例价吗？')
      await dels(id)
      toast('删除成功')
      this.reloadSearch()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  edit(id: any) {
    this.$router.push({ name: 'resource-management-edit', params: { id }})
  }

  checkShow() {
    // console.log(456)
    this.diariesShow = true
    this.$nextTick(() => {
      (this.$refs.diaries as any).init()
    })
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
    width: 230px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
  }

  .input-corp-id {
    width: 80px;
  }
}
.table {
  margin-top: 20px;
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
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
/deep/ .ivu-tabs-bar .ivu-tabs-nav-container {
  height: 70px !important;
}
/deep/ .nav-text {
  width: 100%;
  margin-left: 0.02%;
}
/deep/ .ivu-tabs-bar {
  border-bottom: 0;
}
/deep/ .ivu-tabs-tab {
  border-radius: 0 !important;
  background: #fff;
  color: #222;
  width: 16.66%;
  height: 70px !important;
  margin-right: 0 !important;
  text-align: center;
  line-height: 60px;
  font-size: 16px;
  border: 2px solid #fff !important;
  border-left: 0 !important;
}
/deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
  border-color: #fff !important;
}
/deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
  color: #222;
}


</style>
