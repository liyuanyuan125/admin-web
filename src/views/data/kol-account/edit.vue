<template>
  <div class="edit-page">
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

type Action = 'edit' | 'audit'

@Component
export default class EditPage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) channel!: string

  @Prop({ type: String, default: '' }) action!: Action
}
</script>

<style lang="less" scoped>
</style>
