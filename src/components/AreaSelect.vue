<template>
  <Cascader v-model='inValue' :data='data' :load-data='loadData' :clearable='clearable'
    class='area-select' :render-format='format' ref="ui"></Cascader>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { queryList } from '@/api/dateArea'
import { toast } from '@/ui/modal'

@Component
export default class AreaSelect extends View {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Array, default: () => [] }) value!: string[]

  /**
   * 最大级别，取值范围：1 ~ 3，分别对应：省、市、区县
   */
  @Prop({ type: Number, default: 3 }) maxLevel!: number

  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: string[] = []
  data: string[] = []

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
      ? [{ value: '0', label: '本区域', isFake: true }].concat(tlist)
      : tlist

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
    const list = selectedData.filter(it => !it.isFake).map(it => it.label)
    const result = list.length > 0 ? list.join(' / ') : ''
    const strVal = (this.value || []).join('')
    return result ? result : (strVal === '' || strVal === '000' ? '' : '数据有问题')
  }

  fillList(list: string[]) {
    const zeroList = new Array(this.maxLevel).fill('0')
    return zeroList.map((it, i) => i in list ? list[i] : it)
  }

  @Watch('value')
  watchValue(val: string[]) {
    this.inValue = val
    // 触发 form item 验证
    ; (this.$refs.ui as any).dispatch('FormItem', 'on-form-change', val)
  }

  @Watch('inValue')
  watchInValue(val: string[]) {
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
