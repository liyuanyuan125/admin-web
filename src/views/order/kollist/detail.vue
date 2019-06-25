<template>
  <div>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back()" class="btn-back">返回上一页</Button>
      <div class="flex-1" style='margin-left:20px;'>
        <em>订单基本信息</em>
      </div>
    </header>

    <!-- 订单基本信息 -->
    <Table :columns="columns" :data='itemlist' border stripe disabled-hover size="small" class="table">
      <template slot="channelCode" slot-scope="{ row: { channelCode , orderId , status } }">
        <div class="row-acts">
          <span v-for='(it,index) in channelCodeList' :key='index' v-if='it.key == channelCode'>{{it.text}}</span>
        </div>
      </template>
    </Table>

     <!-- 商务确认信息 -->
    <div class='title' v-if='$route.params.orders == 4 || $route.params.orders == 8'>订单金额信息</div>
    <div v-if='$route.params.orders == 2 || $route.params.orders == 3 || $route.params.orders == 0 || $route.params.orders == 5' class='title'>商务确认</div>

    <Table  :columns="okcolumns" :data='oklist' border stripe disabled-hover size="small" class="table">
      <template slot="channelCode" slot-scope="{ row: { channelCode  } }">
        <div class="row-acts">
          <span v-for='(it,index) in channelCodeList' :key='index' v-if='it.key == channelCode'>{{it.text}}</span>
        </div>
      </template>
      <template slot="publishCategoryCode" slot-scope="{ row: { publishCategoryCode , orderId , status } }">
        <div class="row-acts">
          <span v-for='(it,index) in publishCategoryList' :key='index' v-if='it.key == publishCategoryCode'>{{it.text}}</span>
        </div>
      </template>
      <template v-if='$route.params.orders == 2 ' slot="action" slot-scope="{row}" >
          <a  @click="deletefilm(row.id)">删除</a>&nbsp;
          <a  @click="editShow(row.id , row.confirmPrice , row.confirmRemark)">编辑</a>
        </template>
    </Table>
    <div v-if='$route.params.orders == 2' style='text-align: center;margin-top: 50px;'>
      <Button class="btn-back" @click='okdata()'>提交</Button>
      <Button class="btn-back" style='margin-left: 35px;' @click="back()">取消</Button>
    </div>

    <!-- 订单支付信息 -->
    <div class='title' v-if='$route.params.orders == 8 || $route.params.orders == 0'>订单支付信息</div>
    <Table v-if='$route.params.orders == 8 || $route.params.orders == 0' :columns="ordercolumns" :data='orderlist' border stripe disabled-hover size="small" class="table">
    </Table>

     <!-- 支付信息 -->
    <div class='title' v-if='$route.params.orders == 4 || $route.params.orders == 8'>支付操作</div>
    <div v-if='$route.params.orders == 4 || $route.params.orders == 8' style="border: 1px solid #ccc; padding: 15px;">
      <Row class='row-li' v-if='$route.params.orders == 4'>支付类型：首款</Row>
      <Row class='row-li' v-if='$route.params.orders == 8'>支付类型：尾款</Row>
      <Row class='row-li'>
        <Col :span='8'>剩余待支付金额：￥{{feemoney}}</Col>
        <Col :span='8'>订单总金额 ￥{{itemlist[0].confirmFee}} <span style='color: #ccc;'>(显示商务确认的金额)</span></Col>
        <Col :span='8'>已付金额：￥{{itemlist[0].advanceFee}}</Col>
      </Row>
      <Form ref="dataForm" :model="dataForm"  label-position="left" :label-width="100" style='margin-top: 7px;'>
        <FormItem  label="支付金额" prop="reason">
        <InputNumber style="width:240px"  :min='0' :max='this.itemlist[0].confirmFee - this.itemlist[0].advanceFee' v-model="dataForm.fee"></InputNumber>
      </FormItem>
      <FormItem  label="备注" prop="reason">
        <Input style="width:240px" v-model="dataForm.remark"></Input>
      </FormItem>
      </Form>
      <Button style='margin-left:20px;' type="primary"  @click="change()">提交</Button>
      <Button style='margin-left:20px;' @click="back">取消</Button>
    </div>

    <!-- 接单信息 -->
    <div v-if='$route.params.orders == 5' class='title'>接单信息</div>
    <div v-if='$route.params.orders == 5' style="border: 1px solid #ccc; padding: 15px;">
      <Form ref="dataForm" :model="orderdataForm"  label-position="left" :label-width="100">
        <FormItem label="接单信息" prop="status">
          <RadioGroup v-model='orderdataForm.receptType'>
            <Radio v-for="it in approveStatusList"  :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if='orderdataForm.receptType == 2' label="备注" prop="reason">
        <Input style="width:240px" v-model="orderdataForm.receptRemark"></Input>
      </FormItem>
      </Form>
      <Button style='margin-left:20px;' type="primary"  @click="changeorder()">提交</Button>
      <Button style='margin-left:20px;' @click="back">取消</Button>
    </div>

     <!-- 财务审核 -->
    <div v-if='$route.params.orders == 3' class='title'>财务审核</div>
    <div v-if='$route.params.orders == 3' style="border: 1px solid #ccc; padding: 15px;">
      <Form ref="dataForm" :model="moneydataForm"  label-position="left" :label-width="100">
        <FormItem label="审核" prop="status">
          <RadioGroup v-model='moneydataForm.financeApprovalType'>
            <Radio v-for="(it,index) in moneyList"  :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if='moneydataForm.financeApprovalType == 2' label="备注" prop="reason">
        <Input style="width:240px"  v-model="moneydataForm.financeRefuseReason"></Input>
      </FormItem>
      </Form>
      <Button style='margin-left:20px;' type="primary"  @click="changemoney()">提交</Button>
      <Button style='margin-left:20px;' @click="back">取消</Button>
    </div>


    <!-- 操作日志 -->
    <div v-if='$route.params.orders == 0' class='title'>操作日志</div>
    <Table v-if='$route.params.orders == 0' :columns="logcolumns" :data='loglist' border stripe disabled-hover size="small" class="table">
    </Table>
    <reDlg  ref="re"   v-if="reVisible" @done="dlgEditDone"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import { itemlist , cancel , finance , advance , rest , recept , move , biz  } from '@/api/kollist'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import moment from 'moment'
