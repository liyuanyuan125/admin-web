<template>
  <span class="image-previewer flex-mid">
    <img :src="url" class="image" @click="onView">
    <Modal v-model="viewerShow" :width="width" class="viewer"
      @click.native="viewerShow = false">
      <p class="viewer-tip">轻点关闭</p>
      <div class="flex-mid">
        <TinyLoading v-if="showLoading"/>
        <img :src="viewerImage" class="viewer-image" v-else>
      </div>
      <div slot="footer"></div>
    </Modal>
  </span>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'
import loadImage from '@/fn/loadImage'

@Component({
  components: {
    TinyLoading
  }
})
export default class ImagePreviewer extends ViewBase {
  /**
   * 正常图片的地址
   */
  @Prop({ type: String, default: '', required: true }) url!: string

  /**
   * 大图的地址，可选，若没有，则使用 url 作为大图地址
   */
  @Prop({ type: String, default: '' }) bigUrl!: string

  /**
   * 查看器宽度，默认为 888
   */
  @Prop({ type: Number, default: 888 }) width!: number

  viewerShow = false
  viewerImage = ''
  showLoading = false

  async onView() {
    const url = this.bigUrl || this.url
    this.viewerImage = url
    this.viewerShow = true

    this.showLoading = true
    await loadImage(url)
    this.showLoading = false
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.image {
  max-width: 100%;
  cursor: pointer;
}

.viewer {
  /deep/ .ivu-modal {
    top: 38px;
    margin-bottom: 38px;
  }
  /deep/ .ivu-modal-content {
    background-color: transparent;
    box-shadow: none;
  }
  /deep/ .ivu-modal-close {
    display: none;
  }
  /deep/ .ivu-modal-body,
  /deep/ .ivu-modal-footer {
    padding: 0;
  }
}

.viewer-tip {
  text-align: center;
  color: #ddd;
  cursor: pointer;
  margin-bottom: 10px;
}

.viewer-image {
  max-width: 100%;
}
</style>
