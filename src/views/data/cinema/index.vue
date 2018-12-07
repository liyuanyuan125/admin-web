<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.name" placeholder="影院名称" class="input"/>
        <CinemaChainSelect v-model="query.chainId" class="select-chain"/>
        <AreaSelect v-model="area" class="select-area"/>
        <Select v-model="query.status" placeholder="营业状态" clearable>
          <Option v-for="it in enumType.statusList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
        <Select v-model="query.controlStatus" placeholder="控制状态" clearable>
          <Option v-for="it in enumType.cstatusList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
        <Select v-model="query.hallDataStatus" placeholder="影厅数据" clearable>
          <Option v-for="it in enumType.hallDataStatusList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
        <!-- <Button type="primary" @click="search" icon="md-search" class="btn-search">查询</Button> -->
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </form>
      <div class="acts">
        <Button type="success" icon="md-add-circle" @click="edit(0)">新建影院</Button>
      </div>
    </div>

    <Table :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table"></Table>

    <div class="page-wrap" v-if="total > 0">
      <Page :total="total" show-total :page-size="query.pageSize" show-sizer
        show-elevator :page-size-opts="[10, 20, 50, 100]" :current="query.pageIndex"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>

    <div v-for="(it, i) in helperList" :key="it.id">
      <DlgEdit v-model="helperList[i]" @done="dlgEditDone" v-if="it.showDlgEdit"/>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import { isEqual } from 'lodash'
import { queryList, updateStatus, updateControlStatus } from '@/api/cinema'
import { numberify, numberKeys } from '@/fn/typeCast'
import AreaSelect from '@/components/AreaSelect.vue'
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import PartPoptipEdit from './partPoptipEdit.vue'
import DlgEdit from './dlgEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const defQuery = {
  id: '',
  name: '',
  chainId: '',
  provinceId: '0',
  cityId: '0',
  countyId: '0',
  status: 0,
  controlStatus: 0,
  hallDataStatus: 0,
  pageIndex: 1,
  pageSize: 20,
}

@Component({
  components: {
    AreaSelect,
    CinemaChainSelect,
    PartPoptipEdit,
    DlgEdit,
  }
})
export default class Main extends View {
  query: any = {}

  oldQuery: any = null

  loading = false
  list: any[] = []
  total = 0

  area: string[] = []

  // 辅助数据
  helperList: any[] = []

  enumType: any = {
    statusList: [],
    cstatusList: [],
    hallDataStatusList: [],
    gradeList: [],
  }

  get enumMap() {
    return Object.keys(this.enumType).reduce((map: any, it) => {
      const name = it.replace(/List$/, '')
      map[name || it] = makeMap(this.enumType[it])
      return map
    }, {})
  }

  get columns() {
    return  [
      { title: '序号', key: 'id', width: 138, align: 'center' },
      { title: '专资ID', key: 'code', width: 70, align: 'center' },
      { title: '影院名称', key: 'shortName', minWidth: 70, align: 'center' },
      { title: '院线', key: 'chainName', width: 120, align: 'center' },
      { title: '省份', key: 'provinceName', width: 80, align: 'center' },
      { title: '城市', key: 'cityName', width: 80, align: 'center' },
      { title: '区县', key: 'countyName', width: 80, align: 'center' },
      { title: '级别', key: 'gradeName', width: 60, align: 'center' },
      {
        title: '营业状态',
        width: 70,
        align: 'center',
        render: (hh: any, { row: { id, status, statusText } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const value = {
            id,
            key: status,
            text: statusText,
            list: this.enumType.statusList,
          }
          return <PartPoptipEdit v-model={value}
            on-change={this.editStatus.bind(this)}></PartPoptipEdit>
          /* tslint:enable */
        }
      },
      {
        title: '控制状态',
        width: 75,
        align: 'center',
        render: (hh: any, { row: { id, controlStatus, controlStatusText } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const value = {
            id,
            key: controlStatus,
            text: controlStatusText,
            list: this.enumType.cstatusList,
          }
          return <PartPoptipEdit v-model={value}
            on-change={this.editControlStatus.bind(this)}/>
          /* tslint:enable */
        }
      },
      {
        title: '操作',
        key: 'action',
        width: 108,
        align: 'center',
        render: (hh: any, { row: { id } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class="row-acts">
            <router-link to={{ name: 'data-cinema-hall', params: { id } }}>查看影厅</router-link>
            <a on-click={this.edit.bind(this, id)}>编辑</a>
          </div>
          /* tslint:enable */
        }
      }
    ]
  }

  get tableData() {
    const enumMap = this.enumMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        gradeName: enumMap.grade[it.grade],
        statusText: enumMap.status[it.status],
        controlStatusText: enumMap.cstatus[it.controlStatus],
      }
    })
    return list
  }

  mounted() {
    const urlQuery = slice(urlParam(), Object.keys(defQuery))
    this.query = numberify({ ...defQuery, ...urlQuery }, numberKeys(defQuery))
    this.fetch()
  }

  updateUrl() {
    const query = prettyQuery(this.query, defQuery)
    const url = buildUrl(location.pathname, query)
    history.replaceState(null, '', url)
  }

  search() {
    this.query.pageIndex = 1
  }

  reset() {
    const { pageSize } = this.query
    this.query = { ...defQuery, pageSize }
  }

  async fetch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.updateUrl()

    this.loading = true
    const query = clean({ ...this.query })
    try {
      const { data } = await queryList(query)

      this.list = data.items || []
      this.total = data.totalCount || 0

      this.enumType = {
        ...this.enumType,
        ...slice(data, Object.keys(this.enumType))
      }

      this.helperList = this.list.map((it: any) => ({
        id: it.id,
        showDlgEdit: false,
      }))
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  edit(id: string | number) {
    let item = this.helperList.find(it => it.id == id)
    if (item == null && id == 0) {
      item = { id: 0, showDlgEdit: true }
      this.helperList.push(item)
    }
    item && (item.showDlgEdit = true)
  }

  dlgEditDone() {
    this.fetch()
  }

  async editStatus({ id, key: newStatus, showLoading }: any) {
    const item = this.list.find(it => it.id == id)

    if (item && item.status != newStatus) {
      try {
        showLoading()
        await updateStatus(id, newStatus)
        item.status = newStatus
      } catch (ex) {
        this.handleError(ex)
      }
    }
  }

  async editControlStatus({ id, key: newStatus, showLoading }: any) {
    const item = this.list.find(it => it.id == id)

    if (item && item.controlStatus != newStatus) {
      try {
        showLoading()
        await updateControlStatus(id, newStatus)
        item.controlStatus = newStatus
      } catch (ex) {
        this.handleError(ex)
      }
    }
  }

  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }

    // 更新 area，其实直接更新也行，不会导致死循环，这里判断 isEqual 为了更加优化
    const area = Object.values(slice(this.query, 'provinceId,cityId,countyId'))
    if (!isEqual(this.area, area)) {
      this.area = area
    }

    this.fetch()
  }

  @Watch('area')
  watchArea(val: string[]) {
    this.query.provinceId = val[0]
    this.query.cityId = val[1]
    this.query.countyId = val[2]
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

.act-bar {
  margin-top: 5px;
}

.form {
  .input,
  /deep/ .ivu-select {
    width: 100px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
  }
  .select-area {
    width: 180px;
    margin-left: 8px;
  }
}

.btn-search,
.btn-reset {
  margin-left: 8px;
}

.table {
  margin-top: 16px;
  /deep/ .ivu-table-cell {
    padding-left: 4px;
    padding-right: 4px;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
  /deep/ .row-acts > a {
    margin: 0 4px;
  }
}

.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
</style>
