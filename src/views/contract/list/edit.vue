<template>
  <div class="edit-page">
    <EditForm
      :fields="fields"
      :fetch="fetch"
      :submit="submit"
      :hideSubmit="isView"
      :labelWidth="88"
      @done="onDone"
      ref="editForm"
    >
    </EditForm>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import EditForm, { Field, Validator } from '@/components/editForm'
import { queryItem, editItem, auditItem } from './data'
import PriceTable from './components/priceTable.vue'
import CinemaTable from './components/cinemaTable.vue'
// import LogTable from './components/logTable.vue'
import { alert, success } from '@/ui/modal'
import { MapType, CancelableEvent } from '@/util/types'
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

const isEmptyString = (string: string) => String(string).trim() == ''

@Component({
  components: {
    EditForm
  }
})
export default class EditPage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) action!: 'new' | 'edit' | 'view' | 'audit' | 'copy'

  get editForm() {
    return this.$refs.editForm as EditForm
  }

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

      {
        name: 'companyBId',
        defaultValue: 0,
        label: '公司名称',
        span: 10,
        group: '乙方信息',
        company: true,
      },

      {
        name: 'companyBContact',
        defaultValue: '',
        label: '联系人',
        span: 10,
        input: true,
      },

      {
        name: 'companyBPhone',
        defaultValue: '',
        label: '联系电话',
        span: 10,
        input: true,
      },

      {
        name: 'provideQuery',
        defaultValue: false,
        label: '是否提供观影人次查询接口',
        labelWidth: 172,
        span: 10,
        switch: true,
      },

      {
        name: 'freeVideo',
        defaultValue: false,
        label: '是否提供15秒免费鲸娱广告片',
        labelWidth: 172,
        span: 10,
        switch: true,
      },

      {
        name: 'resourceTimeLimit',
        defaultValue: false,
        label: '是否限制资源时间区间',
        labelWidth: 172,
        span: 6,
        switch: true,
        autoWidth: true,
      },

      {
        name: 'resourceTimeSection',
        defaultValue: '',
        required: true,
        input: {
          prepend: '资源时间区间'
        },
        span: 6,
        visible: item => item.resourceTimeLimit,
      },

      {
        name: 'settlementType',
        defaultValue: '',
        select: {
          enumKey: 'settlementTypeList',
        },
        label: '结算周期',
        group: '普通广告片结算规则',
        span: 8,
      },

      {
        name: 'settlementPrice',
        defaultValue: {},
        label: '结算价格',
        component: PriceTable,
        props: {
          enumKey: 'cityGradeList',
        },
        span: 22,
      },

      {
        name: 'accountBank',
        defaultValue: '',
        label: '结算账号',
        placeholder: '请输入开户行',
        span: 8,
        input: {
          autocomplete: 'on',
          poptip: true,
        },
      },

      {
        name: 'accountName',
        defaultValue: '',
        placeholder: '请输入账户名',
        span: 4,
        input: {
          poptip: true,
        }
      },

      {
        name: 'accountNumber',
        defaultValue: '',
        placeholder: '请输入账号',
        span: 8,
        input: {
          type: 'number',
          poptip: 'bank',
        },
      },

      {
        name: 'cinemaList',
        defaultValue: [],
        label: '　',
        component: CinemaTable,
        props: {
          filterCinema: this.filterCinema
        },
        handlers: {
          beforeSelect: (ev: CancelableEvent) => {
            const { accountBank, accountName, accountNumber } = this.editForm.getData()
            if (isEmptyString(accountBank)
              || isEmptyString(accountName)
              || isEmptyString(accountNumber)) {
              ev.canceled = true
              alert('结算账号必须填写完整')
            }
          }
        },
        span: 22,
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

  filterCinema: ((item: any) => any) | null = null

  async fetch() {
    const data = await queryItem({
      id: this.id
    })
    const { filterCinema } = data
    this.filterCinema = (item: any) => {
      const { accountBank, accountName, accountNumber, settlementPrice } = this.editForm.getData()
      const cityGrade = item.cityGradeCode
      const { commonPrice = null, trailerPrice = null } = settlementPrice[cityGrade] || {}
      const result = {
        ...filterCinema(item),
        commonPrice,
        trailerPrice,
        accountBank,
        accountName,
        accountNumber,
      }
      return result
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
/deep/ .col-field-cinema-list {
  margin-top: -7px;
}
</style>
