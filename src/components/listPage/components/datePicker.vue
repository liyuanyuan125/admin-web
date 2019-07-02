<template>
  <DatePicker
    v-model="date"
    :placeholder="placeholder"
    transfer
  />
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import moment from 'moment'

/**
 * 遇到一个很奇怪的问题，直接使用 iview 的 datePicker，会影响 listPage 中的 query 的 watch，
 * 这里包装一下，并且将 model 改成字符串，使其更加适用于在 listPage 中使用
 */
@Component
export default class DatePickerWrap extends Vue {
  /** 格式：20180901 */
  @Prop({ type: String, default: '' }) value!: string

  /** placeholder */
  @Prop({ type: String, default: '选择日期' }) placeholder!: string

  model = this.value

  get date(): Date | undefined {
    if (this.value == '') {
      return undefined
    }
    const m = moment(String(this.value))
    const date = m.isValid() ? m.toDate() : undefined
    return date
  }

  set date(value: Date | undefined) {
    if (value == null) {
      this.model = ''
      return
    }
    const m = moment(value)
    const date = m.isValid() ? m.format('YYYYMMDD') : ''
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
