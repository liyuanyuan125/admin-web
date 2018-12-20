<template>
  <Cascader v-model='inValue' :data='data' :load-data='loadData' :clearable='clearable'
    class='area-select' :render-format='format' ref="ui"></Cascader>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { getSubList, isValidArea } from '@/api/area'
import { toast } from '@/ui/modal'

const isAllZero = (list: number[] | null) => (list || []).every(it => it === 0)

@Component
export default class AreaSelect extends View {
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

  data: any[] = []

  async getSubList(pid = 0, level = 0) {
    let list: any[]
    try {
      const res = await queryList({parentIds: pid, pageSize: 10000})
      list = res.data.items
    } catch (ex) {
      list = []
      this.handleError(ex)
    }
    const subLevel = level + 1

    const tlist = list.map((it: any) => {
      const item: any = {
        value: it.id,
        label: it.nameCn,
        level: subLevel,
      }
      if (subLevel < this.maxLevel) {
        item.loading = false
        item.children = []
      }
      return item
    })

    const result = level > 0
      ? [{ value: 0, label: '本区域', isFake: true }].concat(tlist)
      : tlist

    return result
  }

  async mounted() {
    this.data = await this.getSubList()
  }

  async checkValid(ids: number[]) {
    if (isAllZero(ids)) {
      return true
    }
    const isValid = await isValidArea(ids)
    return isValid
  }

  async loadData(item: any, callback: any) {
    item.loading = true
    const list = await this.getSubList(item.value, item.level)
    item.children = list
    item.loading = false
    callback()
  }

  format(labels: any[], selectedData: any[]) {
    const list = selectedData.filter(it => !it.isFake).map(it => it.label)
    const result = list.length > 0 ? list.join(' / ') : ''
    const allZero = isAllZero(this.value)
    // fix 选择清除不干净的 bug
    if (allZero && result !== '') {
      const ui = this.$refs.ui as any
      typeof ui.clearSelect === 'function' && ui.clearSelect()
    }
    return allZero ? '' : result
  }

  fillList(list: number[]) {
    const zeroList: number[] = new Array(this.maxLevel).fill(0)
    return zeroList.map((it, i) => i in list ? list[i] : it)
  }

  @Watch('value')
  async watchValue(val: number[]) {
    // 检查传入的 value 值，是否合法，不合法直接清空
    const isValid = await this.checkValid(val)
    const value = isValid ? val : []
    this.inValue = value
    // 触发 form item 验证
    isValid && (this.$refs.ui as any).dispatch('FormItem', 'on-form-change', value)
  }

  @Watch('inValue')
  watchInValue(val: number[]) {
    const value = val.length < this.maxLevel ? this.fillList(val) : val
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.area-select {
  display: inline-block;
  width: 100%;
}
</style>
