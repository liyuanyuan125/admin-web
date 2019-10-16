<template>
  <WeekDatePicker v-model="date" :placeholder="placeholder"/>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import WeekDatePicker from '@/components/weekDatePicker'
import { formatIntDateRange, parseIntDateRange } from '@/util/dealData'

const dateFormat = 'YYYYMMDD'

/**
 * 周选择控件
 */
@Component({
  components: {
    WeekDatePicker
  }
})
export default class WeekPicker extends Vue {
  /** 格式：20180901-20190801 */
  @Prop({ type: String, default: '' }) value!: string

  /** placeholder */
  @Prop({ type: String, default: '选择周' }) placeholder!: string

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
