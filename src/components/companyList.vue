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
import { clean } from '@/fn/object'

@Component
export default class CinemaChainSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Number, default: 0 }) value!: number
  @Prop({ default: '' }) typeCode!: string
  /**
   * 提示文字
   */
  @Prop({ type: String, default: '公司列表' }) placeholder!: string
  @Prop({ default: 0 }) approveStatus!: number
  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: number = this.value

  list: any[] = []

  async mounted() {
    try {
      const { data } = this.approveStatus == 0 ? await queryList(clean({
        pageSize: 888888,
        status: 1,
        typeCode: this.typeCode
      })) :  await queryList(clean({
        pageSize: 888888,
        status: 1,
        approveStatus: this.approveStatus,
        typeCode: this.typeCode
      }))
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
    const row = this.list.filter((item: any) => item.id == val)
    this.$emit('row', row)
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
