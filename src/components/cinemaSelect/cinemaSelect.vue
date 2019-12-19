<template>
  <RemoteSelect
    v-model="model"
    :fetch="fetch"
    :backfill="backfill"
    placeholder="输入影院名搜索"
    ref="ui"
  />
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import RemoteSelect from '@/components/remoteSelect'
import { queryList } from './data'
import { clean } from '@/fn/object'

@Component({
  components: {
    RemoteSelect
  }
})
export default class CinemaSelect extends ViewBase {
  @Prop({ type: Number }) value!: number

  /**
   * 附加查询条件，若要去掉某个条件，设置其为 null 即可，例如
   * 设置 { controlStatus: null }，即能去掉条件 controlStatus
   */
  @Prop({ type: Object, default: () => ({}) }) query!: object

  model = 0

  async fetch(keyword: string) {
    const query = clean({
      query: keyword,
      controlStatus: 1,
      pageIndex: 1,
      pageSize: 88,
      ...this.query
    })
    const list = await queryList(query)
    // 若现有列表中，没有找到已选择的影院，则清空
    const foundItem = list.find(it => it.id == this.model)
    if (foundItem == null) {
      this.model = 0
    }
    return list
  }

  async backfill(id: number) {
    const list = await queryList({ ids: id })
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
