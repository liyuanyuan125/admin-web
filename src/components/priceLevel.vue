<template>
  <Select v-model="inValue" :placeholder="placeholder" filterable
    clearable class="component" ref="ui">
    <Option v-for="(it, index) in list" :key="index" :value="it.key"
      :label="it.text" class="flex-box">
      <span>{{it.text}}</span>
    </Option>
  </Select>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinemaLevel } from '@/api/rateCard'

@Component
export default class CinemaChainSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: String, default: '' }) value!: string

  /**
   * 提示文字
   */
  @Prop({ type: String, default: '定价等级' }) placeholder!: string

  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: string = this.value

  list: any[] = []

  async mounted() {
    try {
      const { data } = await cinemaLevel({
        pageSize: 1
      })
      const list: any[] = data.pricingLevelList || []
      this.list = list
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('value')
  watchValue(val: string) {
    this.inValue = val
    // 触发 form item 验证
    ; (this.$refs.ui as any).dispatch('FormItem', 'on-form-change', val)
  }

  @Watch('inValue')
  watchInValue(val: string) {
    this.$emit('input', val)
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
