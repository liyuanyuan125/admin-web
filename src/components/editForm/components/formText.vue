<template>
  <span class="form-text" v-if="value">{{value}}</span>
  <span class="form-text form-text-placeholder" v-else>{{placeholder}}</span>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class FormText extends ViewBase {
  @Prop({ default: '' }) value!: any

  @Prop({ type: String, default: '' }) placeholder!: string
}
</script>

<style lang="less" scoped>
.form-text {
  display: inline-block;
}

.form-text-placeholder {
  color: #888;
}
</style>
