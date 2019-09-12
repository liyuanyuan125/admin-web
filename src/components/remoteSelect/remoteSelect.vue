<template>
  <Select
    v-model="model"
    filterable
    clearable
    transfer
    remote
    :remote-method="search"
    :loading="loading"
    :label="backfillLabel"
    :multiple="multiple"
    class="remote-select"
    v-bind="$attrs"
    ref="select"
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
import Vue from 'vue'
import { debounce, keyBy, get } from 'lodash'

@Component({
  components: {
    LazyInput
  }
})
export default class RemoteSelect extends ViewBase {
  @Prop({ type: [ Number, String, Array ] }) value!: number | string | Array<number | string>

  @Prop({ type: Function, required: true }) fetch!: Fetch

  @Prop({ type: Function }) backfill!: Backfill

  @Prop({ type: Boolean, default: false }) multiple!: boolean

  @Prop({ type: Array, default: [] }) initList!: IdName[]

  get select() {
    const select = this.$refs.select as Vue
    return select
  }

  model = this.value

  loading = false

  list: IdName[] = this.initList

  backfillLabel: string | string[] = ''

  inBackfill = false

  // 记录下最后的搜索关键词
  lastQuery = ''

  fetchTimer: any = null

  // 提供刷新的方法，以便可以重新执行 fetch
  public refresh() {
    this.search(this.lastQuery)
  }

  async search(query: string) {
    // iview 对 select 的 remote 实现有点问题，第一次会把 model 当搜索词
    if (this.inBackfill) {
      // devLog(`==> [search] inBackfill: ${query}`)
      return
    }

    if (query == this.backfillLabel) {
      // devLog(`==> [search] backfillLabel: ${query}`)
      // this.backfillLabel = ''
      return
    }

    const keyword = query.trim()

    // 在列表中查找，如果恰好找到，就不用调用接口了
    if (this.list.find(it => it.name == keyword && it.id == this.value) != null) {
      // devLog(`==> [search] exists: ${keyword}`)
      return
    }

    this.lastQuery = keyword

    this.fetchTimer && this.fetchTimer.cancel()
    this.fetchTimer = debounce(async () => {
      if (keyword) {
        this.loading = true
        try {
          const list = await this.fetch(keyword)
          this.list = list
          this.$nextTick(this.fixInputValue)
        } catch (ex) {
          this.handleError(ex)
        } finally {
          this.loading = false
        }
      } else {
        this.list = []
      }
    }, 588)
    this.fetchTimer()
  }

  // 解决搜索关键字被清空的问题
  fixInputValue() {
    const el = this.select.$el
    const input = el.querySelector('.ivu-select-input') as HTMLInputElement
    const keyword = this.lastQuery
    if (input.value === '' && keyword) {
      devLog('[RemoteSelect] keyword is clear, refill it')
      input.value = keyword
    }
  }

  async dealBackfill(id: number | string) {
    this.inBackfill = true
    const isString = typeof id === 'string'
    try {
      const list = await this.backfill(id) || []
      this.list = list.map(it => ({
        id: isString ? String(it.id) : +it.id,
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
  watchValue(value: number | string | Array<number | string>) {
    this.model = value

    // 处理回填，不对 multiple 进行回填
    if (value && !Array.isArray(value)) {
      const item = (this.list || []).find(it => it.id == value)
      item == null && this.backfill && this.dealBackfill(value)
    }
  }

  @Watch('model')
  watchMode(value: number | string | Array<number | string>) {
    this.$emit('input', value)
  }

  @Watch('initList', { immediate: true, deep: true })
  watchInitList(value: IdName[]) {
    if (value && value.length > 0) {
      // 手动触发 model 更新，以便回填
      const model = this.model
      this.model = Array.isArray(this.model) ? [] : ''
      this.$nextTick(() => this.model = model)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
