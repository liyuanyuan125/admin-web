<template>
    <!-- <Select v-model="inValue" placeholder="公司名称" filterable
      clearable class="component" ref="ui">
      <Option v-for="it in list" :key="it.id" :value="it.companyName"
        :label="it.companyName" class="flex-box">
        <span>{{it.companyName}}</span>
      </Option>
    </Select> -->
    <LazyInput v-model="inValue" placeholder="公司名称" class="input"/>
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
  @Prop({ type: String, default: 0 }) value!: number
  @Prop({ default: '' }) typeCode!: string
  @Prop({ default: true }) type!: boolean
  /**
   * 提示文字
   */
  @Prop({ type: String, default: '申请人公司名称' }) placeholder!: string
  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: number = this.value

  list: any[] = []

  async mounted() {
    try {
      const { data } =  await queryList(clean({
        pageSize: 888888,
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
