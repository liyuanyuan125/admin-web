<template>
  <DatePicker
    v-model="date"
    :placeholder="placeholder"
    v-bind="$attrs"
    v-on="$listeners"
    class="form-date"
    transfer
  />
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'

// 逻辑与 listPage/components/datePicker 基本相同，但类型不同

const dateFormat = 'YYYYMMDD'

const dateToInt = (date: Date | number | string) =>
  date instanceof Date ? +moment(date).format(dateFormat) : +date

@Component
export default class FormDate extends ViewBase {
  /** 格式：20180901 */
  // TODO: type 设置为 String、Date 是为了消除开发错误
  @Prop({ type: [Number, String, Date], default: 0 }) value!: number | string | Date

  /** placeholder */
  @Prop({ type: String, default: '选择日期' }) placeholder!: string

  model = 0

  get date(): Date | undefined {
    const value = this.value
    if (value == 0) {
      return undefined
    }
    const m = moment(value instanceof Date ? value : String(value))
    const date = m.isValid() ? m.toDate() : undefined
    return date
  }

  set date(value: Date | undefined) {
    if (value == null) {
      this.model = 0
      return
    }
    const m = moment(value)
    const date = m.isValid() ? +m.format(dateFormat) : 0
    this.model = date
  }

  @Watch('value', { immediate: true })
  watchValue(value: number | string | Date) {
    const intValue = dateToInt(value) || 0
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
.form-date-range {
  width: 100%;
}
</style>
