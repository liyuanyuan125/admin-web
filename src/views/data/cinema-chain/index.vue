<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.name" placeholder="公司名称" class="input input-id"/>
        <Button type="primary" @click="search" icon="md-search" class="btn-search">查询</Button>
      </form>

      <div class="acts">
        <Button type="success" @click="edit(0)">创建</Button>
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
import { queryList } from '@/api/cinemaChain'

import DlgEdit from './dlgEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')

const defQuery = {
  id: null,
  name: '',
  pageIndex: 1,
  pageSize: 20,
}

@Component({
  components: {
    DlgEdit
  }
})
export default class Main extends View {
  query = { ...defQuery }

  oldQuery: any = null
  editOne: any = null
  loading = false
  addOrUpdateVisible = false
  list = []
  total = 0

  chainStatus = []
  chainControlStatus = []

  columns = [
    { title: '序号', key: 'id', width: 90, align: 'center' },
    { title: '名称', key: 'name', width: 200, align: 'center' },
    { title: '简称', key: 'shortName', width: 140, align: 'center' },
    { title: '拼音', key: 'pinyin',  align: 'center' },
    {
      title: '启用状态',
      key: 'Status',
      width: 80,
      align: 'center',
      render: (hh: any, { row : { ControlStatus , chainControlStatus } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`status-${chainControlStatus}`}>{ControlStatus}</span>
        /* tslint:enable */
      }
    },
    {
      title: '控制状态',
      key: 'chainControlStatus',
      width: 90,
      align: 'center',
      render: (hh: any, { row : { chainStatus , Status }  }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`aptitude-status-${chainStatus}`}>{Status}</span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <a on-click={this.edit.bind(this, row.id, row)}>编辑</a>
        </div>
        /* tslint:enable */
      }
    }
  ]

  get cachedMap() {
    return {
      Status: this.chainStatus,
      ControlStatus: this.chainControlStatus,
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        Status: cachedMap.Status[it.chainStatus][it.chainStatus],
        ControlStatus: cachedMap.ControlStatus[it.chainControlStatus][it.chainControlStatus],
      }
    })
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
        chainStatus,
        chainControlStatus,
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.chainStatus = chainStatus
      this.chainControlStatus = chainControlStatus
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
  .input {
    margin-right: 8px;
  }
  .input-id {
    width: 180px;
  }
}

.btn-search,
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
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}

.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
</style>
