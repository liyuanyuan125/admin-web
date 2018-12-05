<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.name" placeholder="影院名称" class="input"/>
        <CinemaChainSelect v-model="query.chainId" class="select-chain"/>
        <AreaSelect v-model="area" class="select-area"/>
        <Select v-model="query.status" placeholder="营业状态" clearable>
          <Option v-for="it in statusList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
        <Select v-model="query.controlStatus" placeholder="控制状态" clearable>
          <Option v-for="it in controlStatusList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
        <Select v-model="query.hallDataStatus" placeholder="影厅数据" clearable>
          <Option v-for="it in hallDataStatusList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
        <!-- <Button type="primary" @click="search" icon="md-search" class="btn-search">查询</Button> -->
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </form>
      <div class="acts">
        <Button type="success" @click="edit(0)">创建</Button>
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
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { clean } from '@/fn/object'
import { queryList, updateStatus, updateControlStatus } from '@/api/cinema'
import AreaSelect from '@/components/AreaSelect.vue'
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import PartPoptipEdit from './partPoptipEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const defQuery = {
  id: null,
  name: '',
  chainId: '',
  provinceId: 0,
  cityId: 0,
  countyId: 0,
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
  }
})
export default class Main extends View {
  query = { ...defQuery }

  oldQuery: any = null

  loading = false
  list: any[] = []
  total = 0

  statusList: any[] = []
  controlStatusList: any[] = []
  hallDataStatusList: any[] = []
  gradeList: any[] = []

  area: any[] = [0, 0, 0]

  get columns() {
    return  [
      { title: '序号', key: 'id', width: 70, align: 'center' },
      { title: '专资ID', key: 'code', width: 55, align: 'center' },
      { title: '影院名称', key: 'shortName', width: 70, align: 'center' },
      { title: '官方名称', key: 'officalName', minWidth: 90, align: 'center' },
      { title: '院线', key: 'chainName', width: 70, align: 'center' },
      { title: '省份', key: 'provinceName', width: 70, align: 'center' },
      { title: '城市', key: 'cityName', width: 70, align: 'center' },
      { title: '区县', key: 'countyName', width: 70, align: 'center' },
      { title: '地址', key: 'address', width: 80, align: 'center' },
      { title: '售票系统', key: 'softwareName', width: 80, align: 'center' },
      { title: '级别', key: 'gradeName', width: 60, align: 'center' },
      { title: '邮编', key: 'zipCode', width: 60, align: 'center' },
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
            list: this.statusList,
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
            list: this.controlStatusList,
          }
          return <PartPoptipEdit v-model={value}
            on-change={this.editControlStatus.bind(this)}/>
          /* tslint:enable */
        }
      },
      {
        title: '操作',
        key: 'action',
        width: 66,
        align: 'center',
        render: (hh: any, { row: { id } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class='row-acts'>
            <router-link to={{ name: 'data-cinema-hall', params: { id } }}>查看影厅</router-link>
          </div>
          /* tslint:enable */
        }
      }
    ]
  }

  get cachedMap() {
    return {
      status: makeMap(this.statusList),
      controlStatus: makeMap(this.controlStatusList),
      hallData: makeMap(this.hallDataStatusList),
      grade: makeMap(this.gradeList),
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        gradeName: cachedMap.grade[it.grade],
        statusText: cachedMap.status[it.status],
        controlStatusText: cachedMap.controlStatus[it.controlStatus],
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
        statusList = [],
        cstatusList = [],
        hallDataStatusList = [],
        gradeList = [],
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.statusList = statusList
      this.controlStatusList = cstatusList
      this.hallDataStatusList = hallDataStatusList
      this.gradeList = gradeList
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  edit(id: string) {
    const params: any = id ? { id } : {}
    this.$router.push({ name: 'client-corp-edit', params })
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
    this.doSearch()
  }

  @Watch('area')
  watchArea(val: number[]) {
    this.query.provinceId = val[0]
    this.query.cityId = val[1]
    this.query.countyId = val[2]
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

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
  /deep/ .poptip-edit {
    cursor: pointer;
    .ivu-icon {
      position: relative;
      top: -2px;
      left: 2px;
      color: @c-base;
      font-size: 18px;
    }
  }
  /deep/ .poptip-ok {
    margin-left: 5px;
  }
}

.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
</style>
