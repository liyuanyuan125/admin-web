<template>
  <EditDialog
    v-model="model"
    :title="title"
    :width="760"
    class="cinema-dialog"
  >
    <CinemaForm
      :key="formKey"
      v-bind="$attrs"
      v-on="$listeners"
      @addToList="model = false"
    />
  </EditDialog>
</template>

<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { EditDialog, Field } from '@/components/editForm'
import CinemaForm from './cinemaForm.vue'
import { random } from '@/fn/string'

const randomKey = () => random('editDialogForm')

@Component({
  components: {
    EditDialog,
    CinemaForm
  }
})
export default class CinemaDialog extends ViewBase {
  @Prop({ type: Boolean, default: false }) value!: boolean

  @Prop({ type: String, default: '选择影院' }) title!: string

  model = false

  // 用来预防 form 被重用，确保每次都使用新的实例
  formKey = randomKey()

  @Watch('value')
  watchValue(value: boolean) {
    this.model = value
    value && (this.formKey = randomKey())
  }

  @Watch('model')
  watchModel(value: boolean) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.cinema-dialog {
  /deep/ .ivu-modal-body {
    padding: 16px 10px 1px;
  }
  /deep/ .ivu-modal-footer {
    display: none;
  }
}
</style>
