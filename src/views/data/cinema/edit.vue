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
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import { areaParam } from '@/components/areaSelect'
import { queryItem, addItem, updateItem } from '@/api/cinema'
import { alert, success } from '@/ui/modal'
import { MapType } from '@/util/types'
import { devLog } from '@/util/dev'
import { getCompanyList } from './data'
import { IdName } from '@/components/remoteSelect'
import { get } from 'lodash'
import BaiduMap from '@/components/baiduMap'
import TencentMap from '@/components/tencentMap'

const actionMap: MapType<any> = {
  new: addItem,
  edit: updateItem,
  view: null,
}

@Component({
  components: {
    EditForm
  }
})
export default class EditPage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) action!: 'new' | 'edit' | 'view'

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

  initCompanyList: IdName[] = []

  get fields() {
    const isView = this.isView
    const readonly = isView

    const list: Field[] = [
      {
        name: 'id',
        defaultValue: this.id,
      },

      {
        name: 'shortName',
        defaultValue: '',
        label: '影城名称',
        span: 12,
        input: true,
        required: true
      },

      {
        name: 'code',
        defaultValue: '',
        label: '专资编码',
        span: 12,
        input: true,
        required: true
      },

      {
        name: 'officialName',
        defaultValue: '',
        label: '官方名称',
        span: 12,
        input: true,
        required: true
      },

      {
        name: 'gradeCode',
        defaultValue: '',
        label: '影院等级',
        span: 12,
        select: {
          enumKey: 'gradeList',
        },
      },

      {
        name: 'chainId',
        defaultValue: 0,
        component: CinemaChainSelect,
        label: '院线',
        span: 12,
        required: true,
        backfillParam({ chainId, chainControlStatus }: any, { defaultValue }) {
          // 只有 chainControlStatus 为 1 是，chainId 的值，才是正确的
          return chainControlStatus == 1 ? chainId : defaultValue
        }
      },

      {
        name: 'softwareCode',
        defaultValue: '',
        label: '售票系统',
        span: 12,
        select: {
          enumKey: 'softwareList'
        }
      },

      {
        ...areaParam,
        label: '公司地址',
        span: 10,
        required: true,
        area: {
          noSelf: true
        }
      },

      {
        name: 'address',
        defaultValue: '',
        span: 9,
        placeholder: '详细地址',
        input: true
      },

      {
        name: 'zipCode',
        defaultValue: '',
        label: '邮编',
        span: 5,
        input: true,
      },

      {
        name: 'companyIds',
        label: '影投',
        defaultValue: [],
        span: 24,
        remote: {
          multiple: true,
          initList: this.initCompanyList,
          fetch: async (query: string) => {
            try {
              const { data: { items } } = await getCompanyList({
                name: query,
                status: 1,
                controlStatus: 1,
              })
              const ret = items || []
              return ret
            } catch (ex) {
              this.handleError(ex)
            }
          }
        }
      },

      {
        name: 'status',
        defaultValue: 0,
        label: '营业状态',
        span: 6,
        defaultEnumIndex: 0,
        select: {
          enumKey: 'statusList'
        },
        auth: 'theater.cinemas:change-status'
      },

      {
        name: 'controlStatus',
        defaultValue: 0,
        label: '控制状态',
        span: 6,
        defaultEnumIndex: 0,
        select: {
          enumKey: 'controlStatusList'
        },
        auth: 'theater.cinemas:change-control-status'
      },

      {
        name: 'pricingLevelCode',
        defaultValue: '',
        label: '定价级别',
        span: 6,
        select: {
          enumKey: 'pricingLevelList'
        },
        auth: 'theater.cinemas:change-pricing-level'
      },

      {
        name: 'boxLevelCode',
        defaultValue: '',
        label: '票房级别',
        span: 6,
        select: {
          enumKey: 'boxLevelList'
        },
        auth: 'theater.cinemas:change-box-level'
      },

      {
        name: 'baidu',
        label: '百度坐标',
        defaultValue: { lng: 0, lat: 0 },
        span: 24,
        component: BaiduMap,
        props: {
          marker: true
        },
        dealParam: ({ lng, lat }: any) => ({
          baiduLongitude: lng,
          baiduLatitude: lat
        })
      },

      {
        name: 'tencent',
        label: '腾讯坐标',
        defaultValue: { lng: 0, lat: 0 },
        span: 24,
        component: TencentMap,
        props: {
          marker: true
        },
        dealParam: ({ lng, lat }: any) => ({
          qqLongitude: lng,
          qqLatitude: lat
        })
      },
    ]

    readonly && list.forEach(it => it.disabled = true)

    return list
  }

  submit = actionMap[this.action]

  async fetch() {
    const { data } = await queryItem({
      id: this.id
    })

    const item = data.item || (data.item = {})

    item.baidu = {
      lng: item.baiduLongitude,
      lat: item.baiduLatitude
    }
    item.tencent = {
      lng: item.qqLongitude,
      lat: item.qqLatitude
    }

    const companyList = this.initCompanyList = item.companies as IdName[] || []
    item.companyIds = companyList.map(it => it.id)

    return data
  }

  async onDone() {
    await success('操作成功')
    this.$router.back()
  }
}
</script>

<style lang="less" scoped>
</style>
