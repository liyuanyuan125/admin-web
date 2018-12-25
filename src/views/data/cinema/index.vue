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
        <Button type="default" @click="resetQuery" class="btn-reset">清空</Button>
      </form>
      <div class="acts">
        <Button type="success" icon="md-add-circle" @click="edit(0)">新建影院</Button>
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

    <div v-for="(it, i) in dlgEditList" :key="it.id">
      <DlgEdit v-model="dlgEditList[i]" @done="dlgEditDone" v-if="it.showDlgEdit"/>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch, Mixins } from 'vue-property-decorator'
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
import DlgEdit from './dlgEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'key')

@Component({
  components: {
    AreaSelect,
    CinemaChainSelect,
    PoptipSelect,
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

  // 编辑对话框列表
  dlgEditList: any[] = []

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
      { title: '序号', key: 'id', width: 70, align: 'center' },
      { title: '专资ID', key: 'code', width: 70, align: 'center' },
      { title: '影院名称', key: 'shortName', minWidth: 70, align: 'center' },
      {
        title: '院线',
        key: 'chainName',
        width: 120,
        align: 'center',
        render: (hh: any, { row: { chainControlStatus, chainName } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return chainControlStatus == 1
            ? <span>{chainName}</span>
            : <tooltip content="已下架" placement="top">
              <span class="deprecated">{chainName}</span>
            </tooltip>
          /* tslint:enable */
        }
      },
      { title: '省份', key: 'provinceName', width: 80, align: 'center' },
      { title: '城市', key: 'cityName', width: 80, align: 'center' },
      { title: '区县', key: 'countyName', width: 80, align: 'center' },
      {
        title: '级别',
        key: 'gradeName',
        width: 60,
        align: 'center',
        render: (hh: any, { row: { gradeCode, gradeName } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const gradeItem = this.enumMap.grade[gradeCode]
          return gradeItem == null || gradeItem.controlStatus == 1
            ? <span>{gradeName}</span>
            : <tooltip content="已下架" placement="top">
              <span class="deprecated">{gradeName}</span>
            </tooltip>
          /* tslint:enable */
        }
      },
      {
        title: '营业状态',
        width: 70,
        align: 'center',
        render: (hh: any, { row: { id, status, statusText } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const value = {
            id,
            text: statusText,
            value: status,
            list: this.enumType.statusList,
          }
          return <PoptipSelect v-model={value}
            on-change={this.editStatus.bind(this)}/>
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
            text: controlStatusText,
            value: controlStatus,
            list: this.enumType.controlStatusList,
          }
          return <PoptipSelect v-model={value}
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
        gradeName: (enumMap.grade[it.gradeCode] || {}).text,
        statusText: (enumMap.status[it.status] || {}).text,
        controlStatusText: (enumMap.controlStatus[it.controlStatus] || {}).text,
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

      this.dlgEditList = this.list.map((it: any) => ({
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
    let item = this.dlgEditList.find(it => it.id == id)
    if (item == null && id == 0) {
      item = { id: 0, showDlgEdit: true }
      this.dlgEditList.push(item)
    }
    item && (item.showDlgEdit = true)
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
  /deep/ .deprecated {
    color: #ed4014;
  }
}

.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
</style>
