<template>
  <div class="page">
    <div class="act-bar flex-box">
      <div class="acts">
        <Button class="bth" icon="md-return-left" @click="goback">返回字典分类</Button>
        <!-- <Button class="bth" type="text" @click="goback()">返回字典分类</Button> -->
        <LazyInput v-model="query.dictionaryName"  placeholder="词条名称" class="input"/>
        <Button class="okbth" type="success" @submit.prevent="search">查询</Button>
        <Button v-auth="'basis.dictionary:add'" class="addbth" type="success" icon="md-add-circle" @click="edit(0)">新建词条</Button>
      </div>
    </div>
    <Table v-auth="'basis.dictionarys:list'" :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table">
        <template slot="spaction" slot-scope="{row}">
          <a v-auth="'basis.dictionary:modify'" @click="edit(row.id, row)">编辑</a>
        </template>
      </Table>

    <div v-auth="'basis.dictionarys:list'" class="page-wrap" v-if="total > 0">
      <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
<<<<<<< HEAD
    <dlgViewEdit :cinemaOnes="editOne" :status="stas" ref="addOrUpdate" @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"></dlgViewEdit>
=======
    <dlgViewEdit :cinemaOnes="editOne"   ref="addOrUpdate" @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"></dlgViewEdit>
>>>>>>> testing
  </div>
</template>

<script lang="tsx">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { queryList , dictqueryList } from '@/api/dict'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import dlgViewEdit from './dlgViewEdit.vue'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD<br>HH:mm:ss'

@Component({
  components: {
    dlgViewEdit
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    categoryId: '',
    pageIndex: 1,
    pageSize: 20,
    dictionaryName: ''
  }

  query: any = {}
  oldQuery: any = {}

  loading = false
  list = []
  // 新建传值默认启用状态
  enableStatusList = []
  addOrUpdateVisible = false
  total = 0
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
      title: '控制状态',
      key: 'cqStatus',
      align: 'center',
    },
    {
      title: '操作',
      slot: 'spaction',
      align: 'center',
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
    const { id } = this.$route.params
    this.updateQueryByParam({ categoryId: id }, { noRouteParam: true })
  }

  search() {
    this.query.pageIndex = 1
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
      // 弹窗传值启用状态
      const { data: {
        enableStatusList: enableStatusList,
      } } = await queryList(query)
      this.enableStatusList = enableStatusList
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
      myThis.$refs.addOrUpdate.init(id, this.enableStatusList)
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
  margin-top: 7px;
}
.bth {
  // text-decoration: underline;
  margin-right: 8px;
  margin-top: 7px;
}
.acts {
  width: 100%;
}
.okbth {
  margin-left: 8px;
  margin-top: 7px;
}
.addbth {
  float: right;
  margin-top: 7px;
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
