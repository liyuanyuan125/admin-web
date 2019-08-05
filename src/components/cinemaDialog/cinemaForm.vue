<template>
  <div class="cinema-form">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      selectable
      :selectedIds.sync="allSelectedIds"
      :disabledIds="disabledIds"
      v-bind="$attrs"
      v-on="$listeners"
      disableUrlManager
    >
      <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          @click="onAddToList"
          :disabled="ids.length == 0"
        >添加到列表{{ids.length > 0 ? `（已选 ${ids.length} 个）` : ''}}</Button>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from './data'
import { Cinema, AddToListEvent } from './types'
import { cloneDeep, difference, unionBy } from 'lodash'
import { devLog } from '@/util/dev'

@Component({
  components: {
    ListPage
  }
})
export default class CinemaForm extends ViewBase {
  /**
   * 已选择的项的 ids（不限于当前页，所有页），与 ListPage 不同，不支持双向绑定
   */
  @Prop({ type: Array, default: () => [] }) selectedIds!: number[]

  /**
   * 禁用选择的 id 列表
   */
  @Prop({ type: Array, default: () => [] }) disabledIds!: number[]

  allSelectedIds = this.selectedIds

  get filters(): Filter[] {
    return [
      {
        name: 'query',
        defaultValue: '',
        type: 'input',
        width: 328,
        placeholder: '输入影院专资编码或名称，回车搜索'
      },

      {
        name: 'status',
        defaultValue: 1,
      },

      {
        name: 'controlStatus',
        defaultValue: 1,
      },

      {
        name: 'pageIndex',
        defaultValue: 1
      },

      {
        name: 'pageSize',
        defaultValue: 10
      }
    ]
  }

  get columns() {
    return [
      { title: 'ID', key: 'id', width: 90 },
      { title: '专资编码', key: 'code', width: 120 },
      { title: '名称', key: 'shortName', align: 'left' },
    ] as ColumnExtra[]
  }

  get ids() {
    const selectedIds = this.allSelectedIds as number[] || []
    const disabledIds = this.disabledIds as number[] || []
    const ids = difference(selectedIds, disabledIds)
    return ids
  }

  list: Cinema[] = []

  selectedList: Cinema[] = []

  async fetch(query: any) {
    const data = await queryList(query)
    this.list = data.items || []
    return data
  }

  onAddToList() {
    const list = cloneDeep(this.selectedList)
    this.$emit('addToList', { list } as AddToListEvent)
  }

  @Watch('selectedIds', { immediate: true })
  watchSelectedIds(value: number[]) {
    this.allSelectedIds = value
  }

  @Watch('allSelectedIds')
  watchAllSelectedIds(value: number[]) {
    // 及时更新 selectedList，以免 list 失效
    const ids = this.ids
    const unionList = unionBy(this.list, this.selectedList, 'id')
    const list = cloneDeep(unionList.filter(it => ids.includes(it.id)))
    this.selectedList = list
  }
}
</script>

<style lang="less" scoped>
.cinema-form {
  /deep/ .list-page {
    margin-bottom: 0;
  }
  /deep/ .btn-reset {
    display: none;
  }
}
</style>
