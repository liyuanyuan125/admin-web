<template>
  <div>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1" style='margin-left:20px;'>
        <em>订单基本信息</em>
      </div>
    </header>

    <!-- 订单基本信息 -->
    <Table :columns="columns" :data='itemlist' border stripe disabled-hover size="small" class="table">
    </Table>

     <!-- 商务确认信息 -->
    <div class='title' v-if='$route.params.orders == 4 || $route.params.orders == 8'>订单金额信息</div>
    <div v-if='$route.params.orders == 2 || $route.params.orders == 3 || $route.params.orders == 0 || $route.params.orders == 5' class='title'>商务确认</div>
    <!-- 商务确认不可编辑 -->
    <Table v-if='$route.params.orders != 2' :columns="okcolumns" :data='oklist' border stripe disabled-hover size="small" class="table">
    </Table>
    <!-- 商务确认可编辑 -->
    <Table v-if='$route.params.orders == 2' :columns="editokcolumns" :data="editoklist">

      <template slot-scope="{ row, index }" slot="editmoney">
        <Input type="text" v-model="editAddress" v-if="editIndex === index" @on-blur="handleSave(index)" />
        <span v-else @click="handleEdit(row, index)">{{ row.address }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="beizhu">
        <Input type="text" v-model="beizhu" v-if="editIndex === index" @on-blur="handleSave(index)" />
        <span v-else @click="handleEdit(row, index)">{{ row.address }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        删除
      </template>
    </Table>

    <Button v-if='$route.params.orders == 2' style='margin-left: 45%;margin-top: 10px;'>提交</Button>
    <Button v-if='$route.params.orders == 2' style='margin-left: 10px;margin-top: 10px;'>取消</Button>

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
        <Col :span='8'>剩余待支付金额：￥100.100</Col>
        <Col :span='8'>订单总金额 ￥20000 <span style='color: #ccc;'>(显示商务确认的金额)</span></Col>
        <Col :span='8'>已付金额：￥100.000</Col>
      </Row>
      <Form ref="dataForm" :model="dataForm"  label-position="left" :label-width="100" style='margin-top: 7px;'>
        <FormItem  label="支付金额" prop="reason">
        <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
      </FormItem>
      <FormItem  label="备注" prop="reason">
        <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
      </FormItem>
      </Form>
      <Button style='margin-left:20px;' type="primary"  @click="change('dataForm')">提交</Button>
      <Button style='margin-left:20px;' @click="back">取消</Button>
    </div>

    <!-- 接单信息 -->
    <div v-if='$route.params.orders == 5' class='title'>接单信息</div>
    <div v-if='$route.params.orders == 5' style="border: 1px solid #ccc; padding: 15px;">
      <Form ref="dataForm" :model="orderdataForm"  label-position="left" :label-width="100">
        <FormItem label="接单信息" prop="status">
          <RadioGroup v-model='orderdataForm.approveStatus'>
            <Radio v-for="it in approveStatusList" v-if="it.key!=0" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem  label="备注" prop="reason">
        <Input style="width:240px" v-model="orderdataForm.refuseReason"></Input>
      </FormItem>
      </Form>
      <Button style='margin-left:20px;' type="primary"  @click="changeorder('dataForm')">提交</Button>
      <Button style='margin-left:20px;' @click="back">取消</Button>
    </div>

     <!-- 财务审核 -->
    <div v-if='$route.params.orders == 3' class='title'>财务审核</div>
    <div v-if='$route.params.orders == 3' style="border: 1px solid #ccc; padding: 15px;">
      <Form ref="dataForm" :model="moneydataForm"  label-position="left" :label-width="100">
        <FormItem label="审核" prop="status">
          <RadioGroup v-model='moneydataForm.approveStatus'>
            <Radio v-for="it in moneyList" v-if="it.key!=0" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem  label="备注" prop="reason">
        <Input style="width:240px" v-model="moneydataForm.refuseReason"></Input>
      </FormItem>
      </Form>
      <Button style='margin-left:20px;' type="primary"  @click="changemoney('dataForm')">提交</Button>
      <Button style='margin-left:20px;' @click="back">取消</Button>
    </div>


    <!-- 操作日志 -->
    <div v-if='$route.params.orders == 0' class='title'>操作日志</div>
    <Table v-if='$route.params.orders == 0' :columns="logcolumns" :data='loglist' border stripe disabled-hover size="small" class="table">
    </Table>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import moment from 'moment'


import {
  queryList
} from '@/api/orderkol'
import EditDialog, { Field } from '@/components/editDialog'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  refuseReason: '',
  approveStatus: 2
}

const moneydataForm = {
  refuseReason: '',
  approveStatus: 2
}

const orderdataForm = {
  refuseReason: '',
  approveStatus: 2
}

@Component({
  components: {
  }
})
export default class Main extends ViewBase {

  editIndex = -1  // 当前聚焦的输入框的行数
  editmoney = '' // 修改金额
  beizhu = '' // 修改备注
  // 订单基本信息
  itemlist: any = []
  // 商务审核 && 订单金额
  oklist: any = []
  // 商务确认
  editoklist: any = []
  // 订单支付信息
  orderlist: any = []
  // 操作日志
  loglist: any = []

  id = 0

  // 订单基本信息
  columns = [
    { title: '订单编号', width: 70, key: 'id', align: 'center' },
    { title: '订单名称', key: 'email', align: 'center' },
    { title: '公司id', width: 70, key: 'companyName', align: 'center' },
    { title: '公司名称', key: 'companyName', align: 'center' },
    { title: '平台', width: 70, key: 'companyName', align: 'center' },
    { title: '推广平台', width: 70, key: 'companyName', align: 'center' },
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
    { title: '下单金额', width: 70,  key: 'companyName', align: 'center' },
    { title: '商务确认金额', width: 90,  key: 'companyName', align: 'center' },
    {
      title: '订单状态',
      width: 70,
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { status, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (status == 1) {
          return <span class={`status-${status}`}>启用</span>
        } else if (status == 2) {
          return <span class={`status-${status}`}>停用</span>
        } else if (status == 3) {
          return <span class={`status-${status}`}>待激活</span>
        }
        /* tslint:enable */
      }
    },
    {
      title: '支付状态',
      width: 70,
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { status, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (status == 1) {
          return <span class={`status-${status}`}>启用</span>
        } else if (status == 2) {
          return <span class={`status-${status}`}>停用</span>
        } else if (status == 3) {
          return <span class={`status-${status}`}>待激活</span>
        }
        /* tslint:enable */
      }
    },
  ]
  // 商务确认订单
  okcolumns = [
    { title: 'kol平台账号',  key: 'id', align: 'center' },
    { title: 'kol平台账号名称', key: 'email', align: 'center' },
    { title: '平台', width: 70, key: 'companyName', align: 'center' },
    { title: '任务类型', key: 'companyName', align: 'center' },
    { title: '下单金额',  key: 'companyName', align: 'center' },
    { title: '商务修改金额',  key: 'companyName', align: 'center' },
    { title: '备注',  key: 'companyName', align: 'center' },
  ]
  // 商务确认
  editokcolumns = [
    { title: 'kol平台账号',  key: 'id', align: 'center' },
    { title: 'kol平台账号名称', key: 'email', align: 'center' },
    { title: '平台', width: 70, key: 'companyName', align: 'center' },
    { title: '任务类型', key: 'companyName', align: 'center' },
    { title: '下单金额',  key: 'companyName', align: 'center' },
    { title: '商务修改金额',  slot: 'editmoney', align: 'center' },
    { title: '备注',  slot: 'beizhu', align: 'center' },
    { title: '操作',  slot: 'action', align: 'center' },
  ]
  // 订单支付信息
  ordercolumns = [
    { title: '类型',  key: 'id', align: 'center' },
    { title: '支付金额', key: 'email', align: 'center' },
    { title: '支付时间', key: 'companyName', align: 'center' },
    { title: '支付操作人',  key: 'companyName', align: 'center' },
    { title: '备注',  key: 'companyName', align: 'center' }
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
    // console.log(this.$route.name)
  }

  // 返回上一页 && 接单取消按钮
  back() {
    this.$router.go(-1)
  }

  search() {

  }

  // 商务修改金额
  handleEdit(row: any, index: any) {
    this.editmoney = row.address
    this.editIndex = index
  }
  handleSave(index: any) {
    this.editoklist[index].address = this.editmoney
    this.editIndex = -1
  }

  // 商务修改备注
  beiEdit(row: any, index: any) {
    this.beizhu = row.address
    this.editIndex = index
  }
  beiSave(index: any) {
    this.editoklist[index].address = this.beizhu
    this.editIndex = -1
  }

  // 提交支付信息
  change(dataForms: any) {
    const myThis: any = this
    myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query =  !this.id ? this.dataForm : {
          id: this.id,
          ...this.dataForm
        }
        // const title = '添加'
        try {
          // const res =  await setList (this.$route.params.id , query)
          // this.$router.push({ name : 'client-order' })
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }

  // 提交接单信息
  changeorder(dataForms: any) {
    const myThis: any = this
    myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query =  !this.id ? this.dataForm : {
          id: this.id,
          ...this.orderdataForm
        }
        try {
          // const res =  await setList (this.$route.params.id , query)
          // this.$router.push({ name : 'client-order' })
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }

  // 提交财务信息
  changemoney(dataForms: any) {
    const myThis: any = this
    myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query =  !this.id ? this.dataForm : {
          id: this.id,
          ...this.moneydataForm
        }
        // const title = '添加'
        try {
          // const res =  await setList (this.$route.params.id , query)
          // this.$router.push({ name : 'client-order' })
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
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
</style>
