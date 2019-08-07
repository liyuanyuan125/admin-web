<template>
  <Tabs
    v-model="model"
    type="card"
    class="tab-nav"
    v-bind="$attrs"
    @on-click="onClick"
  >
    <TabPane
      v-for="it in list"
      :key="it.name"
      :name="it.name"
      :label="it.label"
    />
  </Tabs>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { TabItem } from './types'

@Component
export default class TabNav extends ViewBase {
  @Prop({ type: [String, Number] }) value!: string | number

  @Prop({ type: Array, default: () => [] }) list!: TabItem[]

  model: string | number = ''

  onClick(name: string) {
    const { route } = this.list.find(it => it.name == name)!
    this.$router.push(route)
  }

  @Watch('value', { immediate: true })
  watchValue(value: string | number) {
    this.model = value
  }

  @Watch('model')
  watchMode(value: string | number) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.tab-nav {
  user-select: none;
}
</style>
