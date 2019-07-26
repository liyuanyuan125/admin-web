<template>
  <EditDialog
    v-model="model"
    :title="title"
    :width="580"
    :fields="fields"
    :fetch="fetch"
    :submit="submit"
    hideSubmit
    hideReturn
    class="batch-audit"
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

  @Prop({ type: String, default: '批量审核' }) title!: string

  @Prop({ type: String, default: '' }) summary!: string

  @Prop({ type: Function }) submit!: (data: any) => Promise<AjaxResult | any>

  model = false

  get fields() {
    return [
      {
        name: 'summary',
        defaultValue: this.summary,
        span: 24,
        text: true
      },

      {
        name: 'agree',
        defaultValue: true,
        switch: true,
        label: '审核通过',
        span: 8,
        autoWidth: true
      },

      {
        name: 'remark',
        defaultValue: '',
        required: true,
        input: {
          prepend: '审核不通过的理由'
        },
        span: 16,
        visible: item => !item.agree,
      }
    ] as Field[]
  }

  fetch() {
    return {
      agree: true,
      remark: ''
    }
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
.batch-audit {
  /deep/ .ivu-modal-body {
    padding: 5px 10px 12px;
  }
}
</style>
