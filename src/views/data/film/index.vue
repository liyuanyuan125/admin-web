<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.name" placeholder="影片名称" class="input input-id"/>
        <DatePicker type="daterange" v-model="query.showTime" placement="bottom-end" placeholder="中国上映时间" class="input" style="width: 200px"></DatePicker>
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </form>

      <div class="acts">
        <Button type="success" @click="edit()">新建影片</Button>
      </div>
    </div>
    <Table  :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table"></Table>

    <div class="page-wrap" v-if="total > 0">
      <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
    <DlgEdit  ref="addOrUpdate" @refreshDataList="reloadSearch" v-if="addOrUpdateVisible" />
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
import { slice, clean } from '@/fn/object'
import { numberify, numberKeys } from '@/fn/typeCast'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import { queryList, updateControlStatus, updateStatus, updateSpecialId, reda, syncData } from '@/api/film'
import { toThousands } from '@/util/dealData'
import PartPoptipEdit from '../cinema/partPoptipEdit.vue'
import InputEdit from './inputEdit.vue'
import DlgEdit from './dlgEdit.vue'
import { loading, toast } from '@/ui/modal'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormat = 'YYYY-MM-DD'

const defQuery = {
  id: null,
  name: '',
  showTime: [],
  pageIndex: 1,
  pageSize: 20,
}

@Component({
  components: {
    DlgEdit,
    PartPoptipEdit,
    InputEdit
  }
})
export default class Main extends View {
  query = { ...defQuery }
  rolads = false
  oldQuery: any = {}
  editOne: any = null
  loading = false
  addOrUpdateVisible = false
  list: any[] = []
  total = 0

  categoryList = []
  controlList = []

