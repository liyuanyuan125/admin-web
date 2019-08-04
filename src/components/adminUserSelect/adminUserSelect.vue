<template>
  <Select
    v-model="model"
    filterable
    clearable
    transfer
    :loading="loading"
    placeholder="请选择或输入进行搜索"
    v-bind="$attrs"
    class="admin-user-select"
  >
    <Option
      v-for="(it, i) in list"
      :key="i"
      :value="it.id"
    >{{it.name}}</Option>
  </Select>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { MapType } from '@/util/types'
import { queryList } from './data'
import { IdName } from './types'

@Component
export default class AdminUserSelect extends ViewBase {
  @Prop({ type: Number }) value!: number

  model: number = 0

  loading = false

  list: IdName[] = []

  created() {
    this.fetch()
  }

  async fetch() {
    try {
      this.loading = true
      const list = await queryList({
        pageIndex: 1,
        pageSize: 888,
      })
      this.list = list

      // 若现有列表中，没有找到已选择的影院，则清空
      const foundItem = list.find(it => it.id == this.model)
      if (foundItem == null) {
        this.model = 0
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  @Watch('value', { immediate: true })
  watchValue(value: number) {
    this.model = value
  }

  @Watch('model')
  watchMode(value: number) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
</style>
