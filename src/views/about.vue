<template>
  <div class="page">
    <input type="file" @change="onChange">
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import event from '@/fn/event'

import Uploader, { ImageType, UploaderOptions } from '@/util/Uploader'

@Component
export default class Main extends ViewBase {
  onChange(ev: Event) {
    const files = (ev.target as HTMLInputElement).files!
    const uploader = new Uploader({
      imageCompress: {
        keepTypes: [ ImageType.gif, ImageType.png ]
      }
    } as UploaderOptions)
    uploader.on({
      thumb: ({ thumb }) => {
        // 已经生成预览图的时候触发，只有上传的是图片的时候，才有这个事件
        // thumb 是图片预览地址，可以直接绑定到 img 的 src 上实现预览
      },
      begin: () => {
        // 开始上传，执行开始动作，比如显示 loading 之类的
      },
      progress: (e: ProgressEvent) => {
        const { loaded, total } = e
        const percent = Math.floor(loaded * 100 / total)
        // loaded 是已上传的字节数，total 是总字节数，percent 是计算出来的百分比
      },
      done: data => {
        const url = data.url
        const fileId = data.fileId
        // 上传成功，url 是上传后的地址，图片预览需要这个值
        // fileId 是文件 ID，一般后端需要这个值
      },
      fail: ex => {
        // ex 是与 ajax 组件相同的错误对象
        this.handleError(ex)
      },
      end: () => {
        // 结束上传，无论成功还是失败，都会执行，执行清理工作，比如取消显示 loading
      }
    })
    uploader.upload(files[0])
  }
}
</script>

<style lang="less" scoped>
</style>
