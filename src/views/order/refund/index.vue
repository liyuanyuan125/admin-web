<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
    <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          @click="editShow()"
        >创建退款单</Button>
      </template>
      <template slot="refundNo" slot-scope="{ row: { id , refundNo , orderNo , refundStatus} }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'order-refund-detail', params: { 'id' : id , 'order': orderNo  } }"
          >{{refundNo}}</router-link>
        </div>
      </template>
      <template slot="orderNo" slot-scope="{ row: { orderId , orderNo , refundStatus } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'order-kollist-detail', params: { 'id' : orderId , 'orders': 0   } }"
          >{{orderNo}}</router-link>
        </div>
      </template>
      <template slot="channelCode" slot-scope="{ row: { channelCode } }">
        <div class="row-acts">
          <span v-for='(it,index) in channelCodeList' :key='index' v-if='it.key == channelCode'>{{it.text}}</span>
        </div>
      </template>
      <template slot="action" slot-scope="{ row: { id , orderNo , refundStatus , refundFee  } }">
        <div class="row-acts">
          <a v-if='refundStatus == 1' @click='refund( id , refundFee)' style='margin-left: 6px;'>退款</a>
          <a v-if='refundStatus == 1' @click='dels( id )' style='margin-left: 6px;'>删除</a>
          <span v-if='refundStatus == 2'>--</span>
        </div>
      </template>
    </ListPage>
    <reDlg  ref="re"   v-if="reVisible" @done="dlgEditDone"/>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import CompanyList from './filename.vue'
import reDlg from './reDlg.vue'
import { queryList , delorder , finance , oktui } from '@/api/refund'
import EditDialog, { Field } from '@/components/editDialog'
import { confirm } from '@/ui/modal'


@Component({
  components: {
    ListPage,
    EditDialog,
    reDlg
  }
})
export default class Main extends ViewBase {
  fetch = queryList
  reVisible = false
  filters: Filter[] = [
    {
      name: 'companyId',
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
          startTime : startTime ? Number(new Date(String(startTime).slice(0, 4) + '-'
            + String(startTime).slice(4, 6) + '-' +
            String(startTime).slice(6, 8)).getTime() - (8 * 60 * 60 * 1000)) : null,
          endTime : endTime ? Number(new Date(String(endTime).slice(0, 4) + '-'
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
      name: 'refundNo',
      defaultValue: '',
      type: 'input',
      width: 140,
      placeholder: '退款单编号'
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
    'refundStatusList',
    'channelCodeList'
  ]

  channelCodeList: any = []

  get columns() {
    return [
      { title: '退款单编号', slot: 'refundNo', width: 125 },
      { title: '订单编号', slot: 'orderNo', width: 100 },
      { title: '项目名称', key: 'projectName'  },
      { title: '公司ID', key: 'companyId', width: 80 },
      { title: '公司名称', key: 'companyName' },
      { title: '平台', slot: 'channelCode', width: 80},
      { title: '退款申请时间', key: 'applyTime', editor: 'dateTime', width: 135 },
      { title: '退款金额', key: 'refundFee', width: 100 },
      { title: '已支付金额', key: 'payFee', width: 100 },
      { title: '退款单状态', key: 'refundStatus', width: 80 , editor: 'enum'},
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  editShow() {
    this.reVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.re.init()
    })
  }

  async mounted() {
    const { data } = await queryList({})
    this.channelCodeList = data.channelCodeList
  }

  dlgEditDone() {
    // this.doSearch()
  }

  // 删除退款单
  async dels(id: any) {
    try {
      await confirm('您确定删除退款单吗？')
      await delorder(id)
      this.$Message.success({
        content: `删除订单成功`,
      })
      this.$router.go(0)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 退款
  async refund(id: any, money: any) {
    try {
      await confirm('本次退款金额￥' + money + ', 确定后资金会返回到客户端的账户余额中，请确认是否退款？')
      await oktui(id)
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