  get columns() {
    return [
      {
        title: '序号',
        key: 'id',
        width: 80,
        align: 'center',
        render: (hh: any, { row : { id } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class="row-hidden" title={id}>{id}</div>
          /* tslint:enable */
        }
      },
      { title: 'MtimeID', key: 'mtimeId', width: 100, align: 'center' },
      {
        title: '专资ID',
        key: 'specialId',
        width: 80,
        align: 'center',
        render: (hh: any, { row: { id, specialId } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const value = {
              id,
              text: specialId,
              value: specialId,
          }
          return <InputEdit v-model={value} on-change={this.codeStatus.bind(this)}/>
          /* tslint:enable */
        }
      },
      {
        title: '影片名称',
        key: 'name',
        width: 90,
        align: 'center',
        render: (hh: any, { row: {id, name, englishName} }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const names = name || englishName
          return <div class="row-acts row-hidden">
            <router-link to={{name: 'data-film-detail', params: { id }}}>{names}</router-link>
          </div>
          /* tslint:enable */
        }
      },
      {
        title: '中国上映时间', // tslint:disable-line
        key: 'openTime',
        width: 180,
        align: 'center',
        render: (hh: any, { row : { openTime } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const html = moment(openTime).format(timeFormat)
          return <span v-html={html}></span>
          /* tslint:enable */
        }
      },
      {
        title: '今日票房', // tslint:disable-line
        key: 'todayBox',
        width: 90,
        align: 'center',
        render: (hh: any, { row : { todayBox } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const add = toThousands(todayBox)
          return <span>{add}</span>
          /* tslint:enable */
        }
      },
      {
        title: '累计票房', // tslint:disable-line
        key: 'sumBox',
        width: 80,
        align: 'center',
        render: (hh: any, { row : { sumBox } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const sun = toThousands(sumBox)
          return <span class="row-hidden" title = { sun }>{sun}</span>
          /* tslint:enable */
        }
      },
      {
        title: '演员', // tslint:disable-line
        key: 'performers',
        width: 80,
        align: 'center',
        render: (hh: any, { row : { performers } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class="row-hidden" title = { performers }>
            { performers.join(',') }
          </div>
          /* tslint:enable */
        }
      },
      {
        title: '导演', // tslint:disable-line
        key: 'director',
        width: 80,
        align: 'center'
      },
      {
        title: '产地', // tslint:disable-line
        key: 'fromPlace',
        width: 80,
        align: 'center'
      },
      {
        title: '类型', // tslint:disable-line
        key: 'type',
        width: 80,
        align: 'center',
        render: (hh: any, { row : { type } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class="row-hidden">
            <span title = { type }>{ type.join(',') }</span>
          </div>
          /* tslint:enable */
        }
      },
      {
        title: '分类', // tslint:disable-line
        key: 'categoryName',
        width: 100,
        align: 'center',
        render: (hh: any, { row: { id, categoryName, categoryCode } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const value = {
              id,
              key: categoryCode,
              text: categoryName,
              list: this.categoryList,
          }
          return <PartPoptipEdit v-model={value}
              on-change={this.editStatus.bind(this)}/>
          /* tslint:enable */
        }
      },
      {
        title: '控制状态', // tslint:disable-line
        key: 'controlStatus',
        width: 80,
        align: 'center',
        render: (hh: any, { row: { id, controlStatusString, controlStatus } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const value = {
              id,
              key: controlStatus,
              text: controlStatusString,
              list: this.controlList.slice(1),
          }
          return <PartPoptipEdit v-model={value}
              on-change={this.editControlStatus.bind(this)}/>
          /* tslint:enable */
        }
      },
      {
        title: '操作', // tslint:disable-line
        key: 'action',
        width: 80,
        align: 'center',
        render: (hh: any, { row: { mtimeId } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class='row-acts'>
            <a on-click={this.reloads.bind(this, mtimeId)}>刷新</a>
          </div>
          /* tslint:enable */
        }
      }
    ]
  }

  get cachedMap() {
    return {
      categoryList: makeMap(this.categoryList),
      controlList: makeMap(this.controlList)
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        category: cachedMap.categoryList[it.categoryName],
      }
    })
    return list
  }

  mounted() {
    const urlQuery = slice(urlParam(), Object.keys(defQuery))
    this.query = numberify({ ...defQuery, ...urlQuery }, numberKeys(defQuery))
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

  async editStatus({ id, key: newStatus, showLoading }: any) {

    const item = this.list.find(it => it.id == id)
    if (item && item.categoryCode != newStatus) {
      try {
        showLoading()
        await updateStatus(id, newStatus)
        item.categoryCode = newStatus
        item.categoryName = this.cachedMap.categoryList[newStatus]
      } catch (ex) {
        this.handleError(ex)
      }
    }
  }
  async codeStatus({ id, value: newStatus, showLoading }: any) {
    const item = this.list.find(it => it.id == id)
    if (item && item.categoryCode != newStatus) {
      try {
        showLoading()
        await updateSpecialId(id, newStatus)
        item.specialId = newStatus
      } catch (ex) {
        this.handleError(ex)
      }
    }
  }
  async editControlStatus({ id, key: newStatus, showLoading }: any) {
    const items = this.list.find(it => it.id == id)
    if (items && items.controlStatus != newStatus) {
      try {
        showLoading()
        await updateControlStatus(id, newStatus)
        items.controlStatus = newStatus
        items.controlStatusString = this.cachedMap.controlList[items.controlStatus]
      } catch (ex) {
        this.handleError(ex)
      }
    }
  }

  async doSearch() {
    if (this.loading) {
      return
    }
    this.updateUrl()
    this.query.pageIndex = 1
    this.oldQuery = { ...this.query }
    this.loading = true
    const startTime = !this.query.showTime[0] ? '' : new Date(this.query.showTime[0]).getTime()
    const endTime = !this.query.showTime[1] ? '' : new Date(this.query.showTime[1]).getTime()
    const query = clean({
      startTime,
      endTime,
      ...this.query
    })
    delete query.showTime
    try {
      const { data: {
        items: list,
        totalCount: total,
        categoryList = [],
        controlStatusList = [],
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.categoryList = categoryList
      this.controlList = controlStatusList
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  // 新增 / 修改
  edit() {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init()
    })
  }

  async reloads(mtimeId: any) {
    const myThis: any = this
    try {
        myThis.$Spin.show()
        const res = await syncData (mtimeId, 1)
        this.$Message.success({
        content: `刷新成功`,
        })
        myThis.$Spin.hide()
        if (this.query.pageIndex != 1) {
          this.query.pageIndex = 1
          return
        }
        this.doSearch()
    } catch (ex) {
      this.handleError(ex)
      myThis.$Spin.hide()
    }
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
  /deep/ .aptitude-status-popular {
    color: #ed4014;
  }
  /deep/ .row-hidden {
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/ .aptitude-status-super {
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
