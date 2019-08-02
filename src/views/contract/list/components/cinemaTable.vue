<template>
  <div class="cinema-table">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      disableUrlManager
    >
      <template slot="acts">
        <Button type="success" @on-click="selectCinema">选择影城</Button>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'

export interface CinemaItem {
  cinemaId: number
  cinemaName: string
  code: string
  cityId: number
  cityName: string
  cityGradeCode: string
  commonPrice: number
  trailerPrice: number
  accountBank: string
  accountName: string
  accountNumber: string
}

@Component({
  components: {
    ListPage
  }
})
export default class CinemaTable extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: CinemaItem[]

  get filters(): Filter[] {
    return [
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
      { title: '专资编码', key: 'code', minWidth: 90 },
      { title: '名称', key: 'shortName', minWidth: 90 },
    ] as ColumnExtra[]
  }

  fetch({ pageIndex: index, pageSize: size }: any) {
    const store = this.value || []
    const totalCount = store.length
    const items = store.slice((index - 1) * size, index * size)
    return {
      items,
      totalCount
    }
  }

  selectCinema() {
    debugger
  }
}
</script>

<style lang="less" scoped>
</style>
