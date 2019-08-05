<template>
  <div class="cinema-table">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      disableUrlManager
      ref="listPage"
    >
      <template slot="acts" v-if="!disabled">
        <Button type="success" @click="onSelect">选择影城</Button>
        <CinemaDialog
          v-model="dialogOpen"
          :selectedIds="allIds"
          :disabledIds="allIds"
          @addToList="onAddToList"
        />
      </template>

      <template slot="commonPrice" slot-scope="{ row: { cinemaId, commonPrice } }">
        <FormInputNumber
          :value="commonPrice"
          :disabled="disabled"
          @input="updateField(cinemaId, 'commonPrice', $event)"
        />
      </template>

      <template slot="trailerPrice" slot-scope="{ row: { cinemaId, trailerPrice } }">
        <FormInputNumber
          :value="trailerPrice"
          :disabled="disabled"
          @input="updateField(cinemaId, 'trailerPrice', $event)"
        />
      </template>

      <template slot="action" slot-scope="{ row: { cinemaId } }">
        <div class="row-acts">
          <a @click="remove(cinemaId)">删除</a>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import CinemaDialog, { AddToListEvent } from '@/components/cinemaDialog'
import { CancelableEvent } from '@/util/types'
import { FormInputNumber } from '@/components/editForm'

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
    ListPage,
    CinemaDialog,
    FormInputNumber
  }
})
export default class CinemaTable extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: CinemaItem[]

  @Prop({ type: Function }) filterCinema!: (item: any) => CinemaItem

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  model: CinemaItem[] = []

  get listPage() {
    return this.$refs.listPage as ListPage
  }

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
    const list = [
      { title: '影院名称', key: 'cinemaName', minWidth: 90 },
      { title: '专资编码', key: 'code', minWidth: 60 },
      { title: '所属城市', key: 'cityName', minWidth: 60 },
      { title: '城市等级', key: 'cityGradeCodeMappedText', minWidth: 60 },

      { title: '单人次结算价格（元/人次）', slot: 'commonPrice', minWidth: 90 },
      { title: '预告片单人次结算价格（元/人次）', slot: 'trailerPrice', minWidth: 90 },

      { title: '开户行', key: 'accountBank', minWidth: 90 },
      { title: '账户名', key: 'accountName', minWidth: 60 },
      { title: '账号', key: 'accountNumber', minWidth: 90 },
    ] as ColumnExtra[]

    !this.disabled && list.push({ title: '操作', slot: 'action', minWidth: 50 })

    return list
  }

  get allIds() {
    const ids = (this.value || []).map(it => it.cinemaId)
    return ids
  }

  dialogOpen = false

  fetch({ pageIndex: index, pageSize: size }: any) {
    const store = this.model || []
    const totalCount = store.length
    const items = store.slice((index - 1) * size, index * size)
    return {
      items,
      totalCount
    }
  }

  onAddToList({ list }: AddToListEvent) {
    const items = list.map(it => this.filterCinema({
      cinemaId: it.id,
      cinemaName: it.shortName,
      code: it.code,
      cityId: it.cityId,
      cityName: it.cityName,
      cityGradeCode: it.cityGradeCode,
    }))
    this.model = items.concat(this.value)
    this.listPage.update()
  }

  onSelect() {
    const evdata: CancelableEvent = { canceled: false }
    this.$emit('beforeSelect', evdata)
    evdata.canceled || (this.dialogOpen = true)
  }

  remove(id: number) {
    const index = this.model.findIndex(it => it.cinemaId == id)
    if (index > -1) {
      this.model.splice(index, 1)
      this.listPage.update()
    }
  }

  updateField(cinemaId: number, field: string, value: number) {
    const item = this.model.find(it => it.cinemaId == cinemaId) as any
    item && (item[field] = value)
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: CinemaItem[]) {
    this.model = value
  }

  @Watch('model', { deep: true })
  watchModel(value: CinemaItem[]) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.cinema-table {
  line-height: 1.5;
  /deep/ .list-page {
    margin-bottom: 0;
    min-height: auto;
  }
  /deep/ th,
  /deep/ td {
    padding: 6px 3px;
  }
}
</style>
