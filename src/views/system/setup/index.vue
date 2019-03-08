<template>
<div>
  <Form  :model='dataForm' :label-width='93' :rules='rules' label-position="left" class='form page' ref='dataForm'>
    <div class="edit-box">
      <div v-auth="'finance.settings:set-bank-account'" class='titop' v-if='showbank'>充值信息
        <Button type='success' style='float: right;' @click="editbank('dataForm')">保存</Button>
      </div>
      <Row v-auth="'finance.settings:set-bank-account'" class="cinema-header" v-if='showbank'>
        <FormItem label="开户行" prop="accountBank">
          <Row>
            <Col span="8">
              <Input v-model="dataForm.accountBank" placeholder=""/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="开户名" prop="accountName">
          <Row>
            <Col span="8">
              <Input v-model="dataForm.accountName" placeholder=""/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="银行账号" prop="accountNumber">
          <Row>
            <Col span="8">
              <Input v-model="dataForm.accountNumber" placeholder=""/>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <div v-auth="'finance.settings:default'" class='titop' v-if='!showbank'>充值信息
        <Button type='success' style='float: right;' @click='showbanktrue'>修改</Button>
      </div>
      <div v-auth="'finance.settings:default'" class="cinema-header" v-if='!showbank'>
        <Row>
          <Col span="2"><div>开户行</div></Col>
          <Col span="8"><span>{{detail.accountBank}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>开户名</div></Col>
          <Col span="8"><span>{{detail.accountName}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>银行账号</div></Col>
          <Col span="8"><span>{{detail.accountNumber}}</span></Col>
        </Row>
      </div>
      <div v-auth="'finance.settings:set-transaction-info'" class='titop' v-if='showmoney'>交易信息
        <Button type='success' style='float: right;' @click="edittransaction('dataForm')">保存</Button>
      </div>
      <Row v-auth="'finance.settings:set-transaction-info'" class="jiaoyi cinema-header" v-if='showmoney'>
        <Row>
          <Col span="3">
            <FormItem label="初始分成比例" prop="proportion">
              <Input v-model="dataForm.proportion" placeholder=""/>
            </FormItem>
          </Col>
          <col span='14'>&nbsp;% ， <span style='color:red;'>注：未设置分成比例的资源方公司，在平台接单时将使用本项设置</span></Col>
        </Row>
        <Row>
          <Col span="3">
            <FormItem label="数字转制费, 每" prop="timeStep">
              <Input v-model="dataForm.timeStep"/>
            </FormItem>
          </Col>
          <Col span="4" class='shou'>
            <FormItem label="   秒 ，收取" prop="stepCost">
              <Input v-model="dataForm.stepCost" placeholder=""/>
            </FormItem>
          </Col>
          <col span='14'>&nbsp;元 ， <span style='color:red;'>&nbsp;注：超出部分按照一整个阶梯收取费用</span></Col>
        </Row>
      </Row>
      <div v-auth="'finance.settings:default'" class='titop' v-if='!showmoney'>交易信息
        <Button type='success' style='float: right;' @click='showmoneytrue'>修改</Button>
      </div>
      <Row v-auth="'finance.settings:default'" class="cinema-header" v-if='!showmoney'>
        <Row>
          <Col span="2"><div>初始分成比例&nbsp;&nbsp;</div></Col>
          <Col span="14"><span>{{detail.proportion}}%</span><span style='color:red;margin-left:15px;'>注：未设置分成比例的资源方公司，在平台接单时将使用本项设置</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>数字转制费用&nbsp;&nbsp;</div></Col>
          <Col span="14"><span>每{{detail.timeStep}}秒，收取{{detail.stepCost}}元 </span><span style='color:red;margin-left:15px;'>注：超出部分按照一整个阶梯收取费用</span></Col>
        </Row>
      </Row>
    </div>
  </Form>
</div>
  
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList , bank , transaction , dataFrom} from '@/api/setup'
import { directorList } from '@/api/corpReal'
import jsxReactToVue from '@/util/jsxReactToVue'

import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import moment from 'moment'

const timeFormat = 'YYYY/MM/DD'
const timeFormats = 'YYYY/MM/DD HH:mm:ss'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const defQuery = {
}

const dataForm = {
  accountBank: null,
  accountName: null,
  accountNumber: null,
  proportion: null,
  timeStep: null,
  stepCost: null,
}

@Component({
  components: {
  }
})

export default class Main extends ViewBase {
  query = { ...defQuery }
  oldQuery: any = {}
  detail: any = {}

  id = 0

  showbank = false
  showmoney = false

  dataForm: any = { ...dataForm }


  get rules() {
    const rule: any = {
    }
    return rule
  }
  mounted() {
    this.doSearch()
  }

  async doSearch() {
     (this.$Spin as any).show()
     this.oldQuery = { ...this.query }


    const query = clean({ ...this.query })
    try {
      const res = await queryList(query)
      this.detail = res.data
      setTimeout(() => {
        (this.$Spin as any).hide()
      }, 1000)
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    } finally {
    }
  }

  showmoneytrue() {
    this.showmoney = true
    this.dataForm.proportion = this.detail.proportion
    this.dataForm.timeStep = this.detail.timeStep
    this.dataForm.stepCost = this.detail.stepCost
  }

  showbanktrue() {
    this.showbank = true
    this.dataForm.accountBank = this.detail.accountBank
    this.dataForm.accountName = this.detail.accountName
    this.dataForm.accountNumber = this.detail.accountNumber
  }



  editbank(dataForms: any) {
    const myThis: any = this
    myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query = {
          ...this.dataForm,
        }
        try {
          const res =  await bank (query)
          toast('充值信息操作成功')
          setTimeout(() => {
            history.go(0)
          }, 1000)
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }
  edittransaction(dataForms: any) {
    const myThis: any = this
    myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query =  !this.id ? this.dataForm : {
          id: this.id,
          ...this.dataForm
        }
        try {
          const res =  await transaction (query)
          toast('交易信息操作成功')
          setTimeout(() => {
            history.go(0)
          }, 1000)
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

.btn-back {
  margin-right: 10px;
}

.edit-button {
  text-align: center;
  margin-bottom: 20px;
  button {
    margin-right: 20px;
  }
}

.cinema-header, .cinema-content, .cinema-footer {
  border: 1px solid #dcdee2;
  background: #fff;
  padding: 18px 0 0 18px;
  margin-bottom: 14px;
  line-height: 50px;
}
.check-select-group {
  display: inline-flex;
  width: 90%;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  padding-left: 8px;
  overflow: hidden;
  /deep/ .ivu-select {
    .ivu-select-placeholder,
    .ivu-select-selected-value {
      position: relative;
      top: 1px;
    }
    .ivu-select-selection {
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }
  }
}
.upload {
  margin-bottom: 20px;
}
.part-bind-cinema {
  width: 660px;
}
.red {
  color: red;
  margin-left: 12px;
  font-size: 14px;
}
// .beizhu .ivu-form-item .ivu-form-item-content{
//   margin-left: 0px;
// }
.titop {
  line-height: 34px;
  color: rgb(61, 156, 235);
  font-size: 16px;
}
.shou {
  /deep/ .btn-back {
    width: 70px;
  }
}
.jiaoyi {
  /deep/ .ivu-form-item-label {
    margin-top: 8px;
  }
}
</style>
