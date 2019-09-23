<template>
<div>
  <Form  :model='dataForm' :label-width='93' :rules='rules' label-position="left" class='form page' ref='dataForm'>
    <div class="edit-box">
      <!-- 充值信息 -->
      <div v-auth="'finance.settings:set-bank-account'" class='titop' v-if='showbank'>收款账户及发票信息
        <Button type='success' style='float: right;' @click="editbank('dataForm')">保存</Button>
      </div>
      <Row v-auth="'finance.settings:set-bank-account'" class="cinema-header"  v-if='showbank'>
        <Row>
          <Col :span='8'>
            <FormItem label="开户行" prop="accountBank">
              <Input v-model="dataForm.accountBank" style='width: 200px;' placeholder=""/>
            </FormItem>
          </Col>
          <Col :span='8'>
            <FormItem label="公司名称" prop="companyName">
              <Input v-model="dataForm.companyName" style='width: 200px;' placeholder=""/>
            </FormItem>
          </Col>
          <Col :span='8'>
            <FormItem label="纳税人识别号" prop="taxPayerNo">
              <Input v-model="dataForm.taxPayerNo" style='width: 200px;' placeholder=""/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span='8'>
            <FormItem label="开户名" prop="accountName">
              <Input v-model="dataForm.accountName" style='width: 200px;' placeholder=""/>
            </FormItem>
          </Col>
          <Col :span='8'>
            <FormItem label="公司地址" prop="companyAddress">
              <Input v-model="dataForm.companyAddress" style='width: 200px;' placeholder=""/>
            </FormItem>
          </Col>
          <Col :span='8'>
            <FormItem label="公司电话" prop="companyPhone">
              <Input v-model="dataForm.companyPhone" style='width: 200px;' placeholder=""/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span='8'>
            <FormItem label="银行账号" prop="accountNumber">
              <Input v-model="dataForm.accountNumber" style='width: 200px;' placeholder=""/>
            </FormItem>
          </Col>
        </Row>
      </Row>
      <div v-auth="'finance.settings:default'" class='titop' v-if='!showbank'>充值信息
        <Button type='success' style='float: right;' @click='showbanktrue'>修改</Button>
      </div>
      <div v-auth="'finance.settings:default'" class="cinema-header" v-if='!showbank'>
        <Row>
          <Col span="2"><div>开户行</div></Col>
          <Col span="6"><span>{{detail.accountBank}}</span></Col>
          <Col span="2"><div>公司名称</div></Col>
          <Col span="6"><span>{{detail.companyName}}</span></Col>
          <Col span="2"><div>纳税人识别号</div></Col>
          <Col span="6"><span>{{detail.taxPayerNo}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>开户名</div></Col>
          <Col span="6"><span>{{detail.accountName}}</span></Col>
          <Col span="2"><div>公司地址</div></Col>
          <Col span="6"><span>{{detail.companyAddress}}</span></Col>
          <Col span="2"><div>公司电话</div></Col>
          <Col span="6"><span>{{detail.companyPhone}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>银行账号</div></Col>
          <Col span="6"><span>{{detail.accountNumber}}</span></Col>
        </Row>
      </div>
      <!-- 交易信息 -->
      <!-- <div v-auth="'finance.settings:set-transaction-info'" class='titop' v-if='showmoney'>交易信息
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
      </Row> -->
      <!-- <div v-auth="'finance.settings:default'" class='titop' v-if='!showmoney'>交易信息
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
      </Row> -->
      <div v-auth="'finance.settings:set-transaction-info'" class='titop'>交易信息
        <Button type='success' style='float: right;' v-if="editIndex === 1" @click="edittransaction('dataForm')">保存</Button>
        <Button type='success' style='float: right;' @click='chgindex' v-if="editIndex === -1"  >修改</Button>
      </div>
      <Row v-auth="'finance.settings:set-transaction-info'" style='padding-bottom: 30px;' class="jiaoyi cinema-header">
        <Button type="success" @click="handleAdd" icon="md-add" v-if="editIndex === 1">新增</Button>
        <Table :columns="columns" :data="formDynamic"
        border stripe disabled-hover size="small" class="table">
          <template slot-scope="{ row, index }" slot="begin">
            <!-- <Input type="text" v-model="editbegin" v-if="editIndex === index" />
            <span v-else>{{ row.begin }}</span> -->
            <InputNumber type="text" v-model="row.begin" :min = '0' @on-change='chgbegin(row , index)' v-if="editIndex === 1" />
            <span v-else>{{ row.begin }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="end">
            <!-- <Input type="text" v-model="editend" v-if="editIndex === index" />
            <span v-else>{{ row.end }}</span> -->
             <InputNumber type="text" v-model="row.end" :min = '0' @on-change='chgend(row , index)' v-if="editIndex === 1" />
            <span v-else>{{ row.end }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="cost">
            <!-- <Input type="text" v-model="editcost" v-if="editIndex === index" />
            <span v-else>{{ row.cost }}</span> -->
            <InputNumber type="text" v-model="row.cost" :min = '0' @on-change='chgcost(row , index)' v-if="editIndex === 1" />
            <span v-else>{{ row.cost }}</span>
          </template>
          <template  slot="action" slot-scope="{row , index}" >
            <!-- <div v-if="editIndex === index">
              <Button @click="handleok(index)">保存</Button>
              <Button style='margin-left: 10px;' @click="editIndex = -1">取消</Button>
            </div>
            <div v-else>
              <Button @click="handleEdit(row, index)">修改</Button> -->
              <Button style='margin-left: 10px;' @click="handleRemove(row, index)">删除</Button>
            <!-- </div> -->
          </template>
        </Table>
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
          <Col span="3">
            <FormItem label="预告片折扣" prop="cpmTrailerDiscount">
              <Input v-model="dataForm.cpmTrailerDiscount" placeholder="" />
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
          <Col span="3">
            <FormItem label="预告片折扣" prop="showTrailerDiscount">
              <Input v-model="dataForm.showTrailerDiscount" placeholder="" />
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
          <!-- <Col span="3">
            <FormItem label="每厅场次数" prop="timeShowCount">
              <Input v-model="dataForm.timeShowCount" placeholder=""/>
            </FormItem>
          </Col>
          <Col span='1' class='tex-al'>&nbsp;场/天</Col> -->
          <Col span="3">
            <FormItem label="预告片折扣" prop="timeTrailerDiscount">
              <Input v-model="dataForm.timeTrailerDiscount" placeholder="" />
            </FormItem>
          </Col>
          <Col span='1' class='tex-al'>&nbsp;%</Col>
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
          <Col span="2"><div>预告片折扣</div></Col>
          <Col span="3"><span>{{detail.cpmTrailerDiscount}}%</span></Col>
        </Row>
        <Row>
          <Col span="3"><div>按场次</div></Col>
          <Col span="2"><div>30秒刊例价</div></Col>
          <Col span="4"><span>{{detail.showPrice}}</span> 元/场</Col>
          <Col span="2"><div>15秒折扣</div></Col>
          <Col span="3"><span>{{detail.showDiscount}}%</span></Col>
          <Col span="2"><div>预告片折扣</div></Col>
          <Col span="3"><span>{{detail.showTrailerDiscount}}%</span></Col>
        </Row>
         <Row>
          <Col span="3"><div>按时段(通投包厅)</div></Col>
          <Col span="2"><div>30秒刊例价</div></Col>
          <Col span="4"><span>{{detail.timePrice}}</span> 元/周/厅</Col>
          <Col span="2"><div>15秒折扣</div></Col>
          <Col span="3"><span>{{detail.timeDiscount}}%</span></Col>
          <Col span="2"><div>预告片折扣</div></Col>
          <Col span="3"><span>{{detail.timeTrailerDiscount}}%</span></Col>
          <!-- <Col span="6"><div>每厅场次数{{detail.timeShowCount}}场/天</div></Col> -->
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
import { queryList , bank , transaction , price ,  dataFrom , cost} from '@/api/setup'
import { directorList } from '@/api/corpReal'
import jsxReactToVue from '@/util/jsxReactToVue'

import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import { warning , success, toast , info } from '@/ui/modal'
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
  companyName: null,
  companyAddress: null,
  companyPhone: null,
  taxPayerNo: null,
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
  cpmTrailerDiscount: null, // cpm预告片折扣
  showTrailerDiscount: null, // 场次预告片折扣
  timeTrailerDiscount: null, // 时段预告片折扣
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
  index: any = 0

  showbank = false
  showmoney = false
  showprice = false

  dataForm: any = { ...dataForm }


  formDynamic: any = [
    {
      value: '',
      index: 1,
      status: 1
    }
  ]

  editIndex: any = -1
  editbegin: any =  null
  editend: any =  null
  editcost: any =  null
  convertCosts: any = []

  isoks: any = false
  isbig: any = false
  isnull: any = false

  get columns() {
    const a: any = [
      { title: '时长起止区间s', slot: 'begin',  align: 'center' },
      { title: '时长截止区间s', slot: 'end', align: 'center' },
      { title: '转制费（元）', slot: 'cost', align: 'center' },
    ]
    const b: any = [
      { title: '操作',   slot: 'action', align: 'center' },
    ]
    return this.editIndex == 1 ? [...a , ...b] : [...a]
  }


  get rules() {
    const rule: any = {
    }
    return rule
  }
  mounted() {
    this.doSearch()
  }

  chgindex() {
    this.editIndex = 1
  }

  handleAdd() {
    this.index = this.formDynamic.length - 1
    this.index++
    this.formDynamic.push({
        begin: null,
        end: null,
        cost: null,
    })
    this.editIndex = 1
  }
  handleRemove(row: any , index: any) {
    this.editIndex = 1
    this.formDynamic.splice(index, 1)
  }

  // handleEdit(row: any, index: any) {
  //   this.editbegin = row.begin
  //   this.editend = row.end
  //   this.editcost = row.cost
  //   this.editIndex = 1
  // }

  // handleok(index: any) {
  //   this.formDynamic[index].begin =  this.editbegin
  //   this.formDynamic[index].end =  this.editend
  //   this.formDynamic[index].cost =  this.editcost
  //   this.editIndex = -1
  //   this.editbegin = ''
  //   this.editend = ''
  //   this.editcost = ''
  // }
  // 修改开始时间
  chgbegin(row: any , index: any) {

    this.formDynamic[index].begin =  Number(row.begin)
  }
  // 修改结束时间
  chgend(row: any , index: any) {
    this.formDynamic[index].end =  Number(row.end)
  }
  // 修改转制费
  chgcost(row: any , index: any) {
    this.formDynamic[index].cost =  Number(row.cost)
  }
  // chg(row: any , index: any , item: any) {
  //   this.formDynamic[index].item =  row.item
  // }

  async doSearch() {
     (this.$Spin as any).show()
     this.oldQuery = { ...this.query }


    const query = clean({ ...this.query })
    try {
      const res = await queryList(query)
      this.detail = res.data
      this.formDynamic = (res.data.convertCosts || []).map((it: any , key: any) => {
        return {
          begin: it.begin,
          end: it.end,
          cost: it.cost,
          index: key + 1,
        }
      })
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
    this.dataForm.companyName = this.detail.companyName
    this.dataForm.companyAddress = this.detail.companyAddress
    this.dataForm.companyPhone = this.detail.companyPhone
    this.dataForm.taxPayerNo = this.detail.taxPayerNo
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
    this.dataForm.cpmTrailerDiscount = this.detail.cpmTrailerDiscount
    this.dataForm.showTrailerDiscount = this.detail.showTrailerDiscount
    this.dataForm.timeTrailerDiscount = this.detail.timeTrailerDiscount
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
  async edittransaction(dataForms: any) {
    // const myThis: any = this
    // myThis.$refs[dataForms].validate(async ( valid: any ) => {
    //   if (valid) {
    //     const query =  !this.id ? this.dataForm : {
    //       id: this.id,
    //       ...this.dataForm
    //     }
    //     try {
    //       const res =  await transaction (query)
    //       toast('交易信息操作成功')
    //       setTimeout(() => {
    //         this.doSearch()
    //         this.showmoney = false
    //       }, 1000)
    //     } catch (ex) {
    //       this.handleError(ex)
    //     }
    //   }
    // })
    if (this.formDynamic[0].begin != 1) {
      info('第一区间的开始时间为 必须为1')
      return
    }
    if (this.formDynamic[this.formDynamic.length - 1].end < this.formDynamic[this.formDynamic.length - 1].begin) {
      info('请确认时间区间输入是否正确')
      return
    }
    this.isoks = false
    this.isbig = false
    this.isnull = false
    this.convertCosts = this.formDynamic
    const aaa: any = []
    const bbb: any = []
    this.formDynamic.forEach((it: any , index: any) => {
      aaa.push(it.begin)
      bbb.push(it.end)
    })

    this.formDynamic.forEach((it: any , index: any) => {
      if (it.begin == '') {
        this.isnull = true
        return
      }
      if (it.end == '') {
        this.isnull = true
        return
      }
      if (it.cost == '') {
        this.isnull = true
        return
      }
    })

    if (this.isnull == true) {
      info('请确认输入是否正确')
      return
    }

    this.formDynamic.forEach((it: any , index: any) => {
      if ((index + 1) == this.formDynamic.length) {
      } else {
        if (aaa[index] > bbb[index]) {
          this.isbig = true
          return
        } else {
        }
      }
    })

    if (this.isbig == true) {
      info('请确认时间区间输入是否正确')
      return
    }

    this.formDynamic.forEach((it: any , index: any) => {
      if ((index + 1) == this.formDynamic.length) {
      } else {
        if (aaa[index + 1] - 1 != bbb[index]) {
          this.isoks = true
          return
        } else {
        }
      }
    })

    if (this.isoks == true) {
      info('非第一区间的起始时长必须为前一区间截止时长 + 1s,请确认输入是否正确')
      return
    }

    try {
          const res =  await cost ({convertCosts: this.formDynamic})
          toast('交易信息操作成功')
          setTimeout(() => {
            this.doSearch()
            this.editIndex = -1
          }, 1000)
        } catch (ex) {
          this.handleError(ex)
        }
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
          cpmTrailerDiscount: this.dataForm.cpmTrailerDiscount,
          showTrailerDiscount: this.dataForm.showTrailerDiscount,
          timeTrailerDiscount: this.dataForm.timeTrailerDiscount,
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
/deep/ .ivu-table-wrapper {
  width: 522px;
}
</style>
