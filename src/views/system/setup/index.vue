<template>
<div>
  <Form  :model='dataForm' :label-width='93' :rules='rules' label-position="left" class='form page' ref='dataForm'>
    <div class="edit-box">
      <!-- 充值信息 -->
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
      <!-- 交易信息 -->
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
          <Col span='14' class='tex-al'>&nbsp;% ， <span style='color:red;'>注：未设置分成比例的资源方公司，在平台接单时将使用本项设置</span></Col>
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
          <Col span='14' class='tex-al'>&nbsp;元 ， <span style='color:red;'>&nbsp;注：超出部分按照一整个阶梯收取费用</span></Col>
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
      <!-- 刊例价 -->
      <div class='titop' v-if='showprice'>默认刊例价
        <Button type='success' style='float: right;' @click="editprice('dataForm')">保存</Button>
      </div>
      <Row  class="cinema-header" v-if='showprice'>
        <Row>
          <Col span="3" class='tex-al'><div>按人次(CPM)</div></Col>
          <Col span="4">
            <FormItem label="30秒刊例价" prop="cpm">
              <Input v-model="dataForm.cpm" placeholder="" />
            </FormItem>
          </Col>
          <Col span='2' class='tex-al'>&nbsp;元/千人次</Col>
          <Col span="3">
            <FormItem label="15秒折扣" prop="discount">
              <Input v-model="dataForm.discount" placeholder="" />
            </FormItem>
          </Col>
          <Col span='1' class='tex-al'>&nbsp;%</Col>
        </Row>
        <Row>
          <Col span="3" class='tex-al'><div>按场次</div></Col>
          <Col span="4">
            <FormItem label="30秒刊例价" prop="showPrice">
              <Input v-model="dataForm.showPrice" placeholder=""  />
            </FormItem>
          </Col>
          <Col span='2' class='tex-al'>&nbsp;元/场</Col>
          <Col span="3">
            <FormItem label="15秒折扣" prop="showDiscount">
              <Input v-model="dataForm.showDiscount" placeholder=""/>
            </FormItem>
          </Col>
          <Col span='1' class='tex-al'>&nbsp;%</Col>
        </Row>
        <Row>
          <Col span="3" class='tex-al'><div>按时段(通投包厅)</div></Col>
          <Col span="4">
            <FormItem label="30秒刊例价" prop="timePrice">
              <Input v-model="dataForm.timePrice" placeholder="" />
            </FormItem>
          </Col>
          <Col span='2' class='tex-al'>&nbsp;元/周/厅</Col>
          <Col span="3">
            <FormItem label="15秒折扣" prop="timeDiscount">
              <Input v-model="dataForm.timeDiscount" placeholder=""/>
            </FormItem>
          </Col>
          <Col span='1' class='tex-al'>&nbsp;%</Col>
          <Col span="3">
            <FormItem label="每厅场次数" prop="timeShowCount">
              <Input v-model="dataForm.timeShowCount" placeholder=""/>
            </FormItem>
          </Col>
          <Col span='1' class='tex-al'>&nbsp;场/天</Col>
        </Row>
      </Row>
      <div  class='titop' v-if='!showprice'>默认刊例价
        <Button type='success' style='float: right;' @click='showpricetrue'>修改</Button>
      </div>
      <div  class="cinema-header" v-if='!showprice'>
        <Row>
          <Col span="3"><div>按人次(CPM)</div></Col>
          <Col span="2"><div>30秒刊例价</div></Col>
          <Col span="4"><span>{{detail.cpm}}</span> 元/千人次</Col>
          <Col span="2"><div>15秒折扣</div></Col>
          <Col span="3"><span>{{detail.discount}}%</span></Col>
        </Row>
        <Row>
          <Col span="3"><div>按场次</div></Col>
          <Col span="2"><div>30秒刊例价</div></Col>
          <Col span="4"><span>{{detail.showPrice}}</span> 元/场</Col>
          <Col span="2"><div>15秒折扣</div></Col>
          <Col span="3"><span>{{detail.showDiscount}}%</span></Col>
        </Row>
         <Row>
          <Col span="3"><div>按时段(通投包厅)</div></Col>
          <Col span="2"><div>30秒刊例价</div></Col>
          <Col span="4"><span>{{detail.timePrice}}</span> 元/周/厅</Col>
          <Col span="2"><div>15秒折扣</div></Col>
          <Col span="3"><span>{{detail.timeDiscount}}%</span></Col>
          <Col span="6"><div>每厅场次数{{detail.timeShowCount}}场/天</div></Col>
        </Row>
      </div>
    </div>
  </Form>
</div>
  
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList , bank , transaction , price ,  dataFrom} from '@/api/setup'
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
  cpm: null,
  discount: null,
  showPrice: null,
  showDiscount: null,
  timePrice: null,
  timeDiscount: null,
  timeShowCount: null,
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
  showprice = false

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

  // 交易
  showmoneytrue() {
    this.showmoney = true
    this.dataForm.proportion = this.detail.proportion
    this.dataForm.timeStep = this.detail.timeStep
    this.dataForm.stepCost = this.detail.stepCost
  }

  // 银行
  showbanktrue() {
    this.showbank = true
    this.dataForm.accountBank = this.detail.accountBank
    this.dataForm.accountName = this.detail.accountName
    this.dataForm.accountNumber = this.detail.accountNumber
  }

  // 刊例价
  showpricetrue() {
    this.showprice = true
    this.dataForm.cpm = this.detail.cpm
    this.dataForm.discount = this.detail.discount
    this.dataForm.showPrice = this.detail.showPrice
    this.dataForm.showDiscount = this.detail.showDiscount
    this.dataForm.timePrice = this.detail.timePrice
    this.dataForm.timeDiscount = this.detail.timeDiscount
    this.dataForm.timeShowCount = this.detail.timeShowCount
  }


  // 提交银行信息
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
            this.doSearch()
            this.showbank = false
          }, 1000)
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }

  // 提交交易信息
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
            this.doSearch()
            this.showmoney = false
          }, 1000)
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }

  // 提交刊例价信息
  editprice(dataForms: any) {
    const myThis: any = this
    myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query = {
          cpm: this.dataForm.cpm,
          discount: this.dataForm.discount,
          showPrice: this.dataForm.showPrice,
          showDiscount: this.dataForm.showDiscount,
          timePrice: this.dataForm.timePrice,
          timeDiscount: this.dataForm.timeDiscount,
          timeShowCount: this.dataForm.timeShowCount,
        }
        try {
          const res =  await price (query)
          toast('刊例价操作成功')
          setTimeout(() => {
            this.doSearch()
            this.showprice = false
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
  margin-bottom: 10px;
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
.tex-al {
  line-height: 34px;
}
</style>
