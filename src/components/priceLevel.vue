<template>
  <div>
    <Select v-model="inValue" :placeholder="placeholder" filterable
      clearable class="component" ref="ui">
      <Option v-for="(it, index) in ingradeList" :key="index" :value="it.code"
        :label="it.desc" class="flex-box">
        <span>{{it.desc}}</span>
      </Option>
    </Select>
  </div>
  
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class CinemaChainSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: String, default: '' }) value!: string
  @Prop({ default: () => []}) ingradeList!: any

  /**
   * 提示文字
   */
  @Prop({ type: String, default: '定价等级' }) placeholder!: string

  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: string = this.value

  created() {
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