import EditDialog, { Field } from '@/components/editDialog'
import { confirm , info } from '@/ui/modal'
import reDlg from './reDlg.vue'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm: any = {
  fee: 0,
  remark: '',
  orderId: null,
}

const moneydataForm: any = {
  financeRefuseReason: '',
  financeApprovalType: 1,
  orderId: null
}

const orderdataForm = {
  receptRemark: '',
  receptType: 1,
  orderId: null
}

@Component({
  components: {
    reDlg
  }
})
export default class Main extends ViewBase {
  reVisible = false
  editIndex = -1  // 当前聚焦的输入框的行数
  editmoney = '' // 修改金额
  beizhu = '' // 修改备注
  // 订单基本信息
  itemlist: any = []
  // 商务审核 && 订单金额
  oklist: any = []
  // 订单支付信息
  orderlist: any = []
  // 操作日志
  loglist: any = []
  feemoney: any = 0

  id = 0

  channelCodeList: any = [
    {text: '微博', key: 'weibo'}
  ]
  publishCategoryList: any = []

 // 订单基本信息
  columns = [
    { title: '订单编号', width: 70, key: 'orderNo', align: 'center' },
    { title: '项目名称', key: 'projectName', align: 'center' },
    { title: '客户id', width: 70, key: 'companyId', align: 'center' },
    { title: '客户名称', key: 'companyName', align: 'center' },
    { title: '平台', width: 70, slot: 'channelCode', align: 'center'},
    { title: '推广品牌', width: 70, key: 'brandName', align: 'center' },
    {
      title: '下单时间',
      width: 120,
      key: 'createTime',
      align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(createTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '下单金额', width: 70,  key: 'totalFee', align: 'center' },
    { title: '商务确认金额', width: 90,  key: 'confirmFee', align: 'center' },
    {
      title: '订单状态',
      width: 70,
      key: 'status',
      align: 'center',
      render: (hh: any, { row: { status } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (status == 1) {
          return <span class={`status-${status}`}>草稿</span>
        } else if (status == 2) {
          return <span class={`status-${status}`}>待商务确认</span>
        } else if (status == 3) {
          return <span class={`status-${status}`}>待财务审核</span>
        } else if (status == 4) {
          return <span class={`status-${status}`}>待支付首款</span>
        } else if (status == 5) {
          return <span class={`status-${status}`}>派单中</span>
        } else if (status == 6) {
          return <span class={`status-${status}`}>待执行</span>
        } else if (status == 7) {
          return <span class={`status-${status}`}>执行中</span>
        } else if (status == 8) {
          return <span class={`status-${status}`}>待支付尾款</span>
        } else if (status == 9) {
          return <span class={`status-${status}`}>已完成</span>
        } else if (status == 10) {
          return <span class={`status-${status}`}>已取消</span>
        } else if (status == 11) {
          return <span class={`status-${status}`}>派单失败</span>
        }
        /* tslint:enable */
      }
    }
  ]
  // 商务确认订单
  get okcolumns() {
    const data: any = [
      { title: 'kol平台账号',  key: 'kolId', align: 'center' },
      { title: 'kol平台账号名称', key: 'accountName', align: 'center' },
      { title: '平台', width: 70, slot: 'channelCode', align: 'center' },
      { title: '任务类型', slot: 'publishCategoryCode', align: 'center' },
      { title: '下单金额',  key: 'salePrice', align: 'center' },
      { title: '商务修改金额',  key: 'confirmPrice', align: 'center' },
      { title: '备注',  key: 'confirmRemark', align: 'center' },
    ]
    const opernation = [
       {
        title: '操作',
        key: 'status',
        align: 'center',
        width: 80,
        slot: 'action'
      }
    ]
    return this.$route.params.orders == '2' ? [...data, ...opernation] : data
  }
  // okcolumns = [
  //   { title: 'kol平台账号',  key: 'kolId', align: 'center' },
  //   { title: 'kol平台账号名称', key: 'accountName', align: 'center' },
  //   { title: '平台', width: 70, key: 'channelCode', align: 'center' },
  //   { title: '任务类型', key: 'publishCategoryCode', align: 'center' },
  //   { title: '下单金额',  key: 'salePrice', align: 'center' },
  //   { title: '商务修改金额',  key: 'confirmPrice', align: 'center' },
  //   { title: '备注',  key: 'confirmRemark', align: 'center' },
  // ]
  // 订单支付信息
  ordercolumns = [
    { title: '类型',  key: 'name', align: 'center' },
    { title: '支付金额', key: 'paymoney', align: 'center' },
    { title: '支付时间', key: 'paydate', align: 'center' },
    { title: '支付操作人',  key: 'payper', align: 'center' },
    { title: '备注',  key: 'beizhu', align: 'center' }
  ]
  // 操作日志
  logcolumns = [
    { title: '序号',  key: 'id', align: 'center' },
    { title: '操作类型', key: 'email', align: 'center' },
    { title: '操作时间', width: 70, key: 'companyName', align: 'center' },
    { title: '操作人', key: 'companyName', align: 'center' },
    { title: '字段',  key: 'companyName', align: 'center' },
    { title: '原值',  key: 'companyName', align: 'center' },
    { title: '新值',  key: 'companyName', align: 'center' },
  ]
  // 接单信息
  approveStatusList: any = [
    {
      key: 1,
      text: '接单'
    },
    {
      key: 2,
      text: '不接单'
    }
  ]
  // 财务信息
  moneyList: any = [
    {
      key: 1,
      text: '审核通过'
    },
    {
      key: 2,
      text: '审核不通过'
    }
  ]

  dataForm: any = { ...dataForm }
  moneydataForm: any = { ...moneydataForm }
  orderdataForm: any = { ...orderdataForm }

  mounted() {
    this.search()
  }

  dlgEditDone() {
    this.search()
  }

  editShow(id: any , price: any , mark: any) {
    this.reVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.re.init(id , price , mark)
    })
  }


