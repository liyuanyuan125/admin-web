<template>
  <Select
    v-model="inner"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    filterable
    class="cinema-chain-select"
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

@Component
export default class CinemaChainSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Number, default: 0 }) value!: number

  /**
   * 控制状态
   */
  @Prop({ type: Number, default: 1 }) controlStatus!: number

  /**
   * 提示文字
   */
  @Prop({ type: String, default: '院线，输入文字进行筛选' }) placeholder!: string

  @Prop({ type: Boolean, default: true }) clearable!: boolean

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  inner: number = this.value

  list: any[] = []

  async mounted() {
    try {
      const { data } = await queryList({
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
.cinema-chain-select {
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
