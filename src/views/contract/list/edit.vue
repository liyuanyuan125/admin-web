<template>
  <div class="edit-page">
    <EditForm
      :fields="fields"
      :fetch="fetch"
      :submit="submit"
      :hideSubmit="isView"
      :labelWidth="88"
      @done="onDone"
    >
    </EditForm>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import EditForm, { Field, Validator } from '@/components/editForm'
import { queryItem, queryProvince, queryCity, editItem, auditItem } from './data'

import LogTable from './components/logTable.vue'
import { success } from '@/ui/modal'
import { MapType } from '@/util/types'
import { devLog } from '@/util/dev'

const ratioValidator: Validator = (rule, value: Array<{ value: number }>, callback) => {
  const total = value.reduce((sum, it) => sum += it.value, 0)
  const error = isNaN(total)
    ? '请输入数字'
    : (total > 100 ? '占比之和不能大于 100' : '')
  error ? callback(new Error(error)) : callback()
}

const actionMap: MapType<any> = {
  view: null,
  edit: editItem,
  audit: (item: any) => auditItem({
    ids: [item.id],
    agree: item.auditPass,
    remark: item.auditPass ? '' : item.remark
  }),
}

@Component({
  components: {
    EditForm
  }
})
export default class EditPage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) action!: 'new' | 'edit' | 'view' | 'audit' | 'copy'

  item: any = null

  get isNew() {
    return this.action == 'new'
  }

  get isEdit() {
    return this.action == 'edit'
  }

  get isView() {
    return this.action == 'view'
  }

  get isAudit() {
    return this.action == 'audit'
  }

  get isCopy() {
    return this.action == 'copy'
  }

  get fields() {
    const isView = this.isView
    const isAudit = this.isAudit
    const readonly = isView || isAudit

    const list: Field[] = [
      {
        name: 'id',
        defaultValue: this.id,
      },

      {
        name: 'contractName',
        defaultValue: '',
        label: '合同名称',
        required: !readonly,
        span: 10,
        group: '合同主体信息',
        input: true,
      },

      {
        name: 'companyACode',
        defaultValue: '',
        label: '甲方公司',
        required: !readonly,
        span: 10,
        select: {
          enumKey: 'companyAList',
        },
      },

      {
        name: 'contractNo',
        defaultValue: '',
        label: '合同编号',
        required: !readonly,
        span: 10,
        input: true,
      },

      {
        name: 'validityDate',
        defaultValue: [0, 0],
        label: '合同有效期',
        span: 10,
        dateRange: true,
      },

    ]

    readonly && list.forEach(it => it.disabled = true)

    readonly && list.push(
      {
        name: 'audited',
        defaultValue: false,
      },

      {
        name: 'auditPass',
        defaultValue: true,
        disabled: isView,
        switch: true,
        group: '审核意见',
        label: '审核通过',
        span: 6,
        visibleCol: item => isAudit || item.audited
      },

      {
        name: 'remark',
        defaultValue: '',
        disabled: isView,
        required: true,
        input: {
          prepend: '审核不通过的理由'
        },
        span: 8,
        visible: item => !item.auditPass,
        visibleCol: item => isAudit || item.audited
      },
    )

    return list
  }

  submit = actionMap[this.action]

  fetch() {
    return queryItem({
      id: this.id
    })
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
