<template>
  <span class="form-text">{{value}}</span>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class FormText extends ViewBase {
  @Prop({ default: '' }) value!: any
}
</script>

<style lang="less" scoped>
.form-text {
  display: inline-block;
}
</style>
