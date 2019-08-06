<template>
  <div class="index-page">
    <TabNav value="sale" :list="typeList"/>

    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
      <template slot="acts">
        <!-- <Button
          type="success"
          icon="md-add-circle"
        >新建</Button> -->
      </template>

      <template slot="action" slot-scope="{ row: { id, status } }">
        <div class="row-acts">
          <!-- <router-link
            :to="{
              name: 'data-kol-account-edit',
              params: {
                id,
                action: status == 1 ? 'audit' : 'edit'
              }
            }"
          >{{status == 1 ? '审核' : '编辑'}}</router-link> -->
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { typeList, querySaleList } from './data'
import { alert, toast } from '@/ui/modal'
import { EditDialog, Field } from '@/components/editForm'
import TabNav from '@/components/tabNav'

@Component({
  components: {
    ListPage,
    EditDialog,
    TabNav
  }
})
export default class IndexPage extends ViewBase {
  get listPage() {
    return this.$refs.listPage as ListPage
  }

  fetch = querySaleList

  get filters(): Filter[] {
    return [
      {
        name: 'companyId',
        defaultValue: 0,
        company: true,
        width: 238,
      },

      {
        name: 'orderNo',
        defaultValue: '',
        input: true,
        width: 188,
        placeholder: '订单编号'
      },

      {
        name: 'invoiceNo',
        defaultValue: '',
        input: true,
        width: 188,
        placeholder: '发票编号'
      },

      {
        name: 'status',
        defaultValue: 0,
        select: {
          enumKey: 'statusList',
        },
        width: 128,
        placeholder: '发票状态'
      },

      {
        name: 'applyTime',
        defaultValue: '',
        dateRange: true,
        width: 178,
        placeholder: '申请时间',
        dealParam(value: any) {
          const [start, end] = value.split('-')
          return {
            applyStartTime: start || null,
            applyEndTime: end || null,
          }
        }
      },

      {
        name: 'billingTime',
        defaultValue: '',
        dateRange: true,
        width: 178,
        placeholder: '开票时间',
        dealParam(value: any) {
          const [start, end] = value.split('-')
          return {
            BillingStartTime: start || null,
            BillingEndTime: end || null,
          }
        }
      },

      {
        name: 'pageIndex',
        defaultValue: 1
      },

      {
        name: 'pageSize',
        defaultValue: 20
      }
    ]
  }

  typeList = typeList

  // TODO: 可以跟进 data 自动判断是否为枚举列表
  enums = [
    'invoiceContentList',
    'invoiceTypeList',
    'payStatusList',
    'statusList',
  ]

  get columns() {
    return [
      { title: '序号', key: 'id', minWidth: 65 },
      { title: '发票金额', key: 'totalTaxFee', minWidth: 65 },
      { title: '发票类型', key: 'invoiceType', minWidth: 65, enum: 'invoiceTypeList' },
      { title: '发票内容', key: 'invoiceContent', minWidth: 65 },
      { title: '单位名称', key: 'name', minWidth: 65 },
      { title: '纳税人识别号', key: 'taxId', minWidth: 65 },
      { title: '公司ID', key: 'companyId', minWidth: 65 },
      { title: '公司名称', key: 'companyName', minWidth: 65 },
      { title: '订单编号', key: 'orderNoText', minWidth: 65 },
      { title: '业务类型', key: 'businessType', minWidth: 65 },
      { title: '申请时间', key: 'applyTime', minWidth: 65 },
      { title: '开票时间', key: 'billingTime', minWidth: 65 },
      { title: '发票编号', key: 'invoiceNo', minWidth: 65 },
      { title: '发票状态', key: 'status', minWidth: 65 },
      // {
      //   title: '账号',
      //   key: 'channelDataId',
      //   minWidth: 100,
      //   link: {
      //     name: 'data-kol-account-edit',
      //     params: it => ({ id: it.id, channel: this.channel, action: 'view' }),
      //   }
      // },
      // { title: '名称', key: 'name', minWidth: 100 },
      // { title: '分类', key: 'accountCategoryCode', minWidth: 60, editor: 'deprecated' },
      // { title: '粉丝数', key: 'fansCount', minWidth: 60 },

      // {
      //   title: '关联KOL编号',
      //   key: 'kolId',
      //   minWidth: 90,
      //   link: {
      //     name: 'data-kol-associated-detail',
      //     params: it => ({ id: it.kolId })
      //   }
      // },
      // { title: '关联KOL名称', key: 'kolName', minWidth: 100 },
      // { title: '是否提供发票', key: 'provideInvoiceText', minWidth: 90 },
      // { title: '审核状态', key: 'status', minWidth: 65, editor: 'enum' },

      { title: '操作', slot: 'action', minWidth: 50 }
    ] as ColumnExtra[]
  }

  refresh() {
    this.listPage.update()
  }
}
</script>

<style lang="less" scoped>
.button-crawl {
  margin-left: 12px;
}

.price-table {
  margin: 4px 0;
  /deep/ th,
  /deep/ td {
    height: 24px;
    background-color: #fff !important;
  }
}
</style>
