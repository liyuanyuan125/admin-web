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
  // TODO: type 设置为 String 是为了消除开发错误
  @Prop({ type: [Number, String], default: 0 }) value!: number

  /** placeholder */
  @Prop({ type: String, default: '选择日期' }) placeholder!: string

  model = this.value

  get date(): Date | undefined {
    if (this.value == 0) {
      return undefined
    }
    const m = moment(String(this.value))
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
  watchValue(value: number) {
    const castValue = dateToInt(value) || 0
    this.model = castValue
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
