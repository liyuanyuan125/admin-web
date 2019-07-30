<template>
  <div class="edit-page">
    view
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component({})
export default class EditPage extends ViewBase {
  id: number|null = null

  created() {
    this.id = this.$route.params.id || null
  }
}
</script>

<style lang="less" scoped>
</style>
