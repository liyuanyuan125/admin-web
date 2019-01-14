<template>
  <div class="page">
    <div class="Inp-Group-res">
      <Button style='margin-bottom:5px;' class="bth" icon="md-return-left" @click="goback">返回上一页</Button>
      <div class="Inps-res">
        <div class="res-num">
          <p>变更编号</p>
          <div class="res-num-item change-item">
            <span>{{list.id}}</span>
          </div>
        </div>
        <div class="res-num">
          <p>&nbsp;&nbsp;&nbsp;&nbsp;申请人</p>
          <div class="res-num-item">
            <span class='item1'>{{list.applyUserName}}</span>
            <span class="res-date les">申请时间</span>
            <span>{{applyTime}}</span>
          </div>
        </div>
        <div class="res-num">
          <p>&nbsp;&nbsp;&nbsp;&nbsp;联系人</p>
          <div class="res-num-item">
            <span class='item1'>{{company.contract}}</span>
            <span class="res-date les">联系电话</span>
            <span>{{company.contractTel}}</span>
          </div>
        </div>
        <div class="res-num">
          <p>公司简称</p>
          <div class="res-num-item">
            <span class='item1'>{{company.shortName}}</span>
            <span class="res-date les">公司地址</span>
            <span>{{company.addressDetail}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class='xq'>
      <div class='xq-left'>
        <div class='xq-title'>变更前</div>
        <div><span>公司名称: </span><span>【{{list.modifyBeforeName}}】</span></div>
        <div class='Types'><span>公司类型: </span>
          <div v-for="it in precom" :key='it.typeCode'>
            <div v-for="ity in list.modifyBeforeTypes" :key='ity.typeCode' v-if='ity.typeCode == it.typeCode'>
              <span>&nbsp;【{{it.typeName}}】&nbsp;</span>
            </div>
         </div>
        </div>
        <div class='Types'><span>资质类型: </span>
          <div v-for="it in prequalification" v-if='list.modifyBeforeQualificationType == it.key' :key='it.key'>
            <!-- <div v-for="ity in list.modifyBeforeQualificationType" v-if='ity.key == it.typeCode'> -->
              <span>【{{it.text}}】</span>
            <!-- </div> -->
          </div>
        </div>
        <div><span>资质编号: </span><span>【{{list.modifyBeforeQualificationCode}}】</span></div>
        <div class='img'>
          <div>资质图片: </div>
          <div class='imgs' v-for="it in preimages"  :key='it.key'>
            <img :src=it.url alt="" sizes="" srcset="">
          </div>
        </div>
      </div>
      <div class='xq-right'>
        <div class='xq-title'>变更后</div>
        <div><span>公司名称: </span><span>【{{list.modifyAfterName}}】</span></div>
        <div class='Types'><span>公司类型: </span>
          <div v-for="it in precom"  :key='it.typeCode'>
            <div v-for="ity in list.modifyAfterTypes" :key='ity.typeCode' v-if='ity.typeCode == it.typeCode'>
              <span>&nbsp;【{{it.typeName}}】&nbsp;</span>
            </div>
          </div>
        </div>
        <div class='Types'><span>资质类型: </span>
          <div v-for="it in prequalification" v-if='list.modifyAfterQualificationType == it.key' :key='it.key'>
            <!-- <div v-for="ity in list.modifyBeforeQualificationType" v-if='ity.key == it.typeCode'> -->
              <span>【{{it.text}}】</span>
            <!-- </div> -->
          </div>
        </div>
        <div><span>资质编号: </span><span>【{{list.modifyAfterQualificationCode}}】</span></div>
        <div class='img'>
          <div>资质图片: </div>
          <div class='imgs' v-for="it in aftimages"  :key='it.key'>
            <img :src=it.url alt="" sizes="" srcset="">
          </div>
        </div>
      </div>
    </div>
    <div class="log">
      <div class="n-main">审核记录</div>
      <div class="logs">
        <div class="logs-item" v-for="(it,index) in log">
          <span>{{createTime}}   </span>
          <span>{{it.email}}【{{it.userName}}】   </span>
          {{it.description}}
        </div>
        <div v-if='showStatus'>
          <Form ref="dataForm" :model="dataForm"  label-position="left" :rules="ruleValidate" :label-width="100">
            <FormItem label="审核意见" prop="status">
              <RadioGroup v-model='dataForm.approveStatus'>
                <!-- <Radio label="启用"></Radio>
                <Radio label="停用"></Radio> -->
                <Radio v-for="it in approveStatusList" v-if="it.key!=0&&it.key!=1" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-if='dataForm.approveStatus == 3' label="拒绝理由" prop="reason">
            <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
          </FormItem>
          </Form>
          <Button style='margin-left:20px;' type="primary"  @click="change('dataForm')">确定</Button>
          <Button style='margin-left:20px;'>取消</Button>
        </div>
        
      </div>
    </div>
    
    <!-- <dlgChange  ref="change" :prelist="prelist"  @refreshDataList="search" v-if="changeVisible" @done="dlgEditDone"/> -->

  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { get } from '@/fn/ajax'
import { queryList , queryItem , setList , dataFrom } from '@/api/order'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice , clean } from '@/fn/object'
// import dlgChange from './dlgChange.vue'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

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
  refuseReason: '',
  approveStatus: 2
}

