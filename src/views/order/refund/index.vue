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
    <template slot="orderNo" slot-scope="{ row: { orderNo } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'order-kollist-detail', params: { orderNo } }"
          >{{orderNo}}</router-link>
        </div>
      </template>
      <template slot="action" slot-scope="{ row: { orderNo , status  } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'order-kollist-detail', params: { orderNo } }"
          >详情{{status}}</router-link>
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
import { queryList , delorder } from '@/api/refund'
import EditDialog, { Field } from '@/components/editDialog'


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
      enumKey: 'statusList'
    },

    {
      name: 'orderNo',
      defaultValue: '',
      type: 'input',
      width: 140,
      placeholder: '订单编号'
    },

    {
      name: 'companyId2',
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
    'statusList',
  ]

  get columns() {
    return [
      { title: '退款单编号', slot: 'orderNo', width: 65 },
      { title: '订单编号', slot: 'orderNo', width: 65 },
      { title: '项目名称', key: 'movieName', minWidth: 160 },
      { title: '公司ID', slot: 'orderNo', width: 65 },
      { title: '公司名称', key: 'movieName', minWidth: 160 },
      { title: '平台', key: 'applyTime', editor: 'dateTime', width: 135 },
      { title: '下单时间', key: 'operationTime', editor: 'dateTime', width: 135 },
      { title: '退款金额', key: 'status', width: 100 , editor: 'enum' },
      { title: '已支付金额', key: 'status', width: 100 , editor: 'enum' },
      { title: '退款单状态', key: 'status', width: 100 , editor: 'enum' },
      { title: '操作', slot: 'action', width: 55 }
    ] as ColumnExtra[]
  }

  editShow(id: any) {
    this.reVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.re.init(id)
    })
  }

  mounted() {
  }

  dlgEditDone() {
    // this.doSearch()
  }

  // 删除退款单
  async cancel(id: any) {
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
  async refund(id: any) {
    try {
      await confirm('本次退款金额￥100000, 确定后资金会返回到客户端的账户余额中，请确认是否退款？')
      // await delorder({id})
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
