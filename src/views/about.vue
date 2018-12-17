<template>
  <div class="page">
    <input type="file" @change="onChange">
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import View from '@/util/View'
import event from '@/fn/event'

import Uploader, { ImageType, UploaderOptions } from '@/util/Uploader'

@Component
export default class Main extends View {
  onChange(ev: Event) {
    const files = (ev.target as HTMLInputElement).files!
    const uploader = new Uploader({
      imageCompress: {
        keepTypes: [ ImageType.gif, ImageType.png ]
      }
    } as UploaderOptions)
    uploader.upload(files[0])
  }
}
</script>

<style lang="less" scoped>
</style>
