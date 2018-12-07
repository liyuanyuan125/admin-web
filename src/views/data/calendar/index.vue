<template>
  <div class="page">
    <div class="act-bar flex-box">
        <div class="acts">
          <form class="form flex-1" @submit.prevent="search">
            <LazyInput v-model="query.years" placeholder="输入年份" class="input"/>
            <Button class="bth" type="success">查询</Button>
            <Button class="okbth" type="success" @click="edit(0)">新建档期</Button>
          </form>
          
        </div>
      </div>

      <Table :columns="columns" :data="tableData" :loading="loading"
        border stripe disabled-hover size="small" class="table"></Table>

      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" show-total :page-size="query.pageSize" show-sizer
          :page-size-opts="[10, 20, 50, 100]" :current="query.pageIndex"
          @on-change="page => query.pageIndex = page"
          @on-page-size-change="pageSize => query.pageSize = pageSize"/>
      </div>
    <DlgEdit  ref="addOrUpdate" :cinemaOnes="editOne"  @refreshDataList="search" v-if="addOrUpdateVisible" />
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { get } from '@/fn/ajax'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { clean } from '@/fn/object'
import { dataFrom , queryList , dels} from '@/api/calendar'

import DlgEdit from './dlgEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'


const defQuery = {
  id: null,
  name: '',
  pageIndex: 1,
  pageSize: 20,
}

// const dataForm = {
//   name: '',
//   year: '',
//   // beginDate: new Date().getTime(),
//   // endDate: new Date().getTime(),
//   beginDate: '',
//   endDate: '',
// }

@Component({
  components: {
    DlgEdit
  }
})
export default class Main extends View {
  query = { ...defQuery }
  showDlg = false
  oldQuery: any = null

  editOne: any = null
  loading = false
  addOrUpdateVisible = false
  list = []
  lists = []
  total = 0

  beginDates = []
  endDates = []

  columns = [
    { title: '序号', key: 'id', align: 'center' },
    {
      title: '档期名称',
      key: 'name',
      align: 'center',
    },
    { title: '开始时间', key: 'beginDates', align: 'center' },
    { title: '结束时间', key: 'endDates', align: 'center' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <a on-click={this.edit.bind(this, row.id, row)}>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a on-click={this.dele.bind(this, row.id, row)}>删除</a>
        </div>
        /* tslint:enable */
      }
    }
  ]

  get cachedMap() {
    return {
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        beginDates: moment(it.beginDate).format(timeFormat),
        endDates: moment(it.endDate).format(timeFormat)
      }
    })
    // console.log(list)
    return list
  }

  mounted() {
    this.doSearch()
  }

  search() {
    this.query.pageIndex = 1
  }

  reset() {
    const { pageSize } = this.query
    this.query = { ...defQuery, pageSize }
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.loading = true
    const query = clean({ ...this.query })
    try {
      const { data: {
        items: list,
        totalCount: total,
        beginDates,
        endDates
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.beginDates = beginDates
      this.endDates = endDates
    // debugger
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  // 新增 / 修改
  edit(id: number, row: any) {
    this.addOrUpdateVisible = true
    !!id ? this.editOne = row : this.editOne
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id)
    })
  }

  async dele(id: number, row: any) {
    // alert(id)
    await dels({id})
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
.input {
  width: 70px;
  margin-right: 5px;
}
.acts {
  width: 100%;
}
.okbth {
  margin-top: 5px;
  float: right;
}
.btn-reset {
  margin-left: 8px;
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
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.data-inp {
  display: inline-block;
}
  </style>
