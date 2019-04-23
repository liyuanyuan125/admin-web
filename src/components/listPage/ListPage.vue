<template>
  <div class="list-page">
    <slot name="act-bar">
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <component
            v-for="it in normalFilter"
            v-model="query[it.name]"
            :is="it.component"
            :key="it.name"
            :class="it.class"
            :style="it.style"
            :placeholder="it.placeholder"
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
    </slot>

    <Table
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      border
      stripe
      disabled-hover
      size="small"
      class="table"
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
        />
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { MapType, AjaxResult } from '@/util/types'
import {
  Filter,
  normalizeFilter,
  ColumnExtra,
  normalizeColumns,
  ListMapParam
} from './types'
import { devInfo, devError } from '@/util/dev'
import { toMap } from '@/fn/array'
import { clean } from '@/fn/object'
import { defaultParams, dealParams } from '@/util/param'

const makeMap = (list: any[]) => toMap(list, 'key')

@Component
export default class ListPage extends Mixins(ViewBase, UrlManager) {
  /** 加载列表的请求函数 */
  @Prop({ type: Function, required: true }) fetch!: (query?: any) => Promise<AjaxResult>

  /** 查询条件 */
  @Prop({ type: Array, default: () => [] }) filters!: Filter[]

  /** 查询条件或表格中要用到的枚举 Key 列表，将从 fetch 返回的 data 中提取 */
  @Prop({ type: Array, default: () => [] }) enums!: string[]

  /** 增强的列配置，增加了一些字段，参见 ColumnExtra 类型 */
  @Prop({ type: Array, default: () => [] }) columns!: ColumnExtra[]

  /** 列表数据项加工函数 */
  @Prop({ type: Function }) listMap!: (item: any, param: ListMapParam) => any

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
  query: any = {}

  // 上一次查询参数
  oldQuery: any = {}

  // 是否加载中
  loading = false

  // 数据列表
  list: any[] = []

  // 数据总数
  total = 0

  // 枚举类型列表
  enumType: MapType<any[]> = {}

  // 枚举类型 Map，key 为去掉后置 List 后的枚举名称
  get enumMap() {
    return Object.keys(this.enumType).reduce((map: any, it) => {
      const name = it.replace(/List$/, '')
      map[name || it] = makeMap(this.enumType[it])
      return map
    }, {})
  }

  // 根据列配置 columns，规范化后，生成真正的，传给 iview Table 组件的 columns
  get tableColumns() {
    const result = normalizeColumns(this.columns, {
      scopedSlots: this.$scopedSlots,
      enumType: this.enumType,
      enumMap: this.enumMap,
      list: this.list,
      handleError: this.handleError.bind(this)
    })
    return result
  }

  // 加工 table 数据，此处用到 listMap，以便对数据进行特殊处理
  get tableData() {
    const map = this.listMap || ((item: any) => item)
    const param = { enumMap: this.enumMap }
    const list = (this.list || []).map(it => map(it, param))
    return list
  }

  mounted() {
    this.updateQueryByParam()
  }

  /**
   * 请求列表数据，明确公开，可供外部组件调用
   */
  public async update() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.updateUrl()

    this.loading = true
    const query = dealParams(this.filters, this.query)
    try {
      const { data } = await this.fetch(query)

      this.list = data.items || []
      this.total = data.totalCount || 0

      const enumType = this.enums.reduce(
        (map, key) => {
          map[key] = data[key] || []
          return map
        },
        {} as MapType<any[]>
      )
      this.enumType = enumType
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }

    this.update()
  }
}
</script>

<style lang="less" scoped>
@import '../../site/lib.less';

.list-page {
  margin-bottom: 88px;
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
  margin: 20px 0;
  text-align: center;
}
</style>
