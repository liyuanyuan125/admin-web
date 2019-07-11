<template>
  <Select
    v-model="model"
    filterable
    clearable
    remote
    :remote-method="search"
    :loading="loading"
    class="remote-select"
    v-bind="$attrs"
  >
    <Option v-for="(it, i) in list" :key="i" :value="it.id">{{it.name}}</Option>
  </Select>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import LazyInput from '@/components/LazyInput'

import { IdName, Fetch } from './types'

@Component({
  components: {
    LazyInput
  }
})
export default class RemoteSelect extends ViewBase {
  @Prop({ type: [ Number, String ] }) value!: number | string

  @Prop({ type: Function, required: true }) fetch!: Fetch

  model: number | string = this.value

  loading = false

  list: IdName[] = []

  async search(query: string) {
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

  @Watch('value')
  watchValue(value: number | string) {
    this.model = value
  }

  @Watch('model')
  watchMode(value: number | string) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
</style>

