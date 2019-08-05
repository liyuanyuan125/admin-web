<template>
  <div class="edit-page">
    <EditForm :fields="fields" :fetch="fetch" :submit="submit" :hideSubmit="isView" :labelWidth="120" @done="onDone">
    </EditForm>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import EditForm, { Field, Validator } from '@/components/editForm'
import { success } from '@/ui/modal'
import { MapType } from '@/util/types'
import { devLog } from '@/util/dev'
// import PriceTable, { PriceItem } from './components/priceTable.vue'
// import LogTable from './components/logTable.vue'
import {
  queryItem,
  editItem,
  auditItem,
  queryKolAcounts,
} from './data'

const ratioValidator: Validator = (rule, value: Array<{ value: number }>, callback) => {
  const total = value.reduce((sum, it) => (sum += it.value), 0)
  const error = isNaN(total) ? '请输入数字' : total > 100 ? '占比之和不能大于 100' : ''
  error ? callback(new Error(error)) : callback()
}

const actionMap: MapType<any> = {
  view: null,
  edit: editItem
}

@Component({
  components: {
    EditForm
  }
})
export default class BrandProductDetail extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) action!: 'view' | 'edit'

  channelList: any[] = []

  // 用于创建产品
  ageCodeList: any[] = []

  get isView() {
    return this.action == 'view'
  }

  get isEdit() {
    return this.action == 'edit'
  }

  get fields() {
    const isView = this.isView
    const readonly = isView

    const list: Field[] = [

      {
        name: 'id',
        defaultValue: this.id,
        label: '产品ID',
        text: true,
        span: 24,
        group: '订单基本信息',
        // visible: item => (this.action == 'edit' ? false : true)
      },

      {
        name: 'name',
        defaultValue: '',
        input: true,
        label: '产品中文名称',
        span: 8,
        required: true
      },


      // {
      //   name: 'marketDate',
      //   defaultValue: 0,
      //   date: true,
      //   placeholder: '选择日期',
      //   label: '产品上市日期',
      //   span: 22
      // },


      // {
      //   name: 'kols',
      //   defaultValue: [],
      //   label: '推荐的KOL列表',
      //   component: KolsPane,
      //   props: {
      //     type: '平台',
      //     channelList: this.channelList,
      //     fetch: queryKolAcounts
      //   },
      //   span: 22,
      //   group: '推荐信息'
      // },

    ]

    readonly && list.forEach(it => (it.disabled = true))
    /*
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

      {
        name: 'logList',
        defaultValue: [],
        component: LogTable,
        group: '操作日志',
        visibleCol: () => isView
      }
    )
    */
    return list
  }

  item: any = null

  submit = actionMap[this.action]

  created() {}

  async fetch() {
    let data = null
    if (this.action === 'edit' || this.action === 'view') {
      data = await queryItem({
        id: this.id
      })
      if (data.channelCodeList && data.channelCodeList.length > 0) {
        this.channelList = data.channelCodeList
      }
    } else {
      data = await beforeCreate()
      this.channelList =
        data.channelCodeList && data.channelCodeList.length > 0
          ? data.channelCodeList
          : []
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
