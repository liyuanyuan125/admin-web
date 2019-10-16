<template>
  <DatePicker
    v-model="date"
    :type="type"
    :placeholder="placeholder"
    v-bind="$attrs"
    class="date-picker-wrap"
    transfer
  />
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'
import { devLog } from '@/util/dev'

// 由于 Vue 存在 bug，model 与 v-on="$listeners" 在一起使用时，会出现问题，
// 故而暂时去掉 v-on="$listeners"，若需要监听 DatePicker 事件，暂时需要明确声明
// https://github.com/vuejs/vue/issues/7042

// TODO: 提取到新的工程

const dateFormatMap = {
  date: 'YYYYMMDD',
  month: 'YYYYMM',
  year: 'YYYY'
}

const dateToInt = (date: Date | number | string, dateFormat: string) =>
  date instanceof Date ? +moment(date).format(dateFormat) : +date

@Component
export default class DatePickerWrap extends ViewBase {
  /** 格式：20180901 */
  // TODO: type 设置为 String、Date 是为了消除开发错误
  @Prop({ type: [Number, String, Date], default: 0 }) value!: number | string | Date

  /**
   * 模式，默认 date
   * date  - 日选择模式
   * month - 月选择模式
   * year  - 年选择模式
   */
  @Prop({ type: String, default: 'date' }) type!: 'date' | 'month' | 'year'

  /** placeholder */
  @Prop({ type: String, default: '选择日期' }) placeholder!: string

  model = 0

  get dateFormat() {
    const type = this.type
    return dateFormatMap[type]
  }

  get date(): Date | undefined {
    const value = this.value
    if (value == 0) {
      return undefined
    }
    const m = moment(value instanceof Date ? value : String(value), this.dateFormat)
    const date = m.isValid() ? m.toDate() : undefined
    return date
  }

  set date(value: Date | undefined) {
    if (value == null) {
      this.model = 0
      return
    }
    const m = moment(value)
    const date = m.isValid() ? +m.format(this.dateFormat) : 0
    this.model = date
  }

  @Watch('value', { immediate: true })
  watchValue(value: number | string | Date) {
    const intValue = dateToInt(value, this.dateFormat) || 0
    if (intValue != this.model) {
      this.model = intValue
    } else {
      // 纠正数据类型错误
      if (typeof value !== 'number') {
        this.$emit('input', intValue)
      }
    }
  }

  @Watch('model')
  watchModel(value: number) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
// .form-date {
//   width: 100%;
// }
</style>
