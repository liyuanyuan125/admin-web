<template>
  <Modal
    v-model="model"
    :width="width"
    :loading="submitLoadingIn"
    @on-ok="$emit('ok')"
    @on-cancel="$emit('cancel')"
  >
    <main class="modal-main">
      <slot></slot>

      <div class="inner-loading flex-mid" v-show="loadingIn">
        <TinyLoading :size="38"/>
      </div>
    </main>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'

@Component({
  components: {
    TinyLoading
  }
})
export default class BaseDialog extends ViewBase {
  /**
   * model，支持双向绑定
   */
  @Prop({ type: Boolean, default: false }) value!: boolean

  /**
   * 对话框宽度
   */
  @Prop({ type: Number, default: 770 }) width!: number

  /**
   * 内部 loading 状态，默认为 false，此非 iview Modal 的 loading 属性
   */
  @Prop({ type: Boolean, default: false }) loading!: boolean

  /**
   * 对话框 loading 状态，与 Modal 不同的是，默认为 true
   * https://www.iviewui.com/components/modal
   */
  @Prop({ type: Boolean, default: true }) submitLoading!: boolean

  model = this.value

  loadingIn = this.loading

  submitLoadingIn = this.submitLoading

  public resetSubmitLoading() {
    this.submitLoadingIn = false
    this.$nextTick(() => this.submitLoadingIn = true)
    return this
  }

  @Watch('value')
  watchValue(value: boolean) {
    this.model = value
  }

  @Watch('model')
  watchModel(value: boolean) {
    this.$emit('input', value)
  }

  @Watch('loading')
  watchInnerLoading(value: boolean) {
    this.loadingIn = value
  }
}
</script>

<style lang="less" scoped>
.modal-main {
  position: relative;
  padding: 18px 28px 0 0;
}

.inner-loading {
  position: absolute;
  top: 18px;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
