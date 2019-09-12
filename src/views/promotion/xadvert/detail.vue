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
import BizPricingTable from './components/bizPricingTable.vue'
import LogTable from './components/logTable.vue'

import {
  beforeCreate,
  queryItem,
  newItem,
  editItem,
  auditItem,
  beforeEdit
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
  create: newItem,
  audit: (item: any) =>
    auditItem({
      id: item.id,
      pass: item.pass,
      refuseReason: item.pass ? '' : item.refuseReason
    })
}

@Component({
  components: {
    EditForm
  }
})
export default class CPMDetail extends ViewBase {

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
        label: '活动ID',
        text: true,
        span: 24,
        group: '活动信息',
        visible: (item: any) => (this.action == 'create' ? false : true)
      },

      {
        name: 'name',
        defaultValue: '',
        input: true,
        label: '活动名称',
        span: 24,
        minWidth: 350,
        required: true
      },

      {
        name: 'marketDate',
        defaultValue: [0, 0],
        dateRange: true,
        width: 350,
        span: 24,
        label: '活动时间',
        placeholder: '活动时间',
        dealParam(value: any) {
          const [beginDate, endDate] = value
          return {
            beginDate,
            endDate,
          }
        }
      },

      {
        name: 'channelCodes',
        defaultValue: [],
        check: {
          enumKey: 'channelList',
        },
        label: '适用渠道',
        span: 24,
        required: true
      },

      {
        name: 'customerType',
        defaultValue: 0,
        radio: {
          enumKey: 'customerTypeList',
        },
        label: '客户范围',
        span: 24,
        required: true
      },

      {
        name: 'type',
        defaultValue: 0,
        radio: {
          enumKey: 'typeList',
        },
        label: '促销活动类型',
        span: 24,
        required: true
      },

      {
        name: 'convertCosts',
        defaultValue: [],
        label: '按时长减免',
        component: BizPricingTable,
        span: 24,
        rules: [
          {
            validator: ratioValidator
          }
        ]
        // visible: (item: any) => ((item.adTypes.findIndex((it: any) => it == 1) !== -1) && item.type === 1)
        // ? true
        // : false
      },

      // {
      //   name: 'prevuePricingList',
      //   defaultValue: [],
      //   label: '品牌广告',
      //   component: BizPricingTable,
      //   span: 24,
      //   props: {
      //     title: '预告片广告折扣列表'
      //   },
      //   // visible: (item: any) => ((item.adTypes.findIndex((it: any) => it == 2) !== -1) && item.type === 1)
      //   // ? true
      //   // : false
      // }

    ]

    readonly && list.forEach(it => (it.disabled = true))
    readonly && list.push(
      {
        name: 'audited',
        defaultValue: false,
      },

      {
        name: 'pass',
        defaultValue: true,
        disabled: isView,
        switch: true,
        group: '审核意见',
        label: '审核通过',
        span: 6,
        visibleCol: (item: any) => isAudit || item.pass
      },

      {
        name: 'refuseReason',
        defaultValue: '',
        disabled: isView,
        required: true,
        input: {
          prepend: '审核不通过的理由'
        },
        span: 8,
        visible: (item: any) => !item.pass,
        visibleCol: (item: any) => isAudit || item.pass
      },

      {
        name: 'logList',
        defaultValue: [],
        component: LogTable,
        group: '操作日志',
        visibleCol: () => isView
      }
    )

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
    if ( this.action === 'edit' || this.action === 'audit') {
      data = await beforeEdit({
        id: this.id
      })
    } else if ( this.action === 'view') {
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
</style>
