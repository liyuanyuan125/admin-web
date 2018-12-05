<template>
  <Select v-model="inValue" :placeholder="placeholder" filterable clearable
    class="component">
    <Option v-for="it in list" :key="it.id" :value="it.id">{{it.name}}</Option>
  </Select>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { queryList } from '@/api/cinemaChain'

@Component
export default class ComponentMain extends View {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: String, default: '' }) value!: string

  /**
   * 提示文字
   */
  @Prop({ type: String, default: '院线，输入文字进行筛选' }) placeholder!: string

  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: string = this.value

  list: any[] = []

  async mounted() {
    try {
      const { data } = await queryList({ pageSize: 888888 })
      this.list = data.items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('value')
  watchValue(val: string) {
    this.inValue = val
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
</style>
