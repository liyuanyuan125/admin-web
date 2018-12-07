<template>
  <div class="page">
      <div class="act-bar flex-box">
        <div class="acts">
          <Button type="success" @click="edit(0)">新建字典分类</Button>
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
      <dlgEdit  ref="addOrUpdate" :cinemaOnes="editOne" @refreshDataList="search" v-if="addOrUpdateVisible"></dlgEdit>
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
import { queryList , set } from '@/api/dict'

import dlgEdit from './dlgEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')

const defQuery = {
  id: null,
  name: '',
  categoryId: '',
  pageIndex: 1,
  pageSize: 20,
}

@Component({
  components: {
    dlgEdit
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
  names = []
  qStatus = []

  columns = [
    { title: '序号', key: 'id', align: 'center' },
    { title: '分类名称', key: 'name', align: 'center', },
    { title: '唯一识别符', key: 'code', align: 'center' },
    { title: '启用状态', key: 'qStatus', align: 'center' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <router-link to={{ name: 'data-dict-viewDictionary', params: { id } }}>查看字典</router-link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a on-click={this.edit.bind(this, row.id, row)}>编辑</a>
        </div>
        /* tslint:enable */
      }
    }
  ]

  get cachedMap() {
    return {
      qStatus: this.qStatus,
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        qStatus: it.enableStatus == 1 ? '启用' : '停用',
      }
    })
    // console.log(list)
    return list
  }

  mounted() {
    this.doSearch()
    // console.log(this.names)
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
        qStatus
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.qStatus = qStatus
      this.names = this.list
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  // 新增 / 修改
  edit(id: number, row: any) {
    // console.log(id)
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
