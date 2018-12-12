<template>
  <Select v-model="inValue" :placeholder="placeholder" filterable
    clearable class="component" ref="ui">
    <Option v-for="it in list" :key="it.id" :value="it.id"
      :label="it.shortName || it.name" class="flex-box">
      <span class="flex-1">{{it.shortName || it.name}}</span>
      <i v-if="it.chainControlStatus == 2" class="offline">下架</i>
    </Option>
  </Select>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { queryList } from '@/api/cinemaChain'

@Component
export default class CinemaChainSelect extends View {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: String, default: '' }) value!: string

  /**
   * 控制状态
   */
  @Prop({ type: Number, default: 0 }) controlStatus!: number

  /**
   * 保留 ID，一般配合 controlStatus 使用
   */
  @Prop({ type: String, default: '' }) keepId!: string

  /**
   * 提示文字
   */
  @Prop({ type: String, default: '院线，输入文字进行筛选' }) placeholder!: string

  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: string = this.value

  list: any[] = []

  async mounted() {
    try {
      const { data } = await queryList({
        pageSize: 888888
      })
      let list: any[] = data.items || []
      if (this.controlStatus > 0) {
        list = list.filter(it => it.controlStatus == this.controlStatus ||
          it.id == this.keepId)
      }
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