@Component({
  components: {
    // dlgChange
  }
})
export default class Main extends ViewBase {
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
  applyTime = ''
  createTime = ''
  // 所有数据
  list: any = []
  // 公司信息
  company: any = []
  // 客户类型列表
  precom: any = []
  // 资质类型列表
  prequalification: any = []
  // 修改前资质图片
  preimages: any = []
  // 修改后资质图片
  aftimages: any = []
  // 日志
  log: any = []
  // 审核
  approveStatusList: any = []
  total = 0
  ids = ''
  sta = 2
  reason = 123132
  id = 0
  showStatus: boolean = true

  dataForm: any = { ...dataForm }

  mounted() {
    const { id } = this.$route.params
    if ( this.$route.params.approveStatus == '2' ) {
      this.showStatus = false
    }
    this.ids = id
    this.doSearch()
    this.applyTime = moment(this.list.applyTime).format(timeFormat)
    this.createTime = moment(this.log.createTime).format(timeFormat)
  }

  dlgEditDone() {
    this.doSearch()
  }



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
          const res =  await setList (this.$route.params.id , query)
          // toast('操作成功')
          // this.$emit('done', this.dataForm.email)
          this.$router.push({ name : 'client-order' })
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
      const { data } = await queryItem(this.$route.params.id)
      this.list = data
      this.company = data.company
      this.precom = data.customerTypeList
      this.prequalification = data.qualificationTypeList
      this.preimages = data.modifyBeforeImageList
      this.aftimages = data.modifyAfterImageList
      this.log = data.logList
      const { data: {
        approveStatusList: approveStatusList,
      } } = await queryList(query)
      this.approveStatusList = approveStatusList
    } catch (ex) {
      // this.handleError(ex)
    } finally {
      this.loading = false
    }
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
.Inps-res,
.res-Inps {
  width: 100%;
  height: 100%;
  padding-top: 7px;
  padding-bottom: 7px;
  font-size: 13px;
  background: #fff;
  border: 1px solid #dcdee2;
}
.res-num {
  display: flex;
  width: 100%;
  line-height: 45px;
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
}
.res-num-item {
  display: flex;
  width: 80%;
  height: 100%;
  // max-height: 60px;
}
.res-num-item span {
  display: inline-block;
  margin-left: 5%;
}
.item1 {
  width: 12%;
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
  font-size: 13px;
}
.xq div {
  line-height: 43px;
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
  width: 100px;
  height: 100px;
  margin-left: 10px;
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
.table {
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
</style>
