<template>
  <figure class="form-image-list">
    <Upload v-model="model" multiple :maxCount="maxCount" :readonly="disabled" />
    <InputHidden :value="model" />
  </figure>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Upload, { FileItem } from '@/components/Upload.vue'
import InputHidden from '@/components/inputHidden'
import { isEqual } from 'lodash'
import { devLog } from '@/util/dev'

const asStringList = (list: Array<string | FileItem>) =>
  list.map(it => (typeof it === 'string' ? it : it.url))

const asFileList = (list: Array<string | FileItem>) =>
  list.map(it => (typeof it === 'string' ? { url: it, fileId: '' } : it))

const fileListEqual = (alist: FileItem[], blist: FileItem[]) => {
  return alist.length == blist.length
  && alist.every((a, i) => {
    const b = blist[i]
    return a.url == b.url && a.fileId == b.fileId
  })
}

const hasString = (list: Array<string | FileItem>) =>
  list.some(it => typeof it === 'string')

const hasFile = (list: Array<string | FileItem>) =>
  list.some(it => typeof it !== 'string')

@Component({
  components: {
    Upload,
    InputHidden
  }
})
export default class FormImageList extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: Array<string | FileItem>

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  /**
   * 上传文件的最大个数，默认 3 个
   */
  @Prop({ type: Number, default: 3 }) maxCount!: number

  /**
   * 是否添加附加信息，若添加，则 value 会变成 FileItem[]
   */
  @Prop({ type: Boolean, default: false }) withExtra!: boolean

  model: FileItem[] = []

  compare(
    action: (param: {
      newModelList: FileItem[]
      newValueList: Array<string | FileItem>
    }) => any
  ) {
    if (this.withExtra) {
      // 若 this.value 中含有 string，说明含有脏数据
      const isDirty = hasString(this.value)
      const valueList = asFileList(this.value)
      const modelList = asFileList(this.model)
      if (isDirty || !fileListEqual(valueList, modelList)) {
        action({
          newModelList: valueList,
          newValueList: modelList
        })
      }
    } else {
      // 若 this.value 中含有 file，说明含有脏数据
      const isDirty = hasFile(this.value)
      const valueList = asStringList(this.value)
      const modelList = asStringList(this.model)
      if (isDirty || !isEqual(valueList, modelList)) {
        action({
          newModelList: asFileList(valueList),
          newValueList: modelList
        })
      }
    }
  }

  @Watch('value', { immediate: true })
  @Watch('withExtra', { immediate: true })
  watchValue() {
    this.compare(({ newModelList }) => this.model = newModelList)
  }

  @Watch('model')
  @Watch('withExtra')
  watchModel() {
    this.compare(({ newValueList }) => this.$emit('input', newValueList))
  }
}
</script>

<style lang="less" scoped>
.form-image-list {
  position: relative;
  /deep/ .upload-box-readonly .upload-list:empty {
    display: flex;
    height: 80px;
    align-items: center;
    justify-content: center;
    &::before {
      content: '暂无图片';
    }
  }
  /deep/ .upload-item {
    border: 1px solid #e8e8e8;
    box-shadow: none;
  }
}
</style>
