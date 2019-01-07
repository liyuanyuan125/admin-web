<template>
  <div :class="['upload-box', readonly ? 'upload-box-readonly' : '']">
    <ul class="upload-list">
      <li v-for="(it, i) in inValue" :key="it.uqid" class="upload-item">
        <img :src="it.url" v-if="it.url">
        <div class="action-cover" v-if="it.status == 'done'">
          <Icon type="ios-eye-outline" @click.native="onView(it.url)"
            class="action-view"/>
          <Icon type="ios-trash-outline" @click.native="onDel(i)"
            class="action-del" v-if="!readonly"/>
        </div>
        <div class="loading-cover" v-else-if="it.status == 'loading'">
          <TinyLoading/>
        </div>
        <div class="progress-cover" v-else-if="it.status == 'uploading'">
          <Progress :percent="it.percent" status="success" hide-info/>
        </div>
      </li>
      <li class="upload-item upload-add" v-if="!readonly && canAdd">
        <label class="upload-add-in">
          <Icon type="ios-camera" size="20"/>
          <span>上传</span>
          <input type="file" :accept="accept" :multiple="multiple" @change="onChange"/>
        </label>
      </li>
    </ul>
    <Modal v-model="viewerShow" title="查看图片" width="888">
      <img :src="viewerImage" class="viewer-image">
    </Modal>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import Uploader from '@/util/Uploader'
import { alert } from '@/ui/modal'
import { random } from '@/fn/string'
import { slice } from '@/fn/object'
import { isEqual } from 'lodash'

const genUqid = () => random('upload')

// 状态，loading 表示正在生成预览（针对图片），uploading 正在上传，done 完成
type Status = '' | 'loading' | 'uploading' | 'done'

/** 文件项 */
export interface FileItem {
  /** 文件（图片）地址 */
  url: string
  /** 文件ID */
  fileId: string
  /** 可选，客户端文件名 */
  clientName?: string
  /** 可选，客户端文件大小 */
  clientSize?: number
  /** 可选，客户端文件类型 */
  clientType?: string
}

/** 上传项 */
interface UploadItem extends FileItem {
  /** 状态 */
  status: Status
  /** 百分比 */
  percent: number
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
  uqid: '',
  error: '',
}

const allDone = (item: FileItem | UploadItem) =>
  !('status' in item) || item.status == 'done'

const toFileItem = (item: FileItem | UploadItem) =>
  slice(item, 'url,fileId') as FileItem

const hasChange = (alist: FileItem[], blist: FileItem[]) => {
  const alistDone = alist.filter(allDone).map(toFileItem)
  const blistDone = blist.filter(allDone).map(toFileItem)
  return !isEqual(alistDone, blistDone)
}

@Component({
  components: {
    TinyLoading
  }
})
export default class Upload extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Array, default: () => [] }) value!: FileItem[]

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
   * 是否为只读
   */
  @Prop({ type: Boolean, default: false }) readonly!: boolean

  inValue: UploadItem[] = []

  viewerShow = false
  viewerImage = ''

  get canAdd() {
    return this.inValue.length < this.maxCount
  }

  @Watch('value', { deep: true, immediate: true })
  async watchValue(value: FileItem[]) {
    if (hasChange(value, this.inValue)) {
      this.inValue = (value || []).map(it => ({
        ...defItem,
        uqid: genUqid(),
        ...it
      } as UploadItem))
    }
  }

  @Watch('inValue', { deep: true })
  watchInValue(value: UploadItem[]) {
    if (hasChange(value, this.value)) {
      const nude = value.map(toFileItem)
      this.$emit('input', nude)
    }
  }

  onChange(ev: Event) {
    const files = (ev.target as HTMLInputElement).files
    if (files == null || files.length === 0) {
      return
    }
    const remain = this.maxCount - this.inValue.length
    if (files.length > remain) {
      return alert(`最多添加 ${this.maxCount} 个，还剩 ${remain} 个`)
    }
    [].slice.call(files).forEach((file: File) => {
      const uqid = genUqid()
      // 快速响应原则：只要选择，直接添加
      this.inValue.push({
        url: '',
        fileId: '',
        clientName: file.name,
        clientSize: file.size,
        clientType: file.type,
        status: 'loading',
        percent: 0,
        uqid,
        error: '',
      })
      const uploader = new Uploader()
      uploader.on(this.uploadHandlers(uqid)).upload(file)
    })
  }

  uploadHandlers(uqid: string) {
    return {
      thumb: this.onUploadThumb.bind(this, uqid),
      begin: this.onUploadBegin.bind(this, uqid),
      progress: this.onUploadProgress.bind(this, uqid),
      done: this.onUploadDone.bind(this, uqid),
      fail: this.onUploadFail.bind(this, uqid),
      end: this.onUploadEnd.bind(this, uqid),
    }
  }

  onUploadThumb(uqid: string, { thumb }: any) {
    // TODO: 暂时不用 thumb，chrome 预览图报错
  }

  onUploadBegin(uqid: string) {
    const item = this.inValue.find(it => it.uqid === uqid)!
    item.status = 'uploading'
  }

  onUploadProgress(uqid: string, ev: ProgressEvent) {
    const { loaded, total } = ev
    const percent = Math.floor(loaded * 100 / total)
    const item = this.inValue.find(it => it.uqid === uqid)!
    item.percent = percent
  }

  onUploadDone(uqid: string, { url, fileId }: any) {
    const item = this.inValue.find(it => it.uqid === uqid)!
    item.url = url
    item.fileId = fileId
  }

  onUploadFail(uqid: string, ex: any) {
    const error = this.formatError(ex)
    const item = this.inValue.find(it => it.uqid === uqid)!
    item.error = error
  }

  onUploadEnd(uqid: string) {
    const item = this.inValue.find(it => it.uqid === uqid)!
    item.status = 'done'
  }

  onView(url: string) {
    this.viewerImage = url
    this.viewerShow = true
  }

  onDel(i: number) {
    this.inValue.splice(i, 1)
  }
}
</script>

<style lang="less" scoped>
.upload-box {
  background-color: #ecf0f4;
}
.upload-list {
  display: flex;
  padding: 0 8px;
  list-style: inside none;
}
.upload-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin: 8px 8px 8px 0;
  img {
    max-width: 100%;
    max-height: 100%;
  }
  &:hover {
    .action-cover {
      display: inline-flex;
    }
  }
}
.progress-cover,
.action-cover {
  display: inline-flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.action-cover {
  display: none;
  background-color: rgba(0, 0, 0, 0.6);
  /deep/ .ivu-icon {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
}
.upload-add {
  box-shadow: none;
  border: 1px dashed #dcdee2;
  &:hover {
    color: #2d8ce8;
    border-color: #2d8ce8;
  }
}
.upload-add-in {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  input[type=file] {
    display: none;
  }
}
.viewer-image {
  width: 100%;
}
.upload-box-readonly {
  .action-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