  // 返回上一页 && 接单取消按钮
  back() {
    this.$router.go(-1)
  }

  async search() {
    this.itemlist = []
    this.orderlist = []
    try {
      const { data } = await itemlist(this.$route.params.id)
      this.itemlist.push(data.order)
      this.dataForm.fee = this.itemlist[0].confirmFee * 0.5
      if (this.$route.params.status == '4') {
        this.feemoney = this.itemlist[0].confirmFee
      }
      if (this.$route.params.status == '8') {
        this.feemoney = this.itemlist[0].confirmFee - this.itemlist[0].advanceFee
      }
      this.oklist = data.orderItemList == null ? [] : data.orderItemList
      this.publishCategoryList = data.publishCategoryList
      this.orderlist = [
        {
          name: '首款',
          paymoney: data.order.advanceFee,
          paydate: data.order.advancePayTime == null ? '-' : moment(data.order.advancePayTime).format(timeFormat),
          payper: data.order.advancePayName,
          beizhu: data.order.advanceRemark
        },
        {
          name: '尾款',
          paymoney: data.order.restFee,
          paydate: data.order.restPayTime == null ? '-' : moment(data.order.restPayTime).format(timeFormat),
          payper: data.order.restPayName,
          beizhu: data.order.restRemark
        }
      ]
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 商务金额删除
  async deletefilm(id: any) {
    try {
      await confirm('您确定删除当前信息吗？')
      await move(id)
      this.$Message.success({
        content: `删除成功`,
      })
      this.search()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 商务提交审核
  async okdata() {
    this.oklist = (this.oklist || []).map((it: any) => {
      return {
        orderId: it.orderId,
        kolId: it.kolId,
        channelCode: it.channelCode,
        channelDataId: it.channelDataId,
        confirmPrice: it.confirmPrice,
        confirmRemark: it.confirmRemark,
      }
    })
    try {
      await biz({orderId: this.$route.params.id, items: this.oklist})
      this.$Message.success({
        content: `提交成功`,
      })
      this.$router.go(-1)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 提交支付信息
  async change() {
    this.dataForm.orderId = this.$route.params.id
    if (this.$route.params.status == '4') {
      try {
        const res =  await advance ({
          orderId: this.dataForm.orderId  ,
          advanceFee: this.dataForm.fee ,
          advanceRemark: this.dataForm.remark
        })
        this.$router.push({ name : 'order-kollist' })
      } catch (ex) {
        this.handleError(ex)
      }
    } else if (this.$route.params.status == '8') {
      try {
        const res =  await rest ({
          orderId: this.dataForm.orderId  ,
          restFee: this.dataForm.fee ,
          restRemark: this.dataForm.remark
        })
        this.$router.push({ name : 'order-kollist' })
      } catch (ex) {
        this.handleError(ex)
      }
    }
    // try {
    //   const res =  await finance (this.dataForm)
    //   this.$router.push({ name : 'order-kollist' })
    // } catch (ex) {
    //   this.handleError(ex)
    // }
  }

  // 提交接单信息
  async changeorder() {
    this.orderdataForm.orderId = this.$route.params.id
    if (this.orderdataForm.receptType == 1) {
      this.orderdataForm.receptType = true
    } else if (this.orderdataForm.receptType == 2) {
      this.orderdataForm.receptType = false
    }
    try {
      const res =  await recept (this.orderdataForm)
      this.$router.push({ name : 'order-kollist' })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 提交财务信息
  async changemoney() {
    if (this.moneydataForm.financeApprovalType == 1) {
      this.moneydataForm.financeApprovalType = true
    } else if (this.moneydataForm.financeApprovalType == 2) {
      this.moneydataForm.financeApprovalType = false
    }
    this.moneydataForm.orderId = this.$route.params.id
    try {
      const res =  await finance (this.moneydataForm)
      this.$router.push({ name : 'order-kollist' })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('dataForm', { deep: true })
  watchDataForm() {
    // if (this.dataForm.fee > this.itemlist[0].confirmFee - this.itemlist[0].advanceFee) {
    //   this.dataForm.fee = 789
    //   info('金额输入有误，请重新输入')
    // }
    // this.search()
  }

}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';
.header {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;
  em, i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}
.title {
  font-size: 16px;
  color: @c-base;
  line-height: 40px;
}
.row-li {
  line-height: 40px;
  font-size: 14px;
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
}
.table {
  margin-top: 16px;
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
</style>
