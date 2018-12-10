<template>
  <div class="page">
    <div class="act-bar flex-box">
      <div class="acts">
        <Button class="bth" type="text" @click="goback()">返回字典分类</Button>
        <LazyInput v-model="query.dictionaryName"  placeholder="词条名称" class="input"/>
        <Button class="okbth" type="success" @submit.prevent="search">查询</Button>
        <Button class="addbth" type="success" @click="edit(0)">新建词条</Button>
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
    <dlgViewEdit :cinemaOnes="editOne" :status="stas"  ref="addOrUpdate" @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"></dlgViewEdit>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { get } from '@/fn/ajax'
import { queryList , dictqueryList } from '@/api/dict'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { numberify, numberKeys } from '@/fn/typeCast'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import dlgViewEdit from './dlgViewEdit.vue'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD<br>HH:mm:ss'

const defQuery = {
  categoryId: '',
  pageIndex: 1,
  pageSize: 20,
  dictionaryName: ''
}


@Component({
  components: {
    dlgViewEdit
  }
})
export default class Main extends View {
  query = { ...defQuery }

  loading = false
  list = []
  lists = []
  addOrUpdateVisible = false
  total = 0
  oldQuery: any = {}
  editOne: any = null
  stas: any[] = []

  cqStatus = []

  categorys = []
  columns = [
    { title: '序号', key: 'id', align: 'center' },
    {
      title: '字典分类',
      key: 'categorys',
      align: 'center',
    },
    {
      title: '词条名称',
      key: 'name',
      align: 'center',
    },
    { title: '排序', key: 'sortValue', align: 'center' },
    { title: '唯一识别符', key: 'code', align: 'center' },
    {
      title: '启用状态',
      key: 'cqStatus',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
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
      cqStatus: this.cqStatus,
      categorys: this.cqStatus
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        cqStatus: it.enableStatus == 1 ? '启用' : '停用',
        categorys: it.category.name
      }
    })
    return list
  }

  mounted() {
    const urlQuery = slice(urlParam(), Object.keys(defQuery))
    this.query = numberify({ ...defQuery, ...urlQuery }, numberKeys(defQuery))

    const { id } = this.$route.params
    this.query.categoryId = id
    // this.doSearch()
  }

  search() {
    this.query.pageIndex = 1
  }

  updateUrl() {
    const query = prettyQuery(this.query, defQuery)
    const url = buildUrl(location.pathname, query)
    history.replaceState(null, '', url)
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
    this.updateUrl()
    this.loading = true
    const query = clean({ ...this.query })
    try {
      const { data: {
        list: list,
        totalCount: total,
        cqStatus,
        categorys,
      } } = await dictqueryList(query)
      this.list = list
      this.total = total
      this.cqStatus = cqStatus
      this.categorys = categorys
      this.stas = list
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
    try {
      const { data: {
        enableStatusList: list,
        totalCount: total,
        cqStatus,
        categorys,
      } } = await queryList(query)
      this.lists = list
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }
  edit(id: number, row: any) {
    this.addOrUpdateVisible = true
    !!id ? this.editOne = row : this.editOne
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id, this.lists)
    })
  }

  dlgEditDone() {
    this.doSearch()
  }

  goback() {
    this.$router.push({ name: 'data-dict' })
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
  width: 180px;
}
.bth {
  text-decoration: underline;
}
.acts {
  width: 100%;
}
.okbth {
  margin-left: 12px;
}
.addbth {
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
  </style>
