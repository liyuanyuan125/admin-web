<template>
  <figure class="form-image-list">
    <Upload v-model="model" multiple :maxCount="maxCount" :readonly="disabled"/>
    <InputHidden :value="model"/>
  </figure>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Upload, { FileItem } from '@/components/Upload.vue'
import InputHidden from '@/components/inputHidden'
import { isEqual, uniq } from 'lodash'

@Component({
  components: {
    Upload,
    InputHidden
  }
})
export default class FormImageList extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: string[]

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  /**
   * 上传文件的最大个数，默认 3 个
   */
  @Prop({ type: Number, default: 3 }) maxCount!: number

  model: FileItem[] = []

  @Watch('value', { immediate: true })
  watchValue(value: string[]) {
    const valList = uniq(value || [])
    const urlList = uniq((this.model || []).map(it => it.url))
    if (!isEqual(valList, urlList)) {
      this.model = valList.map(url => ({ url, fileId: '' }) as FileItem)
    }
  }

  @Watch('model')
  watchModel(value: FileItem[]) {
    const urlList = uniq((value || []).map(it => it.url))
    this.$emit('input', urlList)
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
