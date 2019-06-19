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
      <template slot="action" slot-scope="{ row: { orderNo , orderId , status  } }">
        <div class="row-acts" v-if='status == 2'>
          <router-link :to="{ name: 'order-kollist-detail', params: { id: orderId , orders : status   } }">商务确认订单</router-link>
          <a href="javascript:;"  @click='cancel(orderNo)'> 取消订单</a>
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
      defaultValue: null,
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
          startTime,
          endTime
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
      enumKey: 'pingtaiList'
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
    'statusList',
    'ordersList',
    'billStatusList'
  ]

  get columns() {
    return [
      { title: '订单编号', slot: 'orderNo', width: 65 },
      { title: '项目名称', key: 'projectName', },
      { title: '公司ID', key: 'companyId', width: 65 },
      { title: '公司名称', key: 'companyName',   },
      { title: '平台', key: 'channelCode', width: 70, editor: 'enum'},
      { title: '推广品牌', key: 'brandId', width: 70, editor: 'enum'},
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
  mounted() {
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
