<template>
  <label class="upload-label" :class="{
      'upload-label-error': !!item.error,
      'upload-label-empty': !(item.fileId || isUploading)
    }">

    <input type="file" :accept="accept" @change="onChange" ref="file"/>

    <span class="upload-has flex-mid" v-if="item.fileId || isUploading">
      <CircleProgress :percent="item.percent" :fail="!!item.error" v-if="useCircle"/>
      <Progress :percent="item.percent" :status="item.progressStatus" class="progress" v-else/>
      <div class="name" v-if="item.clientName">{{item.clientName}}</div>
      <div class="error" v-if="item.error">{{item.error}}</div>
      <slot name="suffix"></slot>
    </span>
    <span class="empty-wrap" v-else>
      <slot>上传文件</slot>
    </span>
  </label>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Uploader from '@/util/Uploader'
import { slice } from '@/fn/object'
import { FileItem, DoneEvent } from './types'
import { cloneDeep } from 'lodash'
// import CircleProgress, { CircleProgressOptions } from '@/components/circleProgress'

// 状态，loading 表示正在生成预览（针对图片），uploading 正在上传，done 完成，fail 失败
type Status = '' | 'loading' | 'uploading' | 'done' | 'fail'

/** 上传项 */
interface UploadItem extends FileItem {
  /** 状态 */
  status: Status
  /** 百分比 */
  percent: number
  /** 进度条状态 */
  progressStatus: string
  /** 错误消息，内部使用 */
  error: string
  file?: File,
}

const defItem: UploadItem = {
  url: '',
  fileId: '',
  clientName: '',
  clientSize: 0,
  clientType: '',
  status: 'done',
  percent: 0,
  progressStatus: 'active',
  error: '',
}

@Component
export default class UploadLabel extends ViewBase {
  /**  接受的文件类型，默认 */
  @Prop({ type: String, default: '*' }) accept!: string

  /** 是否使用圆形进度条，默认不使用 */
  @Prop({ type: Boolean, default: false }) useCircle!: boolean

  item: UploadItem = cloneDeep(defItem)

  isUploading = false

  /**
   * 主动发起文件选择
   */
  pick() {
    const file = this.$refs.file as HTMLInputElement
    file && file.click()
  }

  onChange(ev: Event) {
    const input = ev.target as HTMLInputElement
    const files = input.files
    if (files == null || files.length === 0) {
      return
    }

    const file = files[0]

    this.item = {
      url: '',
      fileId: '',
      clientName: file.name,
      clientSize: file.size,
      clientType: file.type,
      status: 'loading',
      percent: 0,
      progressStatus: 'active',
      error: '',
      file,
    }

    // const uploader = new Uploader({
    //   imageCompress: false
    // })
    // uploader.on(this.uploadHandlers()).upload(file)

    // 将 input value 清空，以便可以重复上传相同的文件
    // 在某些浏览器上，通过代码设置 input.value 可能会抛出安全性错误
    try {
      input.value = ''
    } catch {
    }
  }

  uploadHandlers() {
    return {
      // prepare: this.onUploadPrepare.bind(this),
      begin: this.onUploadBegin.bind(this),
      progress: this.onUploadProgress.bind(this),
      done: this.onUploadDone.bind(this),
      fail: this.onUploadFail.bind(this),
      end: this.onUploadEnd.bind(this),
    }
  }

  // onUploadPrepare(ev: PrepareEvent) {
  //   this.$emit('prepare', ev)
  // }

  onUploadBegin() {
    this.isUploading = true
    this.$emit('begin')
    this.item!.status = 'uploading'
  }

  onUploadProgress(ev: ProgressEvent) {
    const { loaded, total } = ev
    const percent = Math.floor(loaded * 100 / total)
    this.item!.percent = percent
  }

  onUploadDone({ url, fileId }: any) {
    const item = this.item!
    item.url = url
    item.fileId = fileId
    item.status = 'done'
    item.progressStatus = 'success'

    const itemOut = slice(item, 'url,fileId,clientName,clientSize,clientType') as FileItem
    this.$emit('done', { item: itemOut, file: item.file } as DoneEvent)
  }

  onUploadFail(ex: any) {
    const error = this.formatError(ex)
    const item = this.item!
    item.error = '上传失败：' + error
    item.status = 'fail'
    item.percent = 100
    item.progressStatus = 'wrong'
    this.$emit('fail', { error })
  }

  onUploadEnd() {
    this.isUploading = false
    this.$emit('end')
  }
}
</script>

<style lang="less" scoped>
.upload-label {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  input[type=file] {
    display: none;
  }
}
.upload-has {
  width: 100%;
  height: 100%;
  flex-direction: column;
  line-height: 2;
}
.progress {
  max-width: 80%;
  margin-left: 50px;
}
.name,
.error {
  position: relative;
  display: block;
  max-width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.upload-label-error {
  .name,
  .error {
    color: #ed4014;
  }
}

.circle-progress {
  ~ .name {
    margin-top: 8px;
  }
}
</style>
