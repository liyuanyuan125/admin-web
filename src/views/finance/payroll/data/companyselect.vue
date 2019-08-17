<template>
  <RemoteSelect v-model="model" :fetch="fetch" placeholder="资源方公司名称" ref="ui"/>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import RemoteSelect from '@/components/remoteSelect'
import { queryList } from './api'
import { companylist } from './api'

@Component({
  components: {
    RemoteSelect
  }
})
export default class CinemaSelect extends ViewBase {
  @Prop({ type: Number }) value!: number

  // 附加查询条件
  @Prop({ type: Object, default: () => ({}) }) query!: object

  model: number = 0

  async fetch(keyword: string) {
    const query = {
      ...this.query,
      query: keyword,
      typeCode: 'resource',
      pageIndex: 1,
      pageSize: 88,
    }
    const list = await companylist(query)
    // 若现有列表中，没有找到已选择的影院，则清空
    const foundItem = list.find((it: any) => it.id == this.model)
    if (foundItem == null) {
      this.model = 0
    }
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
