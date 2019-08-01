<template>
  <DatePicker
    type="daterange"
    v-model="date"
    :placeholder="placeholder"
    v-bind="$attrs"
    v-on="$listeners"
    class="form-date-range"
    transfer
    split-panels
  />
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { isEqual } from 'lodash'

// 逻辑与 listPage/components/dateRangePicker 基本相同，但类型不同

const dateFormat = 'YYYYMMDD'

const dateToInt = (date: Date | number | string) =>
  date instanceof Date ? +moment(date).format(dateFormat) : +date

const isEmpty = (list: number[]) =>
  !list || list.length == 0 || list.every(it => !it)

@Component
export default class FormDateRange extends ViewBase {
  /** 格式：[20180901, 20190801] */
  @Prop({ type: Array, default: () => [0, 0] }) value!: number[]

  /** placeholder */
  @Prop({ type: String, default: '选择日期范围' }) placeholder!: string

  model = this.value

  get date(): Array<Date | undefined> {
    if (isEmpty(this.value)) {
      return [ undefined, undefined ]
    }
    const [begin, end] = this.value
    const bm = moment(String(begin))
    const em = moment(String(end))
    const date = bm.isValid() && em.isValid()
      ? [ bm.toDate(), em.toDate() ]
      : [ undefined, undefined ]
    return date
  }

  set date(value: Array<Date | undefined>) {
    const [ begin = null, end = null ] = value || []
    if (begin == null || end == null) {
      this.model = [0, 0]
      return
    }
    const bm = moment(begin)
    const em = moment(end)
    const date = bm.isValid() && em.isValid()
      ? [+bm.format(dateFormat), +em.format(dateFormat)]
      : [0, 0]
    this.model = date
  }

  @Watch('value')
  watchValue(value: number[]) {
    const [begin, end] = (value || []).map(it => dateToInt(it) || 0) || [0, 0]
    const validValue = [begin || 0, end || 0]
    if (!isEqual(validValue, this.model)) {
      this.model = validValue
    }
  }

  @Watch('model')
  watchModel(value: number[]) {
    if (!isEqual(value, this.value)) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="less" scoped>
.form-date-range {
  width: 100%;
}
</style>
