<template>
  <div class="list-page">
    <slot name="act-bar">
      <div class="act-bar flex-box">
        <form
          class="form flex-1"
          @submit.prevent
          v-if="normalFilter && normalFilter.length > 0"
        >
          <component
            v-for="it in normalFilter"
            v-model="query[it.name]"
            :is="it.component"
            :key="it.name"
            :class="it.class"
            :style="it.style"
            :placeholder="it.placeholder"
            v-bind="{
              enumList: filterEnumMap[it.name],
              ...it.props
            }"
            v-auth="it.auth"
          >
            <Option
              v-for="sub in enumType[it.enumKey]"
              :key="sub.key"
              :value="sub.key"
              v-if="it.type == 'select'"
            >{{sub.text}}</Option>
          </component>

          <Button type="default" @click="resetQuery()" class="btn-reset">清空</Button>
        </form>

        <div class="acts">
          <slot name="acts"></slot>
        </div>
      </div>
      <div class="act-bar">
        <slot name="acts-2"></slot>
      </div>
    </slot>

    <Table
      :columns="tableColumns"
      :data="list"
      :loading="loading"
      border
      stripe
      disabled-hover
      size="small"
      class="table"
      @on-selection-change="selectionChange"
      ref="table"
    />

    <slot name="page-wrap">
      <div class="page-wrap" v-if="total > 0">
        <Page
          :total="total"
          :current="query.pageIndex"
          :page-size="query.pageSize"
          :page-size-opts="[10, 20, 50, 100]"
          @on-change="page => query.pageIndex = page"
          @on-page-size-change="pageSize => query.pageSize = pageSize"
          show-total
          show-sizer
          show-elevator
          v-bind="pageProps"
        />
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { MapType, KeyTextControlStatus, isKeyTextEnum } from '@/util/types'
import {
  Filter,
  normalizeFilter,
  ColumnExtra,
  normalizeColumns,
  ListFetchResult,
  ListFetchData,
  listFetchDataToResult,
} from './types'
import { devInfo, devError } from '@/util/dev'
import { toMap } from '@/fn/array'
import { clean } from '@/fn/object'
import { defaultParams, dealParams } from '@/util/param'
import { uniq, difference, union, isEqual } from 'lodash'
import { filterByControlStatus } from '@/util/dealData'

const makeMap = (list: any[]) => toMap(list, 'key')

@Component
export default class ListPage extends Mixins(ViewBase, UrlManager) {
  /**
   * 加载列表的请求函数
   * NOTE: 由于历史原因，采用的是上面的 ListFetchResult，但后来发现，直接用 items, totalCount 更加
   * 方便，故而，有以下新的数据结构，组件本身屏蔽这种差异，提供一致性、无缝衔接式的体验
   */
  @Prop({ type: Function, required: true })
  fetch!: (query?: any) => Promise<ListFetchData | ListFetchResult>

  /** 查询条件 */
  @Prop({ type: Array, default: () => [] }) filters!: Filter[]

  /** 查询条件或表格中要用到的枚举 Key 列表，将从 fetch 返回的 data 中提取 */
  @Prop({ type: Array, default: () => [] }) enums!: string[]

  /** 增强的列配置，增加了一些字段，参见 ColumnExtra 类型 */
  @Prop({ type: Array, default: () => [] }) columns!: ColumnExtra[]

  /** 每一项的 id 字段的名称，默认为 id */
  @Prop({ type: String, default: 'id' }) idKey!: string

  /**
   * 列可选择，若该字段为 true，则会触发
   * selectionChange 事件，并且提供 selectAll 方法
   */
  @Prop({ type: Boolean, default: false }) selectable!: boolean

  /**
   * 已选择的项的 ids（不限于当前页，所有页），支持通过 .sync 双向绑定
   */
  @Prop({ type: Array, default: () => [] }) selectedIds!: Array<number | string>

  /**
   * 禁用选择的 id 列表
   */
  @Prop({ type: Array, default: () => [] }) disabledIds!: Array<number | string>

  /**
   * 禁用 url manager 的行为
   */
  @Prop({ type: Boolean, default: false }) disableUrlManager!: boolean

  /**
   * Page 属性配置
   */
  @Prop({ type: Object, default: () => ({}) }) pageProps!: object

  allSelectedIds = this.selectedIds

  // 对 Filter 进行规范化处理
  get normalFilter() {
    const result = normalizeFilter(this.filters)
    return result
  }

  // 根据 filters 中的配置，生成默认查询条件
  get defQuery() {
    const result = defaultParams(this.filters)
    return result
  }

  // 查询参数
  public query: any = {}

  // 上一次查询参数
  oldQuery: any = {}

  // 是否加载中
  loading = false

  // 数据列表
  list: any[] = []

  // 数据总数
  total = 0

  // 新版的筛选枚举，旧版会被慢慢重构掉
  filterEnumMap: MapType<KeyTextControlStatus[]> = {}

  // 新版的列表枚举，旧版会被慢慢重构掉
  listEnumMap: MapType<KeyTextControlStatus[]> = {}

  // 旧版枚举类型列表，慢慢优化掉
  enumType: MapType<any[]> = {}

