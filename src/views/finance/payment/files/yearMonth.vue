<template>
    <DatePicker type="month" placeholder="账单月份" @on-change='chg'></DatePicker>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList } from '../data'
import { clean } from '@/fn/object'

@Component
export default class CompanyList extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ default: null }) value!: any
  @Prop({ default: true }) type!: boolean
  /**
   * 提示文字
   */
  @Prop({ type: String, default: '账单月份' }) placeholder!: string
  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: any = this.value
  loading = false

  list: any[] = []

  chg(data: any) {
    if (data != '') {
      this.inValue = data.split('-')[0] + data.split('-')[1]
    } else {
      this.inValue = null
    }
  }

  @Watch('inValue')
  watchInValue(val: number) {
    this.$emit('input', val)
    const row = this.list.filter((item: any) => item.id == val)
    this.$emit('row', row)
  }
}
</script>

<style lang="less" scoped>
.component {
  min-width: 188px;
}
.offline {
  color: #bbb;
  font-style: normal;
}
</style>
