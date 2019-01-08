<template>
  <div class="component">
    
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Model } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class ComponentMain extends ViewBase {
  @Prop({ type: Number, default: () => 30}) maxLength: any
  @Prop({type: String, default: () => 'text'}) type: any
}
</script>

<style lang="less" scoped>
</style>
