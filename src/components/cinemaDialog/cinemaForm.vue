<template>
  <div class="index-page">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      :selectedIds.sync="selectedIds"
    >
      <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          :to="addToList"
        >添加到列表</Button>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from './data'

@Component({
  components: {
    ListPage
  }
})
export default class CinemaForm extends ViewBase {
  fetch = queryList

  get filters(): Filter[] {
    return [
      {
        name: 'query',
        defaultValue: '',
        type: 'input',
        width: 288,
        placeholder: '输入影院专资编码或名称进行搜索'
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
        defaultValue: 20
      }
    ]
  }

  get columns() {
    return [
      { title: '专资编码', key: 'code', minWidth: 90 },
      { title: '名称', key: 'shortName', minWidth: 90 },
    ] as ColumnExtra[]
  }

  selectedIds: number[] = []

  addToList() {
    const ids = this.selectedIds || []
    debugger
  }
}
</script>

<style lang="less" scoped>
</style>
