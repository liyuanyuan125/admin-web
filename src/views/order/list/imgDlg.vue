<template>
<div>
    <Modal title="View Image" @on-cancel="cancel" v-model="visible">
        <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  visible = false
  imgName = ''

  init(src: any) {
    this.visible = true
    this.imgName = src
  }

  cancel() {
    this.visible = false
  }
}
</script>

<style lang="less" scoped>
</style>
