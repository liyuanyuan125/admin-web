<template>
  <Select v-model="inValue" :placeholder="placeholder" filterable
    clearable class="component" ref="ui">
    <Option v-for="it in list" :key="it.id" :value="it.id"
      :label="it.name" class="flex-box">
      <span>{{it.name}}</span>
    </Option>
  </Select>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList } from '@/api/corpReal'

@Component
export default class CinemaChainSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Number, default: 0 }) value!: number

  /**
   * 提示文字
   */
  @Prop({ type: String, default: '公司列表' }) placeholder!: string

  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: number = this.value

  list: any[] = []

  async mounted() {
    try {
      const { data } = await queryList({
        pageSize: 888888,
        status: 1
      })
      const list: any[] = data.items || []
      this.list = list
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('value')
  watchValue(val: number) {
    this.inValue = val
    // 触发 form item 验证
    ; (this.$refs.ui as any).dispatch('FormItem', 'on-form-change', val)
  }

  @Watch('inValue')
  watchInValue(val: number) {
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
