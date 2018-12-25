<template>
  <Modal v-model='showDlg' :transfer='false' :width='420'>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class ComponentMain extends ViewBase {
  showDlg = false
}
</script>

<style lang="less" scoped>
</style>
