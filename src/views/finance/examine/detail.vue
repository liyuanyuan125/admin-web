<template>
  <div class="page">
    <div class="Inp-Group-res">
      <Button style='margin-bottom:5px;' class="bth" icon="md-return-left" @click="goback">返回上一页</Button>
      <div class="Inps-res">
        <Row class="res-num">
          <Col span="2">公司名称:</Col>
          <Col span="4" class="res-num-item change-item">
            <span>{{list.companyName}}</span>
          </Col>
        </Row>
        <Row class="res-num">
          <Col span="2">充值金额:</Col>
          <Col span="4" class="res-num-item">
            <span class='item1'>{{amount}}</span>
          </Col>
        </Row>
        <Row class="res-num">
          <Col span="2">申请时间:</Col>
          <Col span="4" class="res-num-item">
            <span class='item1'>{{applyTime}}</span>
          </Col>
        </Row>
        <Row class="res-num">
          <Col span="2">申请人:</Col>
          <Col span="4" class="res-num-item">
            <span class='item1'>{{list.applyName}}</span>
          </Col>
        </Row>
        <Row class="res-num">
          <Col span="2">汇款人姓名:</Col>
          <Col span="4" class="res-num-item">
            <span class='item1'>{{list.accountName}}</span>
            <!-- <span class="res-date les">公司地址</span> -->
            <!-- <span>{{company.addressDetail}}</span> -->
          </Col>
        </Row>
        <Row class="res-num">
          <Col span="2">银行账号:</Col>
          <Col span="4" class="res-num-item">
            <span class='item1'>{{list.accountNumber}}</span>
          </Col>
        </Row>
        <Row class="res-num">
          <Col span="2">联系电话:</Col>
          <Col span="4" class="res-num-item">
            <span class='item1'>{{list.contactPhone}}</span>
          </Col>
        </Row>
        <!-- <Row class="res-num">
          <Col span="2">凭证:</Col>
          <Col span="4" class='res-num-item imgs'>
            <img :src=imageList.url alt="" sizes="" srcset="">
          </Col>
        </Row> -->
        <Row class="res-num">
          <Col span="2">凭证:</Col>
          <Col span="4" class='res-num-item imgs'>
            <img :src=imageList.url alt="" @click="onView(imageList.url)" sizes="" srcset="">
            <Modal v-model="viewerShow" title="查看图片" width="500">
              <img style='width: 100%;' :src=viewerImage alt="" sizes="" srcset="">
            </Modal>
          </Col>
        </Row>
        <Row class="res-num">
          <Col span="2">汇款日期:</Col>
          <Col span="4" class="res-num-item">
            <span class='item1'>{{remittanceDate}}</span>
          </Col>
        </Row>
        <Row class="res-num">
          <Col span="2">充值标签:</Col>
          <Col span="4" class="res-num-item">
            <span class='item1' v-for='it in tagCodeList.items' :key='it.tagCode' v-if='list.tagCode == it.tagCode'>{{it.tagName}}</span>
          </Col>
        </Row>
        <Row class="res-num">
          <Col span="2">备注:</Col>
          <Col span="4" class="res-num-item">
            <span class='item1'>{{list.remark}}</span>
          </Col>
        </Row>
      </div>
    </div>
    <div class="log">
      <div class="n-main">审核记录</div>
      <div class="logs">
        <div class="logs-item" v-for="(it,index) in log">
          <span>{{it.createTime}}   </span>
          <span>{{it.email}}【{{it.userName}}】   </span>
          {{it.description}}
        </div>
        <div v-if='showStatus'>
          <Form ref="dataForm" :model="dataForm"  label-position="left" :rules="ruleValidate" :label-width="100">
            <FormItem label="审核意见" prop="status">
              <RadioGroup v-model='dataForm.approvalStatus'>
                <!-- <Radio label="启用"></Radio>
                <Radio label="停用"></Radio> -->
                <Radio v-for="it in approvalStatusList" v-if="it.key!=0&&it.key!=1" :key="it.key" :value="it.key" :label="it.key">{{it.text}}&nbsp;<em class='ems' v-if='it.key==2'>(请确保已收到该笔线下转账)</em></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-if='dataForm.approvalStatus == 3' label="拒绝理由" prop="reason">
            <Input style="width:240px" v-model="dataForm.rejectReason"></Input>
          </FormItem>
          </Form>
          <Button style='margin-left:20px;' type="primary"  @click="change('dataForm')">确定</Button>
          <Button style='margin-left:20px;' @click="goback()">取消</Button>
        </div>
        
      </div>
    </div>
    

  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins  } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { queryList , queryItem , setList , dataFrom} from '@/api/examine'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice , clean } from '@/fn/object'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD'
