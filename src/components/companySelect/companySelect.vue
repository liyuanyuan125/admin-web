<template>
  <RemoteSelect
    v-model="model"
    :fetch="fetch"
    :backfill="backfill"
    placeholder="输入公司名搜索"
    class="company-select"
    v-bind="$attrs"
    ref="ui"
  />
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import RemoteSelect from '@/components/remoteSelect'
import { queryList } from './data'
import { MapType } from '@/util/types'

const defaultQuery: MapType<any> = {
  status: 1,
}

@Component({
  components: {
    RemoteSelect
  }
})
export default class CompanySelect extends ViewBase {
  @Prop({ type: Number }) value!: number

  // 附加查询条件，参见：https://yapi.aiads-dev.com/project/34/interface/api/287
  @Prop({ type: Object, default: () => ({}) }) query!: MapType<any>

  model: number = 0

  async fetch(keyword: string) {
    const query = {
      ...defaultQuery,
      ...this.query,
      query: keyword,
      pageIndex: 1,
      pageSize: 88,
    }
    const list = await queryList(query)
    // 若现有列表中，没有找到已选择的影院，则清空
    const foundItem = list.find(it => it.id == this.model)
    if (foundItem == null) {
      this.model = 0
    }
    return list
  }

  async backfill(id: number) {
    const list = await queryList({ companyId: id })
    return list
  }

  @Watch('value', { immediate: true })
  watchValue(value: number) {
    this.model = value
  }

  @Watch('model')
  watchMode(value: number) {
    this.$emit('input', value)
  }

  @Watch('query', { deep: true })
  watchQuery() {
    // 当条件改变时，重新刷新
    const ui = this.$refs.ui as RemoteSelect
    ui.refresh()
  }
}
</script>

<style lang="less" scoped>
</style>
