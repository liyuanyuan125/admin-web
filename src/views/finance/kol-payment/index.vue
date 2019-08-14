<template>
  <div class="index-page">
    <Tabs v-model="channelCode" type="card" class="tabs">
      <TabPane
        v-for="it in channelList"
        :key="it.value"
        :name="it.value"
        :label="it.name"
      />
    </Tabs>

    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      selectable
      :selectedIds.sync="selectedIds"
      ref="listPage"
      :disabledIds="disabledIds"
    >

      <template slot="acts-2">
        <Button
          type="primary"
          class="button-audit"
          :disabled="!(selectedIds.length > 0)"
          @click="batchInvoice"
        >批量发票登记</Button>
      </template>

      <template slot="action" slot-scope="{ row: { id, payStatus, invoiceStatus } }">
        <div class="row-acts">
          <router-link
            v-if="payStatus !== 3"
            :to="{
              name: 'finance-kol-payment-edit',
              params: {
                id,
                action: 'edit'
              }
            }"
          >财务付款</router-link>

          <router-link
            :to="invoiceRoute([id])"
            v-if="invoiceStatus === 1"
          >发票登记</router-link>
        </div>
      </template>
    </ListPage>

    <BatchAudit
      v-model="auditVisible"
      :summary="auditSummary"
      :submit="auditSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList, queryKolAcounts } from './data'
import { alert, toast } from '@/ui/modal'
import { EditDialog, Field } from '@/components/editForm'
import BatchAudit from '@/components/batchAudit'
import KolSelect from './components/kolSelect.vue'
import { getChannelList } from '@/util/types'

const channelList = getChannelList()
const defaultChannel = channelList[0].value

@Component({
  components: {
    ListPage,
    EditDialog,
    BatchAudit,
    KolSelect
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: String, default: defaultChannel }) channel!: string

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  channelCode = this.channel

  channelList = channelList

  disabledIds = [] as number[]
  selectedIds = [] as number[]

  get filters(): Filter[] {
    return [
      {
        name: 'channelCode',
        defaultValue: this.channel,
      },

      {
        name: 'kolId',
        defaultValue: '',
        type: KolSelect,
        props: {
          value: 0,
          channelCode: this.channelCode
        },
        width: 150,
        placeholder: 'KOL名称'
      },

      {
        name: 'mainOrderNo',
        defaultValue: '',
        type: 'input',
        width: 120,
        placeholder: '订单编号'
      },

      {
        name: 'subOrderNo',
        defaultValue: '',
        type: 'input',
        width: 120,
        placeholder: '子订单编号'
      },

      {
        name: 'dateRange',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '选择时间',
        dealParam(value: string) {
          // const [startTime, endTime] = value ? value.split('-') : [null, null]
          // return {
          //   queryStartTime : startTime,
          //   queryEndTime : endTime,
          // }
          const [startTime, endTime] = value ? value.split('-') : [null, null]
          return {
            queryStartTime : startTime ? Number(new Date(String(startTime).slice(0, 4) + '-'
              + String(startTime).slice(4, 6) + '-' +
              String(startTime).slice(6, 8)).getTime() - (8 * 60 * 60 * 1000)) : null,
            queryEndTime : endTime ? Number(new Date(String(endTime).slice(0, 4) + '-'
              + String(endTime).slice(4, 6) + '-' +
              String(endTime).slice(6, 8)).getTime() + (16 * 60 * 60 * 1000 - 1)) : null,
          }
        }
      },

      {
        name: 'payStatus',
        defaultValue: 0,
        enumKey: 'payStatusList',
        type: 'select',
        width: 128,
        placeholder: '付款状态'
      },

      {
        name: 'invoiceStatus',
        defaultValue: 0,
        enumKey: 'invoiceStatusList',
        type: 'select',
        width: 128,
        placeholder: '发票状态'
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

  enums = [
    'invoiceStatusList',
    'payStatusList',
    'channelCodeList',
  ]

  get columns() {
    return [
      {
        title: '序号',
        key: 'id',
        width: 65,
        link: ({ item }) => ({
          name: 'finance-kol-payment-edit',
          params: {
            id: item.id,
            action: 'view'
          }
        })
      },
      {
        title: '订单编号',
        key: 'mainOrderNo',
        width: 100,
        link: ({ item }) => ({
          name: 'order-kollist-detail',
          params: { id: item.id, orders: 0 }
        })
      },
      { title: '子订单编号', key: 'subOrderNo', minWidth: 100 },
      { title: 'KOL编号', key: 'kolId', minWidth: 60 },
      { title: 'KOL名称', key: 'kolName', minWidth: 60 },
      { title: '订单创建时间', key: 'subOrderCreateTime', width: 135, dateTime: true },
      { title: '推广品牌', key: 'brandName', minWidth: 65 },
      { title: '结算金额', key: 'status', minWidth: 65 },
      { title: '已付款金额', key: 'paidAmount', minWidth: 65 },
      { title: '待付款金额', key: 'unpaidAmount', minWidth: 65 },
      { title: '付款状态', key: 'payStatus', minWidth: 65, enum: true },
      { title: '发票状态', key: 'invoiceStatus', minWidth: 65, enum: true },
      { title: '操作', slot: 'action', width: 70 }
    ] as ColumnExtra[]
  }

  auditVisible = false

  get auditSummary() {
    const count = this.selectedIds.length
    return `您选择了${count}条。如需发票登记请点击“确认”`
  }

  batchInvoice() {
    const ids = this.selectedIds
    this.$router.push(this.invoiceRoute(ids))
  }

  invoiceRoute(ids: number[]) {
    return {
      name: 'finance-invoice-purchase-new',
      params: {
        action: 'new',
        ids: ids.join(','),
        businessType: '1'
      }
    }
  }

  refresh() {
    this.listPage.update()
  }

  auditSubmit({ agree, remark }: any) {
    if (this.selectedIds.length === 0) {
      return
    }
    const ids = this.selectedIds.join(',')
    this.$router.push({
      name: 'fapiao',
      params: {
        ids
      }
    })
  }

  async fetch(query: any) {
    const res = await queryList(query)
    const items = res.items || null
    if ( items && items.length > 0 ) {
      this.disabledIds = items.filter((it: any) => {
        return it.invoiceStatus === 3 || it.invoiceStatus === 2
      }).map((item: any) => {
        return item.id
      })
    }
    return res
  }

  @Watch('channelCode')
  watchChannelCode(channel: string) {
    this.$router.push({
      name: 'finance-kol-payment',
      params: channel == defaultChannel ? {} : { channel }
    })
  }

  @Watch('channel')
  watchChannel(channel: string) {
    this.listPage.query.channelCode = channel
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