const timeFormats = 'YYYY-MM-DD HH:mm:ss'


const defQuery = {
  id: '',
  // email: '',
  // companyName: '',
  // status: null,
  pageIndex: 1,
  pageSize: 20,
  applyStartTime: 0,
  applyEndTime: 0
}
const dataForm = {
  rejectReason: '',
  approvalStatus: 2
}

@Component({
  components: {
    // dlgChange
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  // change = false
  query = { ...defQuery }
  oldQuery: any = {}
  ruleValidate = {
    // status: [
    //   { required: true, message: '请选择', trigger: 'blur' }
    // ],
    // reason: [
    //   { required: true, message: '请输入拒绝原因'}
    // ]
  }
  changeVisible = false

  // query = { ...defQuery }
  // oldQuery: any = {}

  loading = false
  createTime = ''
  applyTime = ''
  remittanceDate = ''
  // 所有数据
  list: any = []
  // 充值标签
  tagCodeList: any = []
  // 凭证图片
  imageList: any = []
  // 日志
  log: any = []
  // 审核
  approvalStatusList: any = []
  total = 0
  ids = ''
  sta = 2
  reason = 123132
  id = 0
  showStatus: boolean = true

  // 查看图片
  viewerShow = false
  viewerImage = ''

  amount: any = ''
  newend = ''
  count = 0




  dataForm: any = { ...dataForm }

  mounted() {
    const { id } = this.$route.params
    if ( this.$route.params.approvalStatus == '2' || this.$route.params.approvalStatus == '3' ) {
      this.showStatus = false
    }
    this.ids = id
    this.doSearch()
    // this.createTime = moment(this.log.createTime).format(timeFormats)
    // this.applyTime = moment(this.list.applyTime).format(timeFormats)
    // this.remittanceDate = moment(this.list.remittanceDate).format(timeFormat)
  }

  async addNumber(number: any) {
    this.newend = ''
    this.count = 0
    if (number.indexOf('.') == -1) {
      for (let i = number.length - 1; i >= 0; i--) {
        if (this.count % 3 == 0 && this.count != 0) {
          this.newend = number.charAt(i) + ',' + this.newend
        } else {
          this.newend = number.charAt(i) + this.newend
        }
        this.count++
      }
      number = this.newend + '.00' // 自动补小数点后两位
      return number
    } else {
      for (let i = number.indexOf('.') - 1; i >= 0; i--) {
        if (this.count % 3 == 0 && this.count != 0) {
          this.newend = number.charAt(i) + ',' + this.newend // 碰到3的倍数则加上“,”号
        } else {
          this.newend = number.charAt(i) + this.newend // 逐个字符相接起来
        }
        this.count++
      }
      number =
        this.newend + (number + '00').substr((number + '00').indexOf('.'), 3)
      return number
    }
  }


  dlgEditDone() {
    this.doSearch()
  }

  // cancel(dataForms: string) {
  //   this.dataForm.rejectReason = ''
  //   this.dataForm.approvalStatus = 2
  //   // this.showDlg = false
  //   // ; (this.$refs.dataForm as any).resetFields()
  // }


  change(dataForms: any) {
    const myThis: any = this
    myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query =  !this.id ? this.dataForm : {
          id: this.id,
          ...this.dataForm
        }
        try {
          // const res =  await setList (this.$route.params.id , query)
          this.$router.push({ name : 'finance-examine' })
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }

  reloadSearch() {
    this.doSearch()
  }

  search() {
    this.query.pageIndex = 1
  }

  reset() {
    const { pageSize } = this.query
    this.query = { ...defQuery, pageSize }
    // this.resetQuery()
  }

  goback() {
    this.$router.go(-1)
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.loading = true

    const query = clean({ ...this.query })
    try {
      // 列表信息
      const { data : {
          item: item,
          tagCodeList: tagCodeList,
      } } = await queryItem(this.$route.params.id)
      this.list = item
      this.tagCodeList = tagCodeList
      this.imageList = item.imageList
      this.log = (item.logList || []).map((it: any) => {
        return {
          ...it,
          createTime: moment(it.createTime).format(timeFormats)
        }
      })
      const htmls = String(this.list.amount)
      if (htmls.indexOf('.') == -1) {
        this.amount = htmls + '.00'
      } else {
        this.amount = htmls
      }
      // this.createTime = moment(this.log.createTime).format(timeFormats)
      this.applyTime = moment(this.list.applyTime).format(timeFormats)
      this.remittanceDate = moment(this.list.remittanceDate).format(timeFormat)
      // 审核状态
      const { data: {
        approvalStatusList: approvalStatusList,
      } } = await queryList(query)
      this.approvalStatusList = approvalStatusList
    } catch (ex) {
      // this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  // 查看图片
  onView(url: string) {
    // console.log(url)
    this.viewerImage = url
    this.viewerShow = true
  }


  @Watch('query', { deep: true })
  onQueryChange() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.doSearch()
  }
}
</script>

<style lang="less" scoped>
.sec {
  width: 254px;
  margin-left: 9%;
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.Inp-Group-res,
.res-Group {
  // background: #ecf0f4;
  padding: 10px;
  padding-top: 15px;
  margin: -10px -10px 0 -10px;
}
.res-Group {
  margin-top: -5px;
}
.Inps-res {
  width: 100%;
  height: 100%;
  padding-top: 7px;
  padding-left: 10px;
  font-size: 13px;
  background: #fff;
  border: 1px solid #dcdee2;
}
.res-num {
  display: flex;
  width: 100%;
  line-height: 60px;
}
.res-num p {
  flex-direction: column-reverse;
  flex-wrap: nowrap;
  justify-content: flex-start;
  display: block;
  float: left;
  max-height: 60px;
  text-align: left;
  margin-left: 0.5%;
  // width:8%;
}
.res-num-item {
  display: flex;
  width: 80%;
  height: 100%;
  // margin-left: -60px;
  // max-height: 60px;
}
.res-num-item span {
  flex-direction: column-reverse;
  flex-wrap: nowrap;
  justify-content: flex-start;
  display: inline-block;
  margin-left: 2%;
}
.item1 {
  flex-direction: column-reverse;
  flex-wrap: nowrap;
  justify-content: flex-start;
  // width: 12%;
}
.blu1,
.blu2 {
  color: #53a1f3;
  cursor: pointer;
}
.new-number {
  // background: #ecf0f4;
  padding: 2px;
  margin: 1px -10px 0 -10px;
}
.new-num {
  width: 100%;
  height: 100%;
  padding: 8px;
  background: #fff;
  font-size: 13px;
}
.n-list {
  margin: -5px 0 8px 5px;
  line-height: 38px;
  font-size: 16px;
  color: #2d8cf0;
  // border-bottom: 2px solid #ecf0f4;
}
.n-main {
  display: inline-block;
  margin: 0 0 5px 5px;
  line-height: 35px;
  font-size: 16px;
  color: #2d8cf0;
  // border-bottom: 2px solid #ecf0f4;
}
.xq {
  padding: 5px;
  border: 1px solid #ccc;
}
.xq div {
  line-height: 26px;
}
.xq-left, .xq-right {
  width: 50%;
  display: inline-block;
}
.xq-title {
  width: 100%;
}
.Types div {
  display: inline-block;
}
.img div {
  float: left;
  height: 100px;
}
.imgs {
  display: flex;
  flex-direction: column-reverse;
  flex-wrap: nowrap;
  justify-content: flex-start;
  width: 100px;
  height: 100px;
  margin-left: 1.6%;
}
.imgs img {
  margin-top: 15px;
  width: 80%;
  height: 80%;
}
.log {
  // background: #ecf0f4;
  padding: 10px;
  padding-top: 19px;
  margin: -14px -10px 0 -10px;
}
.logs {
  margin-top: -4px;
  padding: 16px;
  background: #fff;
  border: 1px solid #dcdee2;
}
.logs-item {
  line-height: 30px;
}
.ems {
  font-style: normal;
  color: #aaa;
}
.table {
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
</style>
