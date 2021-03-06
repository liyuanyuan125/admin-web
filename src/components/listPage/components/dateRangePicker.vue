<template>
  <DatePicker
    type="daterange"
    v-model="date"
    :placeholder="placeholder"
    transfer
    split-panels
  />
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { formatIntDateRange, parseIntDateRange } from '@/util/dealData'

const dateFormat = 'YYYYMMDD'

/**
 * 遇到一个很奇怪的问题，直接使用 iview 的 datePicker，会影响 listPage 中的 query 的 watch，
 * 这里包装一下，并且将 model 改成字符串，使其更加适用于在 listPage 中使用
 */
@Component
export default class DatePickerWrap extends Vue {
  /** 格式：20180901-20190801 */
  @Prop({ type: String, default: '' }) value!: string

  /** placeholder */
  @Prop({ type: String, default: '选择日期范围' }) placeholder!: string

  model = this.value

  get date(): Array<Date | undefined> {
    if (this.value == '' || !/\d{8}-\d{8}/.test(this.value)) {
      return [ undefined, undefined ]
    }
    return parseIntDateRange(this.value, { separator: '-' })
  }

  set date(value: Array<Date | undefined>) {
    const [ begin = null, end = null ] = value || []
    const date = formatIntDateRange(begin, end, {
      separator: '-',
      format: dateFormat,
      blank: '',
    })
    this.model = date
  }

  @Watch('value')
  watchValue(value: string) {
    this.model = value
  }

  @Watch('model')
  watchModel(value: string) {
    this.$emit('input', value)
  }
}
</script>
