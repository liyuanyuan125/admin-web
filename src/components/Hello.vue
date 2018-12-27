<template>
  <div class="component">
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class ComponentMain extends ViewBase {
}
</script>

<style lang="less" scoped>
</style>
