<template>
  <div class="edit-page">
    <EditForm
      :fields="fields"
      :fetch="fetch"
      :labelWidth="88"
      queryKeys="id,channel"
    >
    </EditForm>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import EditForm, { Field, Validator } from '@/components/editForm'
import { queryItem, queryProvince, queryCity } from './data'
import AgeTable, { KeyTextValue } from './components/ageTable.vue'
import FansPane, { FansItem } from './components/fansPane.vue'
import PriceTable, { PriceItem } from './components/priceTable.vue'

const ratioValidator: Validator = (rule, value: Array<{ value: number }>, callback) => {
  const total = value.reduce((sum, it) => sum += it.value, 0)
  const error = isNaN(total)
    ? '请输入数字'
    : (total > 100 ? '占比之和不能大于 100' : '')
  error ? callback(new Error(error)) : callback()
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

  get fields() {
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
        required: true,
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
        input: {
          prepend: '认证企业名称'
        },
        span: 8,
        visible: item => item.auth
      },

      {
        name: 'fansCount',
        defaultValue: 0,
        label: '粉丝数',
        required: true,
        placeholder: '粉丝数',
        span: 6,
        group: '粉丝画像',
        number: true
      },

      {
        name: 'malePercent',
        defaultValue: 0,
        label: '粉丝性别',
        placeholder: '百分比',
        span: 6,
        number: {
          prepend: '男性',
          append: '%',
          max: 100,
          showZero: true,
        }
      },

      {
        name: 'femalePercent',
        defaultValue: 0,
        placeholder: '百分比',
        span: 4,
        number: {
          prepend: '女性',
          append: '%',
          max: 100,
          showZero: true,
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

    const isView = this.action == 'view'
    const isAudit = this.action == 'audit'
    const readonly = isView || isAudit
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
        placeholder: '请输入审核不通过的理由',
        input: {
          prepend: '备注'
        },
        span: 8,
        visible: item => !item.auditPass
      }
    )

    return list
  }

  fetch = queryItem
}
</script>

<style lang="less" scoped>
/deep/ .col-i-switch-auth,
/deep/ .col-number-input-male-percent,
/deep/ .col-i-switch-audit-pass {
  width: auto;
}

/deep/ .col-form-input-auth-name,
/deep/ .col-form-input-remark {
  left: 4px;
}

/deep/ .ui-number-input-male-percent,
/deep/ .ui-number-input-female-percent {
  .number-input {
    width: 128px;
    input {
      text-align: center;
    }
  }
}
</style>
