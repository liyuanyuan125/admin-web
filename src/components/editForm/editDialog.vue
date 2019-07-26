<template>
  <Modal
    v-model="model"
    :title="title"
    :width="width"
    :loading="submitLoading"
    @on-ok="onSubmit"
  >
    <main class="modal-main">
      <EditForm
        v-bind="$attrs"
        @validateFail="$emit('validateFail', $event), resetSubmitLoading()"
        @beforeSubmit="$emit('beforeSubmit', $event)"
        @submitPrevented="$emit('submitPrevented', $event), resetSubmitLoading()"
        @done="$emit('done', $event)"
        @fail="$emit('fail', $event)"
        @always="$emit('always', $event), resetSubmitLoading()"
        ref="form"
        v-if="model"
      />
    </main>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import EditForm from './editForm.vue'

@Component({
  components: {
    EditForm
  }
})
export default class EditDialog extends ViewBase {
  /** 对话框可见性 */
  @Prop({ type: Boolean, default: false }) value!: boolean

  /** 对话框标题 */
  @Prop({ type: String, default: '' }) title!: boolean

  /** 对话框宽度 */
  @Prop({ type: Number, default: 770 }) width!: number

  model = this.value

  submitLoading = true

  resetSubmitLoading() {
    this.submitLoading = false
    this.$nextTick(() => (this.submitLoading = true))
  }

  onSubmit() {
    const form = this.$refs.form as EditForm
    form.onSubmit()
  }

  @Watch('value')
  watchValue(value: boolean) {
    this.model = value
  }

  @Watch('model')
  watchModel(value: boolean) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.modal-main {
  position: relative;
  /deep/ .form {
    padding-bottom: 0;
  }
  /deep/ .form-group {
    border: 0;
    padding: 0;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  /deep/ .submit-line {
    display: none;
  }
}
</style>
