<template>
  <div class="index-page">
    <Tabs v-model="status" type="card" class="tabs">
      <TabPane
        v-for="it in statusList"
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
      ref="listPage"
    >
      <template slot="sort" slot-scope="{ row , index }">
        <div class="row-acts">
         <span>{{index + 1}}</span>
        </div>
      </template>
      <template slot="action" slot-scope="{ row }">
        <div class="row-acts">
         <span style='color: #2b85e4;cursor: pointer;' @click='view(row.id)'>确认汇款</span>
        </div>
      </template>
    </ListPage>
    <Modal v-model="viewerShow" title="查看图片" width="500" height="500">
      <img style="width: 100%;" :src="viewerImage" alt sizes srcset>
    </Modal>
    <DlgEdit  ref="addOrUpdate" v-if="addOrUpdateVisible" @done="done"/>

  </div>
</template>

<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from '@/api/examine'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'

import EditDialog, { Field } from '@/components/editDialog'
import { formatNumber } from '@/util/validateRules'
import DlgEdit from './dlgEdit.vue'


  const statusList: any = [
    { name: '待审核', value: '1' },
    { name: '已通过', value: '2' },
    { name: '已拒绝', value: '3' },
  ]
  const defaultPay: any = statusList[0].value

@Component({
  components: {
    ListPage,
    EditDialog,
    DlgEdit
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: String, default: defaultPay }) pay!: string

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  addOrUpdateVisible = false


  status = this.pay

  statusList = statusList

  // 查看图片
  viewerShow = false
  viewerImage = ''


  fetch = queryList


  get filters(): Filter[] {
    return [
      {
        name: 'status',
        defaultValue: this.pay,
      },

      {
        name: 'id',
        defaultValue: '',
        type: 'input',
        width: 168,
        placeholder: '订单号'
      },

      {
        name: 'accountName',
        defaultValue: '',
        type: 'input',
        width: 168,
        placeholder: '汇款账户名称'
      },

      {
        name: 'remittanceType',
        defaultValue: 0,
        type: 'select',
        width: 108,
        placeholder: '汇款方式'
      },

      {
        name: 'companyName',
        defaultValue: '',
        type: 'input',
        width: 168,
        placeholder: '公司名称'
      },

      {
        name: 'remittanceNo',
        defaultValue: '',
        type: 'input',
        width: 168,
        placeholder: '汇款交易流水'
      },

      {
        name: 'dateRange1',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '汇款日期',
        dealParam(value: string) {
          const [beginDate, endDate] = value ? value.split('-') : [null, null]
            return {
              beginDate : beginDate ? Number(new Date(String(beginDate).slice(0, 4) + '-'
              + String(beginDate).slice(4, 6) + '-' +
              String(beginDate).slice(6, 8)).getTime() - (8 * 60 * 60 * 1000)) : null,
              endDate : endDate ? Number(new Date(String(endDate).slice(0, 4) + '-'
              + String(endDate).slice(4, 6) + '-' +
              String(endDate).slice(6, 8)).getTime() + (16 * 60 * 60 * 1000 - 1)) : null,
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

  enums = [
    'statusList',
    'remittanceTypeList',
    'businessTypeList'
  ]

  get formatNumber() {
    return formatNumber
  }

  get columns() {
    const two: any = [
      { title: '序号', slot: 'sort' , maxWidth: 65},
      { title: '订单号', key: 'id' , maxWidth: 65},
      { title: '公司名称', key: 'companyName'},
      { title: '业务类型', key: 'businessType', maxWidth: 65, editor: 'enum' },
      { title: '汇款人姓名', key: 'accountName', maxWidth: 60 },
      { title: '汇款账户名称', key: 'accountNumber' },
      { title: '汇款方式', key: 'remittanceType', width: 65, editor: 'enum' },
      { title: '汇款交易流水', key: 'remittanceNo', },
      { title: '汇款金额', key: 'amount', maxWidth: 100,
        render: (hh: any, { row: { amount } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = String(amount)
        if (amount == null) {
          return <span class='datetime' v-html='-'></span>
        } else {
          if (html.indexOf('.') == -1) {
            return <span class='datetime' v-html={amount + '.00'}></span>
          } else {
            return <span class='datetime' v-html={amount}></span>
          }
        }
       }
      },
      { title: '汇款日期', key: 'remittanceDate', width: 75, editor: 'dateTime' },
      // { title: '汇款底单', key: 'receipt', },
      {
        title: '汇款底单',
        align: 'center',
        width: 100,
        render: (hh: any, { row: { receipt } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return (
            <a
              href="javascript:;"
              on-click={this.onView.bind(this , receipt)}
              class="operation">
              查看
            </a>
          )
          /* tslint:enable */
        }
      },
      { title: '状态', key: 'status', width: 65, editor: 'enum' }
    ]
    const threeID = [
      { title: '操作时间', key: 'approvalTime', width: 75, editor: 'dateTime' },
      { title: '操作人', key: 'approvalName', width: 60 },
      { title: '操作备注信息', key: 'rejectReason', },
    ]
    const threeN = [
      { title: '操作', slot: 'action', width: 65 }
    ]

    return this.status == '1' ? [ ...two , ...threeN] :
    [ ...two , ...threeID ] as ColumnExtra[]
  }

  done() {
    this.refresh()
  }

  refresh() {
    this.listPage.update()
  }

   // 确认汇款
  view(id: number) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id)
    })
  }

  // 查看图片
  onView(url: string) {
    this.viewerImage = url
    this.viewerShow = true
  }

  @Watch('status')
  watchstatus(pay: any) {
    this.$router.push({
      name: 'finance-examine-newindex',
      params: pay == defaultPay ? {} : { pay }
    })
  }

  @Watch('pay')
  watchPay(pay: any) {
    this.listPage.query.status = pay
  }
}
</script>

<style lang="less" scoped>
.settlement-price-list {
  text-align: left;
}

.price-table {
  margin: 4px 0;
  /deep/ th,
  /deep/ td {
    height: 24px;
    background-color: #fff !important;
  }
}
/deep/ .ivu-input {
  margin-bottom: 15px;
}
/deep/ .ivu-select {
  margin-bottom: 15px;
}
/deep/ .ivu-btn {
  margin-bottom: 15px;
}
/deep/ .ivu-page .ivu-select {
  margin-bottom: 0;
}
</style>
