<template>
  <figure class="form-image">
    <Upload v-model="model" :readonly="disabled"/>
  </figure>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Upload, { FileItem } from '@/components/Upload.vue'

@Component({
  components: {
    Upload
  }
})
export default class FormImage extends ViewBase {
  @Prop({ type: String, default: '' }) value!: string

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  model: FileItem[] = []

  @Watch('value', { immediate: true })
  watchValue(value: string) {
    if (value == '') {
      this.model = []
      return
    }
    if (this.model && this.model.length > 0 && this.model[0].url == value) {
      return
    }
    this.model = [{
      url: value,
      fileId: '',
    }]
  }

  @Watch('model')
  watchModel(value: FileItem[]) {
    this.$emit('input', value && value.length > 0 && value[0].url || '')
  }
}
</script>

<style lang="less" scoped>
.form-image {
  position: relative;
  /deep/ .upload-box {
    position: absolute;
    background-color: transparent;
  }
  /deep/ .upload-list {
    padding: 0;
  }
  /deep/ .upload-box-readonly .upload-list:empty {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
  }
  /deep/ .upload-item {
    margin: 0;
    border: 1px solid #e8e8e8;
    box-shadow: none;
  }
}
</style>
