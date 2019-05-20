<template>
  <DatePicker type="daterange" @on-change="dateChange" v-model="inValue" placement="bottom-start" placeholder="注册时间" class="input" style="width: 200px"></DatePicker>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { clean } from '@/fn/object'
import moment from 'moment'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@Component
export default class CinemaChainSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: String, default: '' }) value!: any
  @Prop({ default: '' }) typeCode!: string
  /**
   * 提示文字
   */
  @Prop({ type: String, default: '选择日期' }) placeholder!: string

  @Prop({ type: Boolean, default: true }) clearable!: boolean


  beginCreateTime: any = null
  endCreateTime: any = null
  inValue: any = this.value

  dateChange(data: any) {
     // 获取时间戳
     !!data[0] ? (this.beginCreateTime = new Date(data[0]).getTime() - 28800000)
     : this.beginCreateTime = ''
     !!data[1] ? (this.endCreateTime = new Date(data[1]).getTime() + 57600000)
     : this.endCreateTime = ''
  }

  async mounted() {
    !!this.beginCreateTime ? this.inValue[0] =
    moment(this.beginCreateTime).format(timeFormat) : this.inValue[0] = ''
    !!this.endCreateTime ? this.inValue[1] =
    moment(this.endCreateTime).format(timeFormat) : this.inValue[1] = ''
  }


  @Watch('inValue')
  watchInValue(val: any) {
    this.$emit('input', [val[0].getTime() , val[1].getTime()])
    const row = this.inValue

    this.$emit('row', row)
  }
}
</script>

<style lang="less" scoped>
.component {
  min-width: 140px;
}
.offline {
  color: #bbb;
  font-style: normal;
}
</style>