  // 旧版枚举类型 Map，key 为去掉后置 List 后的枚举名称，慢慢优化掉
  get enumMap() {
    return Object.keys(this.enumType).reduce((map: any, it) => {
      const name = it.replace(/List$/, '')
      map[name || it] = makeMap(this.enumType[it])
      return map
    }, {})
  }

  // 根据列配置 columns，规范化后，生成真正的，传给 iview Table 组件的 columns
  get tableColumns() {
    const columns = normalizeColumns(this.columns, {
      scopedSlots: this.$scopedSlots,
      enumType: this.enumType,
      enumMap: this.enumMap,
      list: this.list,
      listEnumMap: this.listEnumMap,
      handleError: this.handleError.bind(this)
    })

    const result = this.selectable ? [{
      type: 'selection',
      width: 40,
      align: 'center'
    } as ColumnExtra].concat(columns) : columns

    return result
  }

  mounted() {
    this.disableUrlManager ? this.updateQuery() : this.updateQueryByParam()
  }

  // 简单包装一下，以便适应两种数据结构
  async fetchWrap(query: any) {
    const res = await this.fetch(query)
    return listFetchDataToResult(res)
  }

  /**
   * 请求列表数据，明确公开，可供外部组件调用
   */
  public async update() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.disableUrlManager || this.updateUrl()

    this.loading = true
    const query = dealParams(this.filters, this.query, { cleanDefault: true })
    try {
      const { data } = await this.fetchWrap(query)
      this.total = data.totalCount || 0
      this.updateList(data.items || [])

      // TODO: 老式枚举，基于 enums 属性，将慢慢优化掉
      const enumType = this.enums.reduce(
        (map, key) => {
          map[key] = data[key] || []
          return map
        },
        {} as MapType<any[]>
      )
      this.enumType = enumType

      // 新版的 enumMap，自动判断，不再依赖配置中的 enumKey
      // TODO: 可以清理对 enumKey 的提升代码
      const enumList = Object.entries(data).filter(([key, list]) => isKeyTextEnum(list))

      // 筛选条件使用有效的枚举（去掉废弃的值）
      const filterEnumMap = enumList.reduce(
        (map, [name, list]) => {
          map[name] = filterByControlStatus(list)
          return map
        },
        {} as MapType<KeyTextControlStatus[]>
      )
      this.filterEnumMap = filterEnumMap

      // 列表使用全部枚举（废弃的值也要保留）
      const listEnumMap = enumList.reduce(
        (map, [name, list]) => {
          map[name] = list
          return map
        },
        {} as MapType<KeyTextControlStatus[]>
      )
      this.listEnumMap = listEnumMap
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  updateList(items?: any[]) {
    const list = items || this.list || []
    const idKey = this.idKey
    const selectable = this.selectable
    const selectedMap = toMap(this.selectedIds)
    const disabledMap = toMap(this.disabledIds)
    this.list = list.map(it => {
      return {
        ...it,
        _checked: selectable ? it[idKey] in selectedMap : false,
        _disabled: selectable ? it[idKey] in disabledMap : false,
      }
    })
  }

  // 全选
  selectionChange(selectedList: any[]) {
    this.$emit('selectionChange', selectedList)

    const idKey = this.idKey
    const pageIds = (this.list || []).map(it => it[idKey])
    const ids = (selectedList || []).map(it => it[idKey])
    const diffIds = difference(this.allSelectedIds, pageIds)
    const allSelectedIds = union(diffIds, ids)
    this.allSelectedIds = allSelectedIds
  }

  /**
   * 全选表格内的当前页的所有行
   * @param enable 是否选中
   */
  public selectAll(enable = true) {
    const table = this.$refs.table as any
    table && table.selectAll(enable)
  }

  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.update()
  }

  @Watch('selectedIds')
  watchSelectedIds(value: Array<number | string>) {
    const ids = value || []
    if (!isEqual(ids, this.allSelectedIds)) {
      this.allSelectedIds = ids
      this.updateList()
    }
  }

  @Watch('allSelectedIds')
  watchAllSelectedIds(value: Array<number | string>) {
    const uniqIds = uniq(value)
    // 当 uniqIds 的长度与 value 相同时，说明没有重复元素，
    // 那么应该直接使用传入的 value，否则会导致无限循环
    const ids = uniqIds.length == value.length ? value : uniqIds
    this.$emit('update:selectedIds', ids)
  }

  @Watch('disabledIds')
  watchDisabledIds() {
    this.updateList()
  }
}
</script>

<style lang="less" scoped>
@import '../../site/lib.less';

.list-page {
  min-height: 288px;
  margin-bottom: 88px;
}

.act-bar ~ .act-bar:not(:empty) {
  margin-top: 15px;
}

.ui-filter,
.btn-search,
.btn-reset {
  margin-left: 8px;
}
.ui-filter:first-child {
  margin-left: 0;
}

.table {
  margin-top: 17px;
  /deep/ .ivu-table-cell {
    padding-left: 4px;
    padding-right: 4px;
    & > span,
    & > div {
      &:empty::before {
        content: '-';
      }
    }
  }
  /deep/ .row-acts > a {
    margin: 0 4px;
  }
}

.page-wrap {
  margin: 20px 0;
  text-align: center;
}
</style>
