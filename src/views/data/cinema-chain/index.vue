<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.name" placeholder="公司名称" class="input input-id"/>
        <Button type="default" @click="resetQuery()" class="btn-reset">清空</Button>
      </form>

      <div class="acts" v-auth="'theater.chains:add'">
        <Button type="success" icon="md-add-circle" @click="edit(0)">新建院线信息</Button>
      </div>
    </div>

    <Table :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table">
      <template slot="spaction" slot-scope="{row}" >
        <a v-auth="'theater.chains:modify'"  @click="edit(row.id, row)" class="operation" >编辑</a>
      </template>
    </Table>

    <div class="page-wrap" v-if="total > 0">
      <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
    <DlgEdit  ref="addOrUpdate" :dlgStatus="chainStatus" :delControlStatus="controlStatusList" :cinemaOnes="editOne"  @refreshDataList="reloadSearch" v-if="addOrUpdateVisible" />
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { queryList } from '@/api/cinemaChain'
import { slice, clean } from '@/fn/object'
import { numberify, numberKeys } from '@/fn/typeCast'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import DlgEdit from './dlgEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

@Component({
  components: {
    DlgEdit
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    id: null,
    name: '',
    pageIndex: 1,
    pageSize: 20,
  }

  query: any = {}

  oldQuery: any = {}

  editOne: any = null
  loading = false
  addOrUpdateVisible = false
  list = []
  total = 0

  chainStatus = []
  controlStatusList = []
  columns = [
    { title: '序号', key: 'id', align: 'center' },
    { title: '名称', key: 'name', align: 'center' },
    { title: '简称', key: 'shortName', align: 'center' },
    { title: '拼音', key: 'pinyin',  align: 'center' },
    {
      title: '启用状态',
      key: 'controlStatusList',
      align: 'center',
      render: (hh: any, { row : { chainStatus , Status }  }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`aptitude-status-${chainStatus}`}>{Status}</span>
        /* tslint:enable */
      }
    },
    {
      title: '控制状态',
      key: 'Status',
      align: 'center',
      render: (hh: any, { row : { controlStatus , controlStatusList } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`status-${controlStatus}`}>{controlStatusList}</span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      slot: 'spaction',
      align: 'center'
    }
  ]

  get cachedMap() {
    return {
      Status: makeMap(this.chainStatus),
      controlStatusList: makeMap(this.controlStatusList),
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        Status: cachedMap.Status[it.chainStatus],
        controlStatusList: cachedMap.controlStatusList[it.controlStatus],
      }
    })
    return list
  }

  mounted() {
    this.updateQueryByParam()
  }

  search() {
    this.query.pageIndex = 1
  }

  async doSearch() {
    if (this.loading) {
      return
    }
    this.updateUrl()
    this.oldQuery = { ...this.query }

    this.loading = true
    const query = clean({ ...this.query })
    try {
      const { data: {
        items: list,
        totalCount: total,
        chainStatus,
        controlStatus,
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.chainStatus = chainStatus
      this.controlStatusList = controlStatus
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  reloadSearch() {
    this.doSearch()
  }

  // 新增 / 修改
  edit(id: number, row: any) {
    this.addOrUpdateVisible = true
      !!id ? this.editOne = row : this.editOne
    this.$nextTick(() => {
      (this.$refs.addOrUpdate as any).init(id)
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
.act-bar {
  margin-top: 5px;
}

.form {
  .input {
    margin-right: 8px;
  }
  .input-id {
    width: 180px;
  }
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
