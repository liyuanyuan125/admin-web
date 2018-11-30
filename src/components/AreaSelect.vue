<template>
  <Cascader v-model='inValue' :data='data' :load-data='loadData' :clearable='clearable'
    placeholder='加载中，请稍等...' class='area-select' :render-format='format'></Cascader>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { getSubList } from '@/api/area'

@Component
export default class ComponentMain extends View {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Array, default: () => [] }) value!: number[]

  /**
   * 最大级别，取值范围：1 ~ 3，分别对应：省、市、区县
   */
  @Prop({ type: Number, default: 3 }) maxLevel!: number

  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: number[] = []
  data: number[] = []

  async getSubList(pid = 0, level = 0) {
    const list = await getSubList(pid)

    const subLevel = level + 1

    const result = list.map((it: any) => {
      const item: any = {
        value: it.id,
        label: it.name,
        level: subLevel,
      }
      if (subLevel < this.maxLevel) {
        item.loading = false
        item.children = []
      }
      return item
    })

    return result
  }

  async mounted() {
    this.data = await this.getSubList()
  }

  async loadData(item: any, callback: any) {
    item.loading = true
    const list = await this.getSubList(item.value, item.level)
    item.children = list
    item.loading = false
    callback()
  }

  format(labels: any[], selectedData: any[]) {
    // const list = selectedData.map(it => it.label)
    return labels && labels.length > 0
      ? labels.join(' / ')
      : '请选择'
  }

  fillList(list: number[]) {
    const zeroList = new Array(this.maxLevel).fill(0)
    return zeroList.map((it, i) => i in list ? list[i] : it)
  }

  @Watch('value')
  watchValue(val: number[]) {
    this.inValue = val
  }

  @Watch('inValue')
  watchInValue(val: number[]) {
    const value = val.length < this.maxLevel ? this.fillList(val) : val
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
</style>
