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

  postId: number|string|null = null

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
        name: 'postId',
        defaultValue: this.postId,
      },

      {
        name: 'id',
        defaultValue: this.id,
        label: 'ID',
        text: true,
        span: 20,
        visible: (item: any) => (this.action == 'create' ? false : true)
      },

      {
        name: 'name',
        defaultValue: '',
        input: {
          maxlength: 50
        },
        label: '名称',
        span: 22,
        required: true
      },

      {
        name: 'marketDate',
        defaultValue: [0, 0],
        dateRange: true,
        width: 350,
        span: 22,
        required: true,
        label: '时间',
        placeholder: '时间',
        dealParam(value: any) {
          const [beginTime, endTime] = value
          return {
            beginTime,
            endTime,
          }
        }
      },

      {
        name: 'channels',
        defaultValue: [],
        check: {
          enumKey: 'channelList',
        },
        label: '适用渠道',
        span: 20,
        required: true
      },

      {
        name: 'uploadPic',
        defaultValue: '',
        label: '上传图片(80*80px)',
        span: 18,
        image: true,
        required: true
      },

      {
        name: 'isAD',
        defaultValue: false,
        switch: true,
        label: '是否广告',
        required: true,
        span: 22,
      },

      {
        name: 'url',
        defaultValue: '',
        input: true,
        label: '跳转地址',
        span: 22,
      },

      {
        name: 'title',
        defaultValue: '',
        input: true,
        label: '标题',
        span: 22,
      },

    ]

    readonly && list.forEach(it => (it.disabled = true))
    return list
  }
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) action!: 'view' | 'edit' | 'audit' | 'create'

  item: any = null
  submit = actionMap[this.action]

  created() {
    this.postId = parseInt(this.$route.params.postId, 0) || null
  }

  async fetch() {
    let data = null
    const beforeEditData = null
    if (this.action === 'edit' || this.action === 'view' ) {
      data = await queryItem({
        id: this.id
      })
    } else {
      data = await beforeCreate()
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
/deep/ .col-field-upload-pic {
  padding-bottom: 20px;
}
</style>
