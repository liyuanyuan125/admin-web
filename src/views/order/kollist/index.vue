<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
    <template slot="orderNo" slot-scope="{ row: { orderNo , orderId , status } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'order-kollist-detail', params: { id: orderId ,  orders: 0 } }"
          >{{orderNo}}</router-link>
        </div>
      </template>
      <template slot="channelCode" slot-scope="{ row: { channelCode , orderId , status } }">
        <div class="row-acts">
          <span v-for='(it,index) in channelCodeList' :kry='index' v-if='it.key == channelCode'>{{it.text}}</span>
        </div>
      </template>
      <template slot="action" slot-scope="{ row: { orderNo , orderId , status  } }">
        <div class="row-acts" v-if='status == 2'>
          <router-link :to="{ name: 'order-kollist-detail', params: { id: orderId , orders : status   } }">商务确认订单</router-link>
          <a href="javascript:;"  @click='cancel(orderId)'> 取消订单</a>
        </div>
        <div class="row-acts" v-if='status == 3'>
          <router-link :to="{ name: 'order-kollist-detail', params: { id: orderId , orders : status  } }">财务审核订单</router-link>
        </div>
        <div class="row-acts" v-if='status == 4 || status == 8'>
          <router-link :to="{ name: 'order-kollist-detail', params: { id: orderId , orders : status  } }" >确认支付</router-link>
        </div>
        <div class="row-acts" v-if='status == 5'>
          <router-link :to="{ name: 'order-kollist-detail', params: { id: orderId , orders : status  } }">接单</router-link>
        </div>
        <div class="row-acts" v-if='status == 9'>
          <router-link :to="{ name: 'order-refund-detail', params: { 'id' : 0 , 'order': orderNo  } }">退款</router-link>
        </div>
        <div class="row-acts" v-if='status == 1 || status == 6 || status == 7 || status == 10 || status == 11'>
          ---
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import CompanyList from './filename.vue'
import { queryList , cancel  } from '@/api/kollist'
import EditDialog, { Field } from '@/components/editDialog'
import { confirm } from '@/ui/modal'

@Component({
  components: {
    ListPage,
    EditDialog
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  filters: Filter[] = [
    {
      name: 'companyName',
      defaultValue: '',
      type: CompanyList,
      width: 140,
      placeholder: '公司名称'
    },

    {
      name: 'dateRange',
      defaultValue: '',
      type: 'dateRange',
      width: 200,
      placeholder: '选择时间',
      dealParam(value: string) {
        const [startTime, endTime] = value ? value.split('-') : [null, null]
        return {
          queryStartTime : startTime ? Number(new Date(String(startTime).slice(0, 4) + '-'
            + String(startTime).slice(4, 6) + '-' +
            String(startTime).slice(6, 8)).getTime() - (8 * 60 * 60 * 1000 - 1)) : null,
          queryEndTime : endTime ? Number(new Date(String(endTime).slice(0, 4) + '-'
            + String(endTime).slice(4, 6) + '-' +
            String(endTime).slice(6, 8)).getTime() + (16 * 60 * 60 * 1000 - 1)) : null,
        }
      }
    },

    {
      name: 'projectName',
      defaultValue: '',
      type: 'input',
      width: 140,
      placeholder: '项目名称'
    },

    {
      name: 'channelCode',
      defaultValue: null,
      type: 'select',
      width: 100,
      placeholder: '平台',
      enumKey: 'channelCodeList'
    },

    {
      name: 'orderNo',
      defaultValue: '',
      type: 'input',
      width: 140,
      placeholder: '订单编号'
    },

    {
      name: 'orderStatus',
      defaultValue: null,
      type: 'select',
      width: 100,
      placeholder: '订单状态',
      enumKey: 'statusList'
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

  enums = [
    'pingtaiList',
    'channelCodeList',
    'statusList',
    'ordersList',
    'billStatusList',
  ]

  channelCodeList: any = []

  get columns() {
    return [
      { title: '订单编号', slot: 'orderNo', width: 65 },
      { title: '项目名称', key: 'projectName', },
      { title: '公司ID', key: 'companyId', width: 65 },
      { title: '公司名称', key: 'companyName',   },
      { title: '平台', slot: 'channelCode', width: 70 },
      { title: '推广品牌', key: 'brandName', width: 70, },
      { title: '下单时间', key: 'createTime', editor: 'dateTime', width: 135 },
      { title: '下单金额', key: 'totalFee', width: 100  },
      { title: '商务确认金额', key: 'confirmFee', width: 100 },
      { title: '已支付金额', key: 'payFee', width: 100  },
      { title: '订单状态', key: 'status', width: 100 , editor: 'enum' },
      { title: '操作', slot: 'action' , width: 100}
    ] as ColumnExtra[]
  }

  // reloadSearch() {

  // }
  async mounted() {
    const { data } = await queryList({})
    this.channelCodeList = data.channelCodeList
  }

  async cancel(id: any) {
    try {
      await confirm('您确定取消订单吗？')
      await cancel(id , {})
      this.$Message.success({
        content: `取消订单成功`,
      })
      this.$router.go(0)
    } catch (ex) {
      this.handleError(ex)
    }
  }


  @Watch('$route')
  watch$route(val: any) {
    // console.log(val.fullPath)
  }

}
</script>

<style lang="less" scoped>
</style>
