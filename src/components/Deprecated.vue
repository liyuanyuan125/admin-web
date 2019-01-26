<template>
  <Tooltip v-if="controlStatus == 2" content="已下架" placement="top">
    <span class="deprecated"><slot></slot></span>
  </Tooltip>
  <span v-else><slot></slot></span>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Deprecated extends ViewBase {
  @Prop({ type: Number, default: 1 }) controlStatus!: number
}
</script>

<style lang="less" scoped>
</style>

