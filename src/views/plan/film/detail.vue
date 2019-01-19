<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em></em>
      </div>
      <!-- <Button  v-if='showedit' type="success" icon="md-add-circle" class="btn-new"
        @click="goSet()">编辑合同</Button> -->
    </header>
    <div class="detail-box">
      <div class='titop'>基础信息</div>
      <div class="detail-header">
        <Row>
          <Col span="2"><div>公司名称</div></Col>
          <Col span="8"><span>{{detail.companyName}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>客户ID</div></Col>
          <Col span="8"><span>{{detail.customerId}}</span></Col>
          <Col span="2"><div>客户名称</div></Col>
          <Col span="8"><span>{{detail.customerName}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>上传人</div></Col>
          <Col span="8"><span>{{detail.applyUser}}</span></Col>
          <Col span="2"><div>上传时间</div></Col>
          <Col span="8"><span>{{detail.approvalTime}}</span></Col>
        </Row>
      </div>
      <div class='titop'>广告片</div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>ID</div></Col>
          <Col span="8"><span>{{detail.id}}</span></Col>
          <Col span="2"><div>名称</div></Col>
          <Col span="8"><span>{{detail.name}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>规格/时长</div></Col>
          <Col span="8"><span>{{detail.specification}}s/{{detail.length}}s</span></Col>
          <Col span="2"><div>转制费</div></Col>
          <Col span="8"><span>{{detail.transFee}}</span></Col>
        </Row>
        <Row>
          <Col span="12">
            <video :src="detail.srcFileUrl" width='100%' height='50%' controls="controls">
            </video>
          </Col>
        </Row>
      </Row>
      <div class='titop'>转制</div>
      <Row>
        <Table :columns="columns" :data="tableData"
        border stripe disabled-hover size="small" class="table"></Table>
      </Row>
      <div class='titop' v-if='showStatus'>审核</div>
      <Row class="detail-content" v-if='showStatus'>
        <div>
          <Form ref="dataForm" :model="dataForm"  label-position="left" :label-width="100">
            <FormItem label="审核意见" prop="status">
              <RadioGroup v-model='dataForm.operation'>
                <Radio v-for="it in approveStatusList" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-if='dataForm.operation == 2' label="拒绝理由" prop="reason">
              <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
            </FormItem>
          </Form>
          <Button style='margin-left:20px; margin-bottom: 20px;' type="primary"  @click="change('dataForm')">确定</Button>
          <Button style='margin-left:20px; margin-bottom: 20px;' @click="goback()">取消</Button>
        </div>
      </Row>
      <div class='titop' v-if='!showStatus'>操作记录</div>
      <Row class='detail-content' v-if='!showStatus'>
        <div class="logs-item" v-for="(it,index) in logList">
          <span>{{createTime}}</span>
          <span>{{it.email}}【{{it.userName}}】</span>
          {{it.description}}
        </div>
      </row>
    </div>
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch , Mixins  } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { queryList , queryItem , sapproval , dataFrom } from '@/api/planfilm'
// import AreaSelect from '@/components/AreaSelect.vue'
// import PartBindCinema from './partBindCinema.vue'
// import DlgEdit from '../account/dlgEdit.vue'
// import Upload from '@/components/Upload.vue'
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
  operation: 2
}

@Component({
  components: {
  }
})
export default class Main extends ViewBase {
  query = { ...defQuery }
  oldQuery: any = {}
  detail: any = {}
  attachments: any = []
  approveStatusList: any = [
    {
      key: 1,
      text: '通过'
    },
    {
      key: 2,
      text: '拒绝'
    }
  ]
  logList: any = []
  showStatus: any = false
  showedit: any = false

  id = 0

//   // 审核
  dataForm: any = { ...dataForm }


  mounted() {
    if ( this.$route.params.status == '1' ) {
      this.showStatus = true
    }
    if ( this.$route.params.status == '3' || this.$route.params.status == '4' ) {
      // this.showStatus = true
      this.showedit = true
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

  columns = [
    { title: '序号', key: 'id', align: 'center' },
    { title: '格式', key: 'typeCode', align: 'center' },
    { title: '附件', key: 'name', align: 'center' },
    {
      title: '上传时间',
      key: 'uploadTime',
      align: 'center',
      render: (hh: any, { row: { uploadTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(uploadTime).format(timeFormatDate)
        // console.log(html)
        return uploadTime == null ? <span class='datetime' v-html={'-'}></span> : <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '上传人', key: 'uploadName', align: 'center' },
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
      const res = await queryItem(this.$route.params.id)
      this.detail = res.data.item
      // console.log(this.detail)
    //   this.detail.cinemaList = res.data.ruleList || []
      // this.approveStatusList = res.data.statusList
    //   this.validityStartDate = String(this.detail.validityStartDate).slice(0, 4) + '-' +
    //   String(this.detail.validityStartDate).slice(4, 6) + '-' + String(this.detail.validityStartDate).slice(6, 8)
    //   this.validityEndDate = String(this.detail.validityEndDate).slice(0, 4) + '-' +
    //   String(this.detail.validityEndDate).slice(4, 6) + '-' + String(this.detail.validityEndDate).slice(6, 8)
    //   // 附件
      this.attachments = this.detail.attachments
      const logList = res.data.logList.map((item: any) => {
        return {
          ...item,
          createTime: moment(item.createTime).format(timeFormatDate)
        }
      })
    //   this.logList = logList.slice(0, 20)
    //   const { data: {
    //     approveStatusList: approveStatusList,
    //   } } = await queryList(query)
    //   this.approveStatusList = approveStatusList
      setTimeout(() => {
        (this.$Spin as any).hide()
      }, 1000)
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    } finally {
    }
  }

//   // cancel(dataForms: string) {
//   //   this.dataForm.refuseReason = ''
//   //   this.dataForm.approveStatus = 2
//   //   // this.showDlg = false
//   //   // ; (this.$refs.dataForm as any).resetFields()
//   // }

//   // 审核状态

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
          const res =  await sapproval (this.$route.params.id , query)
          // toast('操作成功')
          // this.$emit('done', this.dataForm.email)
          this.$router.push({ name : 'gg-film' })
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
.titop {
  line-height: 28px;
  color: rgb(61, 156, 235);
  font-size: 16px;
}
</style>
