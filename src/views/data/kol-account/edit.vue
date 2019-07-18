<template>
  <div class="edit-page">
    <EditForm
      :fields="fields"
      :fetch="fetch"
      :submit="submit"
      :hideSubmit="isView"
      :labelWidth="88"
      @done="onDone"
      queryKeys="id,channel"
    >
    </EditForm>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import EditForm, { Field, Validator } from '@/components/editForm'
import { queryItem, queryProvince, queryCity, editItem, auditItem } from './data'
import AgeTable, { KeyTextValue } from './components/ageTable.vue'
import FansPane, { FansItem } from './components/fansPane.vue'
import PriceTable, { PriceItem } from './components/priceTable.vue'
import { success } from '@/ui/modal'
import { MapType } from '@/util/types'

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
  audit: auditItem,
}

@Component({
  components: {
    EditForm
  }
})
export default class EditPage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) channel!: string

  @Prop({ type: String, default: '' }) action!: 'view' | 'edit' | 'audit'

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

    const list: Field[] = [
      {
        name: 'id',
        defaultValue: this.id,
      },

      {
        name: 'channel',
        defaultValue: this.channel,
      },

      {
        name: 'channelDataId',
        defaultValue: '',
        text: true,
        label: '账号',
        span: 8,
        group: '基本信息',
      },

      {
        name: 'photo',
        defaultValue: '',
        label: '头像',
        span: 8,
        image: true
      },

      {
        name: 'name',
        defaultValue: '',
        text: true,
        label: '账号名称',
        span: 22
      },

      {
        name: 'intro',
        defaultValue: '',
        input: {
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 8 }
        },
        label: '功能介绍',
        span: 22
      },

      {
        name: 'accountCategoryCode',
        defaultValue: '',
        select: {
          enumKey: 'accountCategoryList',
        },
        label: '账号分类',
        required: !readonly,
        span: 8,
      },

      {
        name: 'area',
        defaultValue: [0, 0],
        label: '所在地区',
        span: 8,
        area: {
          maxLevel: 2,
          noSelf: true,
        },
        offsetRight: 6,
        dealParam: ([provinceId, cityId]: number[]) => ({
          provinceId: provinceId || 0,
          cityId: cityId || 0,
        }),
        backfillParam: ({ provinceId, cityId }: any) => [
          provinceId || 0,
          cityId || 0,
        ]
      },

      {
        name: 'type',
        defaultValue: 0,
        required: true,
        radio: {
          enumKey: 'typeList'
        },
        label: '账号类型',
        span: 8,
      },

      {
        name: 'auth',
        defaultValue: false,
        switch: true,
        label: '是否认证',
        span: 6,
      },

      {
        name: 'authName',
        defaultValue: '',
        required: true,
        input: {
          prepend: '认证企业名称'
        },
        span: 10,
        visible: item => item.auth
      },

      {
        name: 'fansCount',
        defaultValue: 0,
        label: '粉丝数',
        required: !readonly,
        placeholder: '粉丝数',
        span: 6,
        group: '粉丝画像',
        number: {
          poptip: true
        }
      },

      {
        name: 'malePercent',
        defaultValue: 0,
        label: '粉丝性别',
        placeholder: '百分比',
        span: 7,
        number: {
          prepend: '男性',
          append: '%',
          max: 100,
        }
      },

      {
        name: 'femalePercent',
        defaultValue: 0,
        placeholder: '百分比',
        span: 5,
        number: {
          prepend: '女性',
          append: '%',
          max: 100,
        }
      },

      {
        name: 'ageList',
        defaultValue: [],
        label: '粉丝年龄区间',
        component: AgeTable,
        span: 22,
        rules: [
          {
            validator: ratioValidator
          }
        ]
      },

      {
        name: 'provinceList',
        defaultValue: [],
        label: '粉丝省份分布',
        component: FansPane,
        props: {
          type: '省份',
          fetch: queryProvince
        },
        span: 22,
        rules: [
          {
            validator: ratioValidator
          }
        ]
      },

      {
        name: 'cityList',
        defaultValue: [],
        label: '粉丝城市分布',
        component: FansPane,
        props: {
          type: '城市',
          fetch: queryCity
        },
        span: 22,
        rules: [
          {
            validator: ratioValidator
          }
        ]
      },

      {
        name: 'priceList',
        defaultValue: [],
        group: '结算信息',
        label: '结算价',
        component: PriceTable,
        span: 22,
      },

      {
        name: 'provideInvoice',
        defaultValue: false,
        switch: true,
        label: '是否提供发票',
        span: 6,
      },
    ]

    readonly && list.forEach(it => it.disabled = true)

    readonly && list.push(
      {
        name: 'auditPass',
        defaultValue: true,
        disabled: isView,
        switch: true,
        group: '审核意见',
        label: '审核通过',
        span: 6,
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
        visible: item => !item.auditPass
      }
    )

    return list
  }

  fetch = queryItem

  submit = actionMap[this.action]

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
