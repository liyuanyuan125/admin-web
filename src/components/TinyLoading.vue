<template>
  <span class="loading-box">
    <Spin>
      <Icon type="ios-loading" :size="size" class="loading"/>
    </Spin>
  </span>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class TinyLoading extends ViewBase {
  /**
   * 大小，默认 16
   */
  @Prop({ type: Number, default: 16 }) size!: number
}
</script>

<style lang="less" scoped>
.loading-box {
  display: inline-block;
}
.loading {
  animation: ring 1s linear infinite;
}
@keyframes ring {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

