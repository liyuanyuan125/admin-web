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
import AgeTable, { KeyTextValue } from './components/ageTable.vue'
import FansPane, { FansItem } from './components/fansPane.vue'
import KolsPane from './components/kolsPane.vue'
import MoivesPane from './components/moviesPane.vue'
// import PriceTable, { PriceItem } from './components/priceTable.vue'
// import LogTable from './components/logTable.vue'
import {
  beforeCreate,
  queryItem,
  newItem,
  editItem,
  auditItem,
  queryProvince,
  queryCity,
  queryKolAcounts,
  queryMoives
} from './data'

const ratioValidator: Validator = (rule, value: Array<{ value: number }>, callback) => {
  const total = value.reduce((sum, it) => (sum += it.value), 0)
  const error = isNaN(total) ? '请输入数字' : total > 100 ? '占比之和不能大于 100' : ''
  error ? callback(new Error(error)) : callback()
}

const actionMap: MapType<any> = {
  view: null,
  edit: editItem,
  create: newItem,
  audit: (item: any) =>
    auditItem({
      ids: [item.id],
      agree: item.auditPass,
      remark: item.auditPass ? '' : item.remark
    })
}

@Component({
  components: {
    EditForm
  }
})
export default class BrandProductDetail extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: Number, default: 0 }) brandId!: number

  @Prop({ type: String, default: '' }) action!: 'view' | 'edit' | 'audit' | 'create'

  channelList: any[] = []

  // 用于创建产品
  ageCodeList: any[] = []

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
        name: 'brandId',
        defaultValue: this.brandId
      },

      {
        name: 'id',
        defaultValue: this.id,
        label: '产品ID',
        text: true,
        span: 24,
        group: '基础信息',
        visible: item => (this.action == 'create' ? false : true)
      },

      {
        name: 'name',
        defaultValue: '',
        input: true,
        label: '产品中文名称',
        span: 8,
        required: true
      },

      {
        name: 'enName',
        defaultValue: '',
        input: true,
        label: '产品外文名称',
        span: 8,
        offsetLeft: 6
      },

      {
        name: 'imgsList',
        defaultValue: [],
        label: '产品图片',
        disabled: false,
        imageList: {
          withExtra: true,
          maxCount: 6
        },
        span: 22,
        offsetRight: 6
      },

      {
        name: 'marketDate',
        defaultValue: 0,
        date: true,
        placeholder: '选择日期',
        label: '产品上市日期',
        span: 22
      },

      {
        name: 'description',
        defaultValue: '',
        input: {
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 8 }
        },
        label: '产品简述',
        required: true,
        span: 22,
        offsetRight: 6
      },

      {
        name: 'keyWordsContent',
        defaultValue: '',
        input: {
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 8 }
        },
        label: '搜索关键字',
        required: true,
        span: 22,
        offsetRight: 6
      },

      {
        name: 'malePercent',
        defaultValue: 0,
        label: '粉丝性别',
        placeholder: '百分比',
        span: 7,
        group: '粉丝画像',
        number: {
          prepend: '男性',
          append: '%',
          max: 100
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
          max: 100
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
        name: 'kols',
        defaultValue: [],
        label: '推荐的KOL列表',
        component: KolsPane,
        props: {
          type: '平台',
          channelList: this.channelList,
          fetch: queryKolAcounts
        },
        span: 22,
        group: '推荐信息'
      },

      {
        name: 'movies',
        defaultValue: [],
        label: '推荐的影片列表',
        component: MoivesPane,
        props: {
          type: '影片ID',
          fetch: queryMoives
        },
        span: 22
      }
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
