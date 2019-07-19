<template>
  <Dropdown placement="bottom-start" class="upload-button">
    <Button class="button-upload" :disabled="isUploading">
      <Icon type="ios-cloud-upload-outline" v-if="!isUploading" class="icon-prefix"/>
      <TinyLoading :size="12" v-if="isUploading" class="icon-prefix"/>
      <span class="button-text">
        <slot>上传</slot>
      </span>
      <label class="upload-label" v-if="!isUploading">
        <input type="file" :accept="accept" :multiple="multiple" @change="onChange"/>
      </label>
      <Icon type="ios-arrow-down" class="icon-suffix" v-show="list.length > 0"/>
    </Button>
    <DropdownMenu v-if="accept != 'image/*' && list.length > 0" slot="list" class="progress-pane">
      <DropdownItem v-for="it in list" :key="it.uqid" disabled
        :class="{'has-error': !!it.error}">
        <div class="file-name">{{it.clientName}}</div>
        <Progress :percent="it.percent" :status="it.progressStatus"/>
        <div class="error" v-if="it.error">{{it.error}}</div>
      </DropdownItem>
    </DropdownMenu>

    <DropdownMenu v-else-if="accept == 'image/*' && list.length > 0" slot="list" class="progress-pane">
      <DropdownItem v-for="it in list" :key="it.uqid" disabled
        :class="{'has-error': !!it.error}">
        <div v-if="it.percent == 100">
          <span class="file-name">{{it.clientName}}</span>
          <a @click="onView(it.url)" style="margin-left: 10px">查看大图</a>
        </div>
        <Progress :percent="it.percent" :status="it.progressStatus"/>
        <div class="error" v-if="it.error">{{it.error}}</div>
      </DropdownItem>
    </DropdownMenu>

    <Modal v-model="viewerShow" title="查看图片" width="888">
      <img :src="viewerImage" class="viewer-image">
    </Modal>

  </Dropdown>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import Uploader, { UploaderOptions } from '@/util/Uploader'
import { random } from '@/fn/string'
import { slice } from '@/fn/object'

const genUqid = () => random('upload')

// 状态，loading 表示正在生成预览（针对图片），uploading 正在上传，done 完成，fail 失败
type Status = '' | 'loading' | 'uploading' | 'done' | 'fail'

export interface FileItem {
  /** 文件（图片）地址 */
  url: string
  /** 文件ID */
  fileId: string
  /** 客户端文件名 */
  clientName: string
  /** 客户端文件大小 */
  clientSize: number
  /** 客户端文件类型 */
  clientType: string
}

export interface SuccessEvent {
  files: FileItem[]
}

/** 上传项 */
interface UploadItem extends FileItem {
  /** 状态 */
  status: Status
  /** 百分比 */
  percent: number
  /** 进度条状态 */
  progressStatus: string
  /** 唯一 ID，内部使用 */
  uqid: string
  /** 错误消息，内部使用 */
  error: string
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
  uqid: '',
  error: '',
}

@Component({
  components: {
    TinyLoading
  }
})
export default class UploadButton extends ViewBase {
  /**
   * 是否支持多选文件
   */
  @Prop({ type: Boolean, default: false }) multiple!: boolean

  /**
   * 接受的文件类型
   */
  @Prop({ type: String, default: '*' }) accept!: string

  /**
   * 上传文件的最大个数，默认 1 个
   */
  @Prop({ type: Number, default: 1 }) maxCount!: number

  /**
   * 上传选项，传递给 util/Uploader 类
   */
  @Prop({ type: Object, default: () => ({}) }) uploaderOptions!: UploaderOptions

  list: UploadItem[] = []

  viewerShow = false
  viewerImage = ''

  get isUploading() {
    return !this.list.every(it => it.status == 'done' || it.status == 'fail')
  }

  onChange(ev: Event) {
    const files = (ev.target as HTMLInputElement).files
    if (files == null || files.length === 0) {
      return
    }

    // 每次上传均清空之前的
    this.list = []

    ; [].slice.call(files).forEach((file: File) => {
      const uqid = genUqid()
      // 快速响应原则：只要选择，直接添加
      this.list.push({
        url: '',
        fileId: '',
        clientName: file.name,
        clientSize: file.size,
        clientType: file.type,
        status: 'loading',
        percent: 0,
        progressStatus: 'active',
        uqid,
        error: '',
      })

      const uploader = new Uploader(this.uploaderOptions)
      uploader.on(this.uploadHandlers(uqid)).upload(file)
    })
  }

  uploadHandlers(uqid: string) {
    return {
      begin: this.onUploadBegin.bind(this, uqid),
      progress: this.onUploadProgress.bind(this, uqid),
      done: this.onUploadDone.bind(this, uqid),
      fail: this.onUploadFail.bind(this, uqid),
      end: this.onUploadEnd.bind(this, uqid),
    }
  }

  onUploadBegin(uqid: string) {
    const item = this.list.find(it => it.uqid === uqid)!
    item.status = 'uploading'
  }

  onUploadProgress(uqid: string, ev: ProgressEvent) {
    const { loaded, total } = ev
    const percent = Math.floor(loaded * 100 / total)
    const item = this.list.find(it => it.uqid === uqid)!
    item.percent = percent
  }

  onUploadDone(uqid: string, { url, fileId }: any) {
    const item = this.list.find(it => it.uqid === uqid)!
    item.url = url
    item.fileId = fileId
    item.status = 'done'
    item.progressStatus = 'success'
  }

  onUploadFail(uqid: string, ex: any) {
    const error = this.formatError(ex)
    const item = this.list.find(it => it.uqid === uqid)!
    item.error = error
    item.status = 'fail'
    item.percent = 100
    item.progressStatus = 'wrong'
  }

  onUploadEnd(uqid: string) {
    this.checkComplete()
  }

  onView(it: any) {
    this.viewerImage = it
    this.viewerShow = true
  }

  checkComplete() {
    if (!this.isUploading) {
      const files = this.list.filter(it => it.status == 'done')
        .map(it => slice(it, 'url,fileId,clientName,clientSize,clientType'))
      this.$emit('success', { files })
    }
  }
}
</script>

<style lang="less" scoped>
.button-upload {
  position: relative;
}
.button-text {
  margin: 0 3px;
}
.upload-label {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  input[type=file] {
    display: none;
  }
}
.progress-pane {
  width: 288px;
  user-select: none;
  /deep/ .ivu-dropdown-item-disabled {
    cursor: default;
  }
  /deep/ .ivu-progress-show-info .ivu-progress-outer {
    padding-right: 25px;
    margin-right: -25px;
  }
}
.file-name,
.error {
  margin-left: 2px;
}
.file-name {
  position: relative;
  display: inline-block;
  max-width: 70%;
  margin-bottom: 3px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.has-error {
  .file-name,
  .error {
    color: #ed4014;
  }
}
.viewer-image {
  width: 100%;
}
</style>
