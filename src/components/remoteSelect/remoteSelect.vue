<template>
  <Select
    v-model="model"
    filterable
    clearable
    remote
    :remote-method="search"
    :loading="loading"
    :label="backfillLabel"
    class="remote-select"
    v-bind="$attrs"
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
import LazyInput from '@/components/LazyInput'
import { MapType } from '@/util/types'
import { IdName, Fetch, Backfill } from './types'
import { devLog } from '@/util/dev'

@Component({
  components: {
    LazyInput
  }
})
export default class RemoteSelect extends ViewBase {
  @Prop({ type: [ Number, String ] }) value!: number | string

  @Prop({ type: Function, required: true }) fetch!: Fetch

  @Prop({ type: Function }) backfill!: Backfill

  model: number | string = 0

  loading = false

  list: IdName[] = []

  backfillLabel = ''

  inBackfill = false

  async search(query: string) {
    // iview 对 select 的 remote 实现有点问题，第一次会把 model 当搜索词
    if (this.inBackfill) {
      devLog(`==> [search] inBackfill: ${query}`)
      return
    }

    if (query == this.backfillLabel) {
      devLog(`==> [search] backfillLabel: ${query}`)
      this.backfillLabel = ''
      return
    }

    const keyword = query.trim()
    if (keyword) {
      this.loading = true
      try {
        const list = await this.fetch(keyword)
        this.list = list
      } catch (ex) {
        this.handleError(ex)
      } finally {
        this.loading = false
      }
    } else {
      this.list = []
    }
  }

  async dealBackfill(id: number | string) {
    this.inBackfill = true
    const isString = typeof id === 'string'
    try {
      const list = await this.backfill(id) || []
      this.list = list.map(it => ({
        id: isString ? String(it.id) : parseFloat(it.id as string),
        name: it.name
      }))
      this.backfillLabel = list[0].name || ''
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.inBackfill = false
    }
  }

  @Watch('value', { immediate: true })
  watchValue(value: number | string) {
    this.model = value

    // 处理回填
    if (value) {
      const item = (this.list || []).find(it => it.id == value)
      item == null && this.backfill && this.dealBackfill(value)
    }
  }

  @Watch('model')
  watchMode(value: number | string) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
</style>

