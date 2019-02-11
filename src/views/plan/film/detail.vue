<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em></em>
      </div>
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
             <a class="operation" v-if='showedit' href="" :download=detail.srcFileUrl>下载源文件</a>
          </Col>
        </Row>
      </Row>
      <div v-if='showedit' class='titop'>转制</div>
      <Row v-if='showedit' >
        <UploadButton style='margin-bottom:17px;' multiple @success="onUploadSuccess">上传</UploadButton>
        <Table :columns="columns" :data="tableData"
        border stripe disabled-hover size="small" class="table"></Table>
      </Row>
      <div class='titop' v-if='showStatus'>审核</div>
      <Row class="detail-content" v-if='showStatus'>
        <div>
          <Form ref="dataForm" :model="dataForm"  label-position="left" :label-width="100">
            <FormItem label="审核意见" prop="status">
              <RadioGroup v-model='dataForm.agree'>
                <Radio v-for="it in approveStatusList" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-if='dataForm.agree == false' label="拒绝理由" prop="reason">
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
          <span>{{it.createTime}}</span>
          <span>{{it.email}}【{{it.userName}}】</span>
          {{it.description}}
        </div>
      </row>
    </div>
    <DlgEdit  ref="addOrUpdate" :cinemaOnes="editOne"  @refreshDataList="reloadSearch" v-if="addOrUpdateVisible" @done="dlgeditdone"/>
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch , Mixins  } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { queryList , queryItem , sapproval , dataFrom , dels , addvideo } from '@/api/planfilm'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { slice , clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import UploadButton, { SuccessEvent } from '@/components/UploadButton.vue'
import DlgEdit from './dlgEdit.vue'




const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const timeFormatDate = 'YYYY-MM-DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

const defQuery = {
}

const dataForm = {
  refuseReason: '',
  agree: true
}

@Component({
  components: {
    UploadButton,
    DlgEdit
  }
})
export default class Main extends ViewBase {
  query = { ...defQuery }
  oldQuery: any = {}
  detail: any = {}
  att: any = {}
  attachments: any = []
  approveStatusList: any = [
    {
      key: true,
      text: '通过'
    },
    {
      key: false,
      text: '拒绝'
    }
  ]
  logList: any = []
  showStatus: any = false
  showedit: any = false
  typeList: any = []

  editOne: any = null


  addOrUpdateVisible = false


  id = 0

//   // 审核
  dataForm: any = { ...dataForm }


  mounted() {
    // console.log(this.$route.params)
    if ( this.$route.params.status == '1' ) {
      this.showStatus = true
    }
    if ( this.$route.params.status == '3' || this.$route.params.status == '4' ) {
      this.showedit = true
    }
    this.doSearch()
  }


  // 上传文件
  async onUploadSuccess({ files }: SuccessEvent) {
    const typetext = files[0].clientName.split('.')[1]
    const typecode = this.typeList.map((item: any) => {
          return item.text
    })
    const index = typecode.indexOf(typetext)
    if (index != -1) {
      try {
        await addvideo (this.$route.params.id , {
                                                name: files[0].clientName,
                                                fileId: files[0].fileId,
                                                typeCode: this.typeList[index].key
                                              })
        toast('操作成功')
        this.doSearch()
      } catch (ex) {
        this.handleError(ex)
      }
    } else {
      alert('请确认上传文件格式')
    }
  }
  get cachedMap() {
    return {
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const typeList = (this.typeList || []).map((it: any) => {
      return {
        ...it,
      }
    })
    return typeList
  }

  columns = [
    { title: '序号', key: 'sort', width: 80 , align: 'center' },
    { title: '格式', key: 'text', width: 130 , align: 'center' },
    { title: '附件', key: 'name',  align: 'center',
      render: (hh: any, { row: { desc , text } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (desc!=undefined) {
          if (desc.fileId == '' || desc.fileId == null) {
            return <span class='datetime' v-html={desc.fileUrl}></span>
          } else {
            return <span class='datetime' style='color:#4b9cf2' v-html={desc.name}></span>
          }
        } else {
          <span class='datetime' v-html={'-'}></span>
        }
        
        /* tslint:enable */
      }
    },
    {
      title: '上传时间',
      key: 'uploadTime',
      width: 150 ,
      align: 'center',
      render: (hh: any, { row: { desc } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (desc!=undefined ) {
          const html = moment(desc.uploadTime).format(timeFormatDate)
          return desc.uploadTime == null ? <span class='datetime' v-html={'-'}></span> : <span class='datetime' v-html={html}></span>
        } else {
          <span class='datetime' v-html={'-'}></span>
        }
        /* tslint:enable */
      }
    },
    { title: '上传人', key: 'uploadName', align: 'center', width: 150,
      render: (hh: any, { row: { desc } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (desc!=undefined ) {
          const html = '【' + desc.uploadEmail + '】' + desc.uploadName
          if (desc.uploadEmail == null) {
            return <span class='datetime' v-html={desc.uploadName}></span>
          } else {
            return <span class='datetime' v-html={html}></span>
          }
        } else {
          <span class='datetime' v-html={'-'}></span>
        }
        
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center',
      render: (hh: any, { row: { desc , key }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if ( desc == undefined ) {
          const ids = 0;
          return <div class='row-acts'>
            <a on-click={this.edit.bind(this , 0 , key)}>录入下载链接</a>
          </div>
        } else {
          if ( row.desc.fileId == '' || row.desc.fileId == null) {
            return <div class='row-acts'>
              <a on-click={this.edit.bind(this, desc.id, key , row )}>编辑</a>&nbsp;&nbsp;&nbsp;
              <a on-click={this.del.bind(this, desc.id)}>删除</a>
            </div>
          } else {
            return <div class='row-acts'>
              <a class="operation" href="" download={desc.fileUrl}>下载</a>&nbsp;&nbsp;&nbsp;
              <a on-click={this.del.bind(this, desc.id)}>删除</a>
            </div>
          }
        }
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
       // 附件
      this.typeList = res.data.typeList.map((it: any) => {
        const key = it.key
        const typecode = this.detail.attachments.map((item: any) => {
          return item.typeCode
        })
        const index = typecode.indexOf(key)
        if (index != -1) {
          return {
            ...it,
            desc: this.detail.attachments[index]
          }
        } else {
          return {
            ...it
          }
        }
      })


      this.logList = res.data.logList.map((item: any) => {
        return {
          ...item,
          createTime: item.createTime == null ? '暂无时间' : moment(item.createTime).format(timeFormatDate)
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
  // 新增 / 修改
  edit(id: number , key: any , row: any ) {
    this.addOrUpdateVisible = true
    !!id ? this.editOne = row : this.editOne
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id , key)
    })
  }

  dlgeditdone() {
    this.doSearch()
  }

  reloadSearch() {
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
        try {
          const res =  await sapproval (this.$route.params.id , query)
          this.$router.push({ name : 'gg-film' })
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }

  async del(id: any) {
    try {
      await confirm('您确定删除此视频文件吗？')
      await dels(this.$route.params.id , id)
      toast('删除成功')
      this.doSearch()
    } catch (ex) {
      this.handleError(ex)
    }
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
  line-height: 35px;
  color: rgb(61, 156, 235);
  font-size: 16px;
}
</style>
