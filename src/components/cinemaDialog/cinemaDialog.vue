<template>
  <EditDialog
    v-model="model"
    :title="title"
    :width="580"
    class="cinema-dialog"
  />
</template>

<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { EditDialog, Field } from '@/components/editForm'
import { AjaxResult } from '@/util/types'

@Component({
  components: {
    EditDialog
  }
})
export default class BatchAudit extends ViewBase {
  @Prop({ type: Boolean, default: false }) value!: boolean

  @Prop({ type: String, default: '选择影院' }) title!: string

  model = false

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
.batch-audit {
  /deep/ .ivu-modal-body {
    padding: 5px 10px 12px;
  }
}
</style>
