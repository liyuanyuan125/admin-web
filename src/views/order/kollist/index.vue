<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
    <template slot="orderNo" slot-scope="{ row: { orderNo , orders , fapiao } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'order-kollist-detail', params: { orderNo , orders: 0 , fapiao : 0} }"
          >{{orderNo}}</router-link>
        </div>
      </template>
      <template slot="action" slot-scope="{ row: { orderNo , orders , fapiao } }">
        <div class="row-acts" v-if='orders == 2'>
          <router-link :to="{ name: 'order-kollist-detail', params: { orderNo , orders , fapiao } }">商务确认订单</router-link>
          <a href="javascript:;"  @click='cancel(123)'> 取消订单</a>
        </div>
        <div class="row-acts" v-else-if='orders == 3'>
          <router-link :to="{ name: 'order-kollist-detail', params: { orderNo , orders , fapiao } }">财务审核订单{{orders}}</router-link>
        </div>
        <div class="row-acts" v-else-if='orders == 4 || 8'>
          <router-link :to="{ name: 'order-kollist-detail', params: { orderNo , orders , fapiao } }" >确认支付{{orders}}</router-link>
        </div>
        <div class="row-acts" v-else-if='orders == 5'>
          <router-link :to="{ name: 'order-kollist-detail', params: { orderNo , orders , fapiao } }">接单{{orders}}</router-link>
        </div>
        <div class="row-acts" v-else-if='orders == 9'>
          <a href="javascript:;" @click='refund(456)'>退款</a>
        </div>
        <div class="row-acts" v-else-if='orders == 1 || 6 || 7'>
          <router-link :to="{ name: 'order-kollist-detail', params: { orderNo , orders , fapiao } }">---{{orders}}</router-link>
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
import { queryList } from '@/api/kollist'
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
      defaultValue: 0,
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
      defaultValue: 0,
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
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '订单状态',
      enumKey: 'statusList'
    },

    {
      name: 'billStatus',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '发票状态',
      enumKey: 'fapiaoList'
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
      { title: '订单名称', key: 'name', },
      { title: '公司ID', key: 'companyId', width: 65 },
      { title: '公司名称', key: 'companyName',   },
      { title: '平台', key: 'channelCode', width: 70, editor: 'enum'},
      { title: '推广品牌', key: 'status', width: 70, editor: 'enum'},
      { title: '下单时间', key: 'createTimeTemp', editor: 'dateTime', width: 135 },
      { title: '下单金额', key: 'money', width: 100  },
      { title: '商务确认金额', key: 'money', width: 100 },
      { title: '已支付金额', key: 'money', width: 100  },
      { title: '订单状态', key: 'orders', width: 100 , editor: 'enum' },
      { title: '发票状态', key: 'billStatus', width: 80 , editor: 'enum' },
      { title: '操作', slot: 'action' , width: 100}
    ] as ColumnExtra[]
  }

  // reloadSearch() {

  // }
  mounted() {
  }

  async cancel(id: any) {
    alert(45645465)
    try {
      await confirm('您确定取消订单吗？')
      // await dels({id})
      this.$Message.success({
        content: `取消订单成功`,
      })
      this.$router.go(0)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async refund(id: any) {
    alert(45645465)
    try {
      await confirm('本次退款金额$100000, 确定后资金会返回到客户端的账户余额中，请确认是否退款？')
      // await dels({id})
      this.$Message.success({
        content: `退款成功`,
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
