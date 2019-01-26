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
          <Option v-for="it in enumType.controlStatusList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
        <Select v-model="query.hallDataStatus" placeholder="影厅数据" clearable>
          <Option v-for="it in enumType.hallDataStatusList" :key="it.key"
            :value="it.key">{{it.text}}</Option>
        </Select>
        <Button type="default" @click="resetQuery()" class="btn-reset">清空</Button>
      </form>
      <div class="acts">
        <Button type="success" icon="md-add-circle" @click="edit(0)">新建影院</Button>
      </div>
    </div>

    <Table :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table">
      <template slot="chainName" slot-scope="{ row: { chainControlStatus, chainName } }">
        <Deprecated :controlStatus="chainControlStatus">{{chainName}}</Deprecated>
      </template>

      <template slot="gradeName" slot-scope="{ row: { gradeControlStatus, gradeName } }">
        <Deprecated :controlStatus="gradeControlStatus">{{gradeName}}</Deprecated>
      </template>

      <template slot="status" slot-scope="{ row: { statusModel } }">
        <PoptipSelect v-model="statusModel" @change="editStatus"/>
      </template>

      <template slot="controlStatus" slot-scope="{ row: { controlStatusModel } }">
        <PoptipSelect v-model="controlStatusModel" @change="editControlStatus"/>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link :to="{ name: 'data-cinema-hall', params: { id } }">查看影厅</router-link>
          <a @click="edit(id)">编辑</a>
        </div>
      </template>
    </Table>

    <div class="page-wrap" v-if="total > 0">
      <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>

    <DlgEdit v-model="dlgEditModel"  @done="dlgEditDone"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch, Mixins, Vue } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import { isEqual } from 'lodash'
import { queryList, updateStatus, updateControlStatus } from '@/api/cinema'
import AreaSelect from '@/components/AreaSelect.vue'
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import PoptipSelect from '@/components/PoptipSelect.vue'
import Deprecated from '@/components/Deprecated.vue'
import DlgEdit from './dlgEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'key')

@Component({
  components: {
    AreaSelect,
    CinemaChainSelect,
    PoptipSelect,
    Deprecated,
    DlgEdit,
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    name: '',
    chainId: 0,
    provinceId: 0,
    cityId: 0,
    countyId: 0,
    status: 0,
    controlStatus: 0,
    hallDataStatus: 0,
    pageIndex: 1,
    pageSize: 20,
  }

  query: any = {}

  oldQuery: any = {}

  loading = false
  list: any[] = []
  total = 0

  area: number[] = []

  dlgEditModel = {
    show: false,
    id: -1
  }

  enumType: any = {
    statusList: [],
    controlStatusList: [],
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
      { title: '序号', key: 'id', width: 70 },
      { title: '专资ID', key: 'code', width: 70 },
      { title: '影院名称', key: 'shortName', minWidth: 70 },
      { title: '院线', slot: 'chainName', width: 120 },
      { title: '省份', key: 'provinceName', width: 80 },
      { title: '城市', key: 'cityName', width: 80 },
      { title: '区县', key: 'countyName', width: 80 },
      { title: '级别', slot: 'gradeName', width: 60 },
      { title: '营业状态', slot: 'status', width: 70 },
      { title: '控制状态', slot: 'controlStatus', width: 75 },
      { title: '操作', slot: 'action', width: 108 }
    ]
    .map(it => ({ align: 'center', ...it }))
  }

  get tableData() {
    const enumMap = this.enumMap
    const list = (this.list || []).map((it: any) => {
      const gradeItem = enumMap.grade[it.gradeCode] || {}
      return {
        ...it,
        gradeName: gradeItem.text,
        gradeControlStatus: gradeItem.controlStatus,
        statusModel: {
          id: it.id,
          value: it.status,
          list: this.enumType.statusList,
        },
        controlStatusModel: {
          id: it.id,
          value: it.controlStatus,
          list: this.enumType.controlStatusList
        },
      }
    })
    return list
  }

  mounted() {
    this.updateQueryByParam()
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
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  edit(id: number) {
    this.dlgEditModel.id = id
    this.dlgEditModel.show = true
  }

  dlgEditDone() {
    this.fetch()
  }

  async editStatus({ id, value, showLoading, hideLoading }: any) {
    const item = this.list.find(it => it.id == id)
    try {
      showLoading()
      await updateStatus(id, value)
      item.status = value
    } catch (ex) {
      this.handleError(ex)
    } finally {
      hideLoading()
    }
  }

  async editControlStatus({ id, value, showLoading, hideLoading }: any) {
    const item = this.list.find(it => it.id == id)
    try {
      showLoading()
      await updateControlStatus(id, value)
      item.controlStatus = value
    } catch (ex) {
      this.handleError(ex)
    } finally {
      hideLoading()
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
  watchArea(val: number[]) {
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
