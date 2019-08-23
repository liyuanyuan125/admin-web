<template>
  <BaseDialog v-model="model" :width="810" @ok="onOk">
    <CitySelectPane v-model="cityIdsModel" :topCityIds="topCityIds" ref="citySelectPane"/>
  </BaseDialog>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import CitySelectPane from './citySelectPane.vue'
import { isEqual } from 'lodash'
import BaseDialog from '@/components/baseDialog'

@Component({
  components: {
    BaseDialog,
    CitySelectPane
  }
})
export default class CitySelectDialog extends ViewBase {
  /**
   * model，支持双向绑定
   */
  @Prop({ type: Boolean, default: false }) value!: boolean

  /** 城市 ids */
  @Prop({ type: Array, default: () => [] }) cityIds!: number[]

  /** 票仓城市 Top20 城市 ids */
  @Prop({ type: Array, default: () => [] }) topCityIds!: number[]

  model = this.value

  cityIdsModel: number[] = this.cityIds

  onOk() {
    this.$emit('update:cityIds', this.cityIdsModel)
    this.model = false

    const pane = this.$refs.citySelectPane as CitySelectPane
    const fastList = pane.fastList
    this.$emit('ok', { fastList: JSON.parse(JSON.stringify(fastList)) })
  }

  @Watch('value')
  watchValue(value: boolean) {
    this.model = value
    value && (this.cityIdsModel = this.cityIds)
  }

  @Watch('model')
  watchModel(value: boolean) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
</style>
