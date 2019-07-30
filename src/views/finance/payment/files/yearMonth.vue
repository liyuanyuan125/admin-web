<template>
    <Select 
       v-model="inValue"
       placeholder="账单月份"
       filterable
       clearable 
       class="component"
       ref="ui"
       >
      <Option v-for="it in list" :key="it.id" :value="it.year + '-' + it.month"
        :label="it.year + '-' + it.month" class="flex-box">
        <span>{{it.year}}-{{it.month}}</span>
      </Option>
    </Select>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList } from '../data'
import { clean } from '@/fn/object'

@Component
export default class CompanyList extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Number, default: 0 }) value!: number
  @Prop({ default: true }) type!: boolean
  /**
   * 提示文字
   */
  @Prop({ type: String, default: '账单月份' }) placeholder!: string
  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: number = this.value
  loading = false

  list: any[] = []

  async mounted() {
    try {
      const adscmy = await queryList({})
      this.list = adscmy.data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // async remoteMethod(querys: any) {
  //   try {
  //     if (querys) {
  //       this.loading = true
  //       const {
  //         data: { items }
  //       } = await queryList({
  //         name: querys,
  //       })
  //       this.list = items || []
  //     }
  //     this.loading = false
  //   } catch (ex) {
  //     this.handleError(ex)
  //     this.loading = false
  //   }
  // }

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
