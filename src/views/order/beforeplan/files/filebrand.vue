<template>
    <Select 
       v-model="inValue"
       placeholder="品牌列表"
       filterable
       clearable 
       class="component"
       ref="ui"
       :loading="loading"
       :remote-method="remoteMethod"
       @on-clear="list = []"
       @on-change="seachs"
       >
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
// import { queryList , planlist , company } from '@/api/orderSys'
import { brandList } from '@/api/brand'
import { clean } from '@/fn/object'

@Component
export default class CompanyList extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Number, default: 0 }) value!: number
  @Prop({ default: '' }) typeCode!: string
  @Prop({ default: true }) type!: boolean
  /**
   * 提示文字
   */
  @Prop({ type: String, default: '品牌列表' }) placeholder!: string
  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: number = this.value
  loading = false

  list: any[] = []

  async mounted() {
    try {
      const adscmy = await brandList({})
      this.list = adscmy.data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async remoteMethod(querys: any) {
    try {
      if (querys) {
        this.loading = true
        const {
          data: { items }
        } = await brandList({
          name: querys,
        })
        this.list = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
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
