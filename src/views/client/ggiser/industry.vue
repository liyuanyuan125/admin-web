<template>
  <Select
    v-model="inner"
    :placeholder="placeholder"
    filterable
    clearable
    class="power-select"
    ref="ui"
  >
    <Option
      v-for="it in list"
      :key="it.id"
      :value="it.id"
      :label="it.shortName || it.name"
      class="flex-box"
    >
      <span class="flex-1">{{it.shortName || it.name}}</span>
      <i v-if="it.chainControlStatus == 2" class="offline">下架</i>
    </Option>
  </Select>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList } from '@/api/cinemaChain'

import { brandSelect } from '@/api/clientBrand.ts'

@Component
export default class BrandsSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop() businessParentTypeList!: any

  /**
   * 控制状态
   */
  @Prop({ type: Number, default: 1 }) controlStatus!: number

  /**
   * 提示文字
   */
  @Prop({ type: String, default: '品牌名称，输入文字进行筛选' }) placeholder!: string

  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inner: number = this.value

  list: any[] = []

  async mounted() {
    try {
      const { data } = await brandSelect({
        pageSize: 888888
      })
      let list: any[] = data.items || []
      if (this.controlStatus > 0) {
        list = list.filter(it => it.controlStatus == this.controlStatus)
      }
      this.list = list
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('value')
  watchValue(value: number) {
    this.inner = value
  }

  @Watch('inner')
  watchInner(value: number) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.power-select {
  min-width: 188px;
  /deep/ .ivu-select-input {
    position: relative;
    top: -1px;
  }
}

.offline {
  color: #bbb;
  font-style: normal;
}
</style>
