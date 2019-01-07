<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em></em>
      </div>
      <Button type="success" icon="md-add-circle" class="btn-new"
        @click="goSet()">编辑合同</Button>
    </header>
    <div class="detail-box">
        合同主体信息
      <div class="detail-header">
          <Row>
            <Col span="2"><div>合同名称</div></Col>
            <Col span="8"><span>{{detail.contractName}}</span></Col>
            <Col span="2"><div>甲方公司</div></Col>
            <Col span="8"><span>{{detail.companyACode}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>合同编号</div></Col>
            <Col span="8"><span>{{detail.contractNo}}</span></Col>
            <Col span="2"><div>合同有效期</div></Col>
            <Col span="8"><span>{{detail.validityStartDate}}~{{detail.validityEndDate}}</span></Col>
          </Row>
      </div>
        乙方信息
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>乙方公司</div></Col>
          <Col span="8"><span>{{detail.companyBName}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>联系人</div></Col>
          <Col span="8"><span>{{detail.companyBContact}}</span></Col>
          <Col span="2"><div>联系电话</div></Col>
          <Col span="8"><span>{{detail.companyBPhone}}</span></Col>
        </Row>
      </Row>
      结算账户信息
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>开户行</div></Col>
          <Col span="8"><span>{{detail.accountBank}}</span></Col>
          <Col span="2"><div>开户名</div></Col>
          <Col span="8"><span>{{detail.accountName}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>银行账号</div></Col>
          <Col span="8"><span>{{detail.accountNumber}}</span></Col>
          <Col span="2"><div>结算账期</div></Col>
          <Col span="8"><span>{{detail.settlementPeriod}}</span></Col>
        </Row>
      </Row>
      <Row class="detail-content">
        <Row class="cinema-button">
          <Col span="2"><div>分成比例</div></Col>
          <Col span="12" v-for='it in detail.cinemaList' :key='it.proportion'>
          以下影院，分成比例为【{{it.proportion}}%】
              <PartBindCinema type="1" :value="it.cinemaList" />
          </Col>
        </Row>
      </Row>
       附件信息
      <Row class="detail-content">
        <Table :columns="columns" :data="tableData"
        border stripe disabled-hover size="small" class="table"></Table>
      </Row>
      责任人
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>签订人</div></Col>
          <Col span="8"><span>{{detail.signingUsesName}}</span></Col>
          <Col span="2"><div>跟进人</div></Col>
          <Col span="8"><span>{{detail.followUserName}}</span></Col>
        </Row>
      </Row>
      备注
      <Row class="detail-content">
        <Row>
          <Col span="16"><span>{{detail.remark}}</span></Col>
        </Row>
      </Row>
      操作记录
      <Row class="detail-check">
        <Row>
          <div v-for="(item, i) in logList" :key="i">
            <span>{{item.createTime}}</span>
            <span>由{{item.email}}<b style="margin: 0 5px">[{{item.userName}}]</b>{{item.description}}</span>
          </div>
        </Row>
      </Row>
      <Row v-if='showStatus'>
        审批信息
        <div>
          <Form ref="dataForm" :model="dataForm"  label-position="left" :rules="ruleValidate" :label-width="100">
            <FormItem label="审核意见" prop="status">
              <RadioGroup v-model='dataForm.approveStatus'>
                <!-- <Radio label="启用"></Radio>
                <Radio label="停用"></Radio> -->
                <Radio v-for="it in approveStatusList" v-if="it.key==2||it.key==3" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-if='dataForm.approveStatus == 3' label="拒绝理由" prop="reason">
              <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
            </FormItem>
          </Form>
          <Button style='margin-left:20px;' type="primary"  @click="change('dataForm')">确定</Button>
          <Button style='margin-left:20px;'>取消</Button>
        </div>
      </Row>
    </div>
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch , Mixins  } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { queryList , queryId , zuofei } from '@/api/list'
import AreaSelect from '@/components/AreaSelect.vue'
import PartBindCinema from './partBindCinema.vue'
// import DlgEdit from '../account/dlgEdit.vue'
import Upload from '@/components/Upload.vue'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { slice , clean } from '@/fn/object'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const timeFormatDate = 'YYYY/MM/DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

const defQuery = {
}

const dataForm = {
  refuseReason: '',
  approveStatus: 2
}

@Component({
  components: {
    AreaSelect,
    PartBindCinema,
    Upload,
    // DlgEdit
  }
})
export default class Main extends ViewBase {
  query = { ...defQuery }
  oldQuery: any = {}
  detail: any = {}
  approveStatusList: any = []
  logList: any = []
  attachments: any = []
  showimg = true
  showStatus: any = false
  id = 0
  // 审核
  dataForm: any = { ...dataForm }

  ruleValidate = {
    // status: [
    //   { required: true, message: '请选择', trigger: 'blur' }
    // ],
    // reason: [
    //   { required: true, message: '请输入拒绝原因'}
    // ]
  }

  mounted() {
    if ( this.$route.params.approveStatus == '1' ) {
      this.showStatus = true
    }
    this.doSearch()
  }
  get cachedMap() {
    return {
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const attachments = (this.attachments || []).map((it: any) => {
      return {
        ...it,
      }
    })
    return attachments
  }
  search() {
  }

  columns = [
    { title: '序号', key: 'id', align: 'center' },
    { title: '附件', key: 'name', align: 'center' },
    {
      title: '上传时间',
      key: 'uploadTime',
      align: 'center',
      render: (hh: any, { row: { uploadTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = String(uploadTime).slice(0,4) + '-' + String(uploadTime).slice(4,6) + '-' + String(uploadTime).slice(6,8)
        console.log(html)
        return uploadTime == null ? <span class='datetime' v-html='-'></span> : <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '上传人', key: 'uploadUserName', align: 'center' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { approveStatus, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
          return <div class='row-acts'>
          <a class="operation" href="" download={row.name}>下载</a>
        </div>
        
        /* tslint:enable */
      }
    }
  ]
  async doSearch() {
     (this.$Spin as any).show()
     this.oldQuery = { ...this.query }


    const query = clean({ ...this.query })
    try {
      const res = await queryId(this.$route.params.id)
      this.detail = res.data
      this.detail.cinemaList = res.data.ruleList || []
      this.approveStatusList = res.data.approveStatusList
      // 附件
      this.attachments = res.data.attachmentList
      const logList = res.data.logList.map((item: any) => {
        return {
          ...item,
          createTime: moment(item.createTime).format(timeFormatDate)
        }
      })
      this.logList = logList.slice(0, 20)
      const { data: {
        approveStatusList: approveStatusList,
      } } = await queryList(query)
      this.approveStatusList = approveStatusList
      setTimeout(() => {
        (this.$Spin as any).hide()
      }, 1000)
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    } finally {
    }
  }

  // 审核状态

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
          const res =  await zuofei (this.$route.params.id , query)
          // toast('操作成功')
          // this.$emit('done', this.dataForm.email)
          this.$router.push({ name : 'contract-list' })
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }

  // 返回
  back() {
    this.$router.go(-1)
  }
  // 编辑列表页面
  goSet() {
    const id = this.$route.params.id
    this.$router.replace({ name: 'contract-list-edit', params: { id }} )
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
.detail-number {
  /deep/ .btn-add {
    margin-left: 8px;
    line-height: 50px;
  }
}

.btn-back {
  margin-right: 10px;
}
.detail-check {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  padding: 10px;
  padding-left: 14px;
}
.detail-header, .detail-content, .detail-footer, .detail-number {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  padding-left: 14px;
  /deep/ .ivu-col-span-2 {
    div {
      line-height: 50px;
      width: 88px;
    }
  }
  .red {
    color: red;
  }
  span {
    display: inline-block;
    line-height: 50px;
    color: #717975;
  }
  span:only-child:empty {
    &::before {
      content: '暂无';
    }
  }
  /deep/ .cinema-button {
    margin-bottom: 20px;
  }
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
  padding-bottom: 40px;
  /deep/ .uplaod-slot {
    margin-bottom: 10px;
    color: #19be6b;
  }
}
.detail-edit {
  text-align: center;
  padding-bottom: 20px;
  .btn-set {
    width: 100px;
    margin: 0 10px;
  }
}
.typeBox {
  position: relative;
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
  background: #ecf0f4;
  color: #717975;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 20px;
    width: 50px;
    text-align: center;
    color: #717975;
    line-height: 20px;
    background: #dcdee2;
  }
  .red {
    color: red;
  }
}
.upload-wrap {
  background-color: #ecf0f4;
  padding-bottom: 6px;
  margin-top: 6px;
}
.upload-info {
  line-height: 18px;
  padding: 10px 0 0 8px;
  margin-bottom: 6px;
}
.show-img {
  width: 120px;
  height: 80px;
  margin: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
