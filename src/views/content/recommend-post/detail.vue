<template>
  <div class="edit-page">
    <EditForm :fields="fields" :fetch="fetch" :submit="submit" :hideSubmit="isView" :labelWidth="120" @done="onDone" >
    </EditForm>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import EditForm, { Field, Validator } from '@/components/editForm'
import { success } from '@/ui/modal'
import { MapType } from '@/util/types'
import { devLog } from '@/util/dev'

import {
  beforeCreate,
  queryItem,
  newItem,
  editItem,
} from './data'

const ratioValidator: Validator = (rule, value: Array<{ value: number }>, callback) => {
  const isInteger = value.every((it: any) => {
    return it.discount && it.discount % 1 === 0
  })
  const isNumber = value.every((it: any) => {
    return typeof it.discount === 'number'
  })
  const error = !isNumber ? '请输入数字' : !isInteger ? '请输入整数' : ''
  error ? callback(new Error(error)) : callback()
}

const actionMap: MapType<any> = {
  view: null,
  edit: editItem,
  create: newItem
}

@Component({
  components: {
    EditForm
  }
})
export default class DetailPage extends ViewBase {

  get isView() {
    return this.action == 'view'
  }

  get isEdit() {
    return this.action == 'edit'
  }

  get isAudit() {
    return this.action == 'audit'
  }

  get fields() {
    const isView = this.isView
    const isAudit = this.isAudit
    const readonly = isView || isAudit

    const list: any[] = [
      {
        name: 'id',
        defaultValue: this.id,
        label: 'ID',
        text: true,
        span: 20,
        group: '推荐位信息',
        visible: (item: any) => (this.action == 'create' ? false : true)
      },

      {
        name: 'name',
        defaultValue: '',
        input: true,
        label: '推荐位名称',
        span: 22,
        required: true
      },

      {
        name: 'recommendId',
        defaultValue: '',
        input: true,
        label: '推荐位标识',
        span: 22,
        required: true
      },

      {
        name: 'description',
        defaultValue: '',
        input: true,
        label: '推荐位描述',
        span: 22
      },
    ]

    readonly && list.forEach(it => (it.disabled = true))
    return list
  }
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) action!: 'view' | 'edit' | 'audit' | 'create'

  item: any = null
  submit = actionMap[this.action]

  bizPricingListTemp: any[] = []
  prevuePricingListTemp: any[] = []

  created() {}

  async fetch() {
    let data = null
    const beforeEditData = null
    if (this.action === 'edit' || this.action === 'view' ) {
      data = await queryItem({
        id: this.id
      })
    } else {
      data = []
    }
    return data
  }

  async onDone() {
    await success('操作成功')
    this.$router.back()
  }


}
</script>

<style lang="less" scoped>
/deep/ .col-field-auth,
/deep/ .col-field-male-percent,
/deep/ .col-field-audit-pass {
  width: auto;
}

/deep/ .col-field-auth-name,
/deep/ .col-field-remark {
  left: 4px;
}

/deep/ .ui-field-male-percent,
/deep/ .ui-field-female-percent {
  .input-number {
    width: 78px;
  }
}
</style>
