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
          <Col span="2"><div>广告主公司名称</div></Col>
          <Col span="5"><span>{{detail.companyName}}</span></Col>
          <Col span="2"><div>客户类型</div></Col>
          <Col span="5"><span>{{detail.companyName}}</span></Col>
          <Col span="2"><div>所属行业</div></Col>
          <Col span="5"><span>{{detail.companyName}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>营业执照</div></Col>
          <Col span="5"><span class='ingbo' @click='onView(detail.customerId)'> </span></Col>
          <Col span="2"><div>客户ID</div></Col>
          <Col span="5"><span>{{detail.customerId}}</span></Col>
          <Col span="2"><div>客户名称</div></Col>
          <Col span="5"><span>{{detail.customerName}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>上传人</div></Col>
          <Col span="5"><span>{{detail.applyUser}}</span></Col>
          <Col span="2"><div>上传时间</div></Col>
          <Col span="5"><span>{{applyTime}}</span></Col>
        </Row>
      </div>
      <div class='titop'>行业资质</div>
      <div class="detail-header" style='padding-top: 10px; padding-bottom: 5px;'>
        <Row>
          <Col span="2"><div>主体资质</div></Col>
          <Col span="5"><span class='ingbo' @click='onView()'> </span></Col>
          <Col span="2"><div>可选资质</div></Col>
          <Col span="12"><span class='ingbo' @click='onView(detail.customerId)'> </span></Col>
        </Row>
      </div>
      <div class='titop'>广告片素材</div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>广告片ID</div></Col>
          <Col span="5"><span>{{detail.id}}</span></Col>
          <Col span="2"><div>广告片名称</div></Col>
          <Col span="5"><span>{{detail.name}}</span></Col>
          <Col span="2"><div>规格</div></Col>
          <Col span="5"><span>{{detail.specification}}s</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>是否已转制</div></Col>
          <Col span="5"><span>{{detail.specification}}s/{{detail.length}}s</span></Col>
          <Col span="2"><div>转制费</div></Col>
          <Col span="5"><span>{{detail.transFee}}</span></Col>
          <Col span="2"><div>广告片(小样)</div></Col>
          <Col span="5"><span style='cursor: pointer;' @click='onView(detail.customerId)'>查看</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>广告下载地址</div></Col>
          <Col span="10"><span>hahahhahahahhagyuhbjjnjnjkjkjkjkjkjnjkkjkkjjkjkjkk</span></Col>
        </Row>
        <!-- <Row>
          <Col span="12">
            <video :src="detail.srcFileUrl" width='100%' height='50%' controls="controls">
            </video>
             <a class="operation" v-if='showedit' href="" :download=detail.srcFileUrl>下载源文件</a>
          </Col>
        </Row> -->
      </Row>
      <div  class='titop' v-if='showStatus'>整体审核</div>
      <Row  class='detail-content' v-if='showStatus'>
        <Row style='margin-top: 15px;'>审核说明：</Row>
        <Row>请参考下列表中的审核拒绝原因，核对在监播中已出现的行业资质及广告内容。如广告内容符合审核未通过的原因，请对应选择审核未通过的原因。</Row>
        <Row style='color: red;padding-bottom: 15px;'>如未勾选，则表示该广告审核成功</Row>
        <Table :columns="columnsReason" :data="fixedRefuseReasonsList"
        border disabled-hover size="small" class="table">
           <template  slot="stypeSelected" slot-scope="{row}">
             <input v-if='$route.params.status == "1"' type="checkbox"  :checked='row.stypeSelected' />
             <input v-if='$route.params.status == "5"' type="checkbox"  :checked='row.stypeSelected' disabled />
           </template>
        </Table>
        <Row style='padding: 15px 0;'>审核未通过原因（勾选其他时）：</Row>
        <Row>
          <Input style="width:240px" type='textarea' :disabled='$route.params.status == "5"' :maxlength="120" v-model="dataForm.refuseReason"></Input>
        </Row>
        <Row> {{dataForm.refuseReason.length}} / {{120 - dataForm.refuseReason.length}}</Row>
        <Row style='padding: 15px 0;'>
          <Button  type="primary" @click="dataFormSubmit">提交</Button>
          <Button style='margin-left: 15px;' type="primary" @click="nextSubmit">提交并继续审核</Button>
        </Row>
        
      </Row>
      <div class='titop' v-if='showStatus'>批注</div>
      <Row  class='detail-content' v-if='showStatus'>
        <Row style='padding: 15px 0;'>仅公司内容运营人员使用:</Row>
        <Row>
          <Input style="width:240px" type='textarea' v-model="dataForm.refuseReason"></Input>
        </Row>
        <Row style='padding: 15px 0;'>
          <Button  type="primary" @click="beizhuSubmit">提交</Button>
        </Row>
      </Row>
      <div v-if='showedit' class='titop'>转制</div>
      <Row v-if='showedit' >
        <Table :columns="columns" :data="tableData"
        border disabled-hover size="small" class="table">
          <template slot="spaction" slot-scope="{row}">

            <UploadButton v-auth="'advert.videos:upload-attachment'" style='margin-top:17px;' v-if='row.desc == undefined'  @success="onUploadSuccess($event, row.key)">上传</UploadButton>
            <a v-if='row.desc == undefined' @click="edit(0 , row.key)">录入下载链接</a>

            <a v-auth="'advert.videos:modify-attachment'" style='margin-top:17px;' v-if="row.desc != undefined && row.desc.fileId == null"  @click="edit(row.desc.id, row.key , row )">编辑</a>&nbsp;&nbsp;&nbsp;
            <a v-auth="'advert.videos:delete-attachment'" style='margin-top:17px;' v-if="row.desc != undefined && row.desc.fileId == null" @click="del( row.desc.id)">删除</a>
 
            <a v-if="row.desc != undefined && row.desc.fileId != null" style='margin-top:17px;' class="operation" :href="row.desc.fileUrl" :download="row.desc.fileUrl">下载</a>&nbsp;&nbsp;&nbsp;
            <a v-auth="'advert.videos:delete-attachment'" style='margin-top:17px;' v-if="row.desc != undefined && row.desc.fileId != null"  @click="del( row.desc.id)">删除</a>
        </template> 
        </Table>
      </Row>
      <!-- <div class='titop' v-if='showStatus'>审核</div>
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
      </Row> -->
      <div class='titop' v-if='!showStatus'>操作记录</div>
      <Row class='detail-content' v-if='!showStatus'>
        <div class="logs-item" v-for="(it,index) in logList">
          <span>{{it.createTime}}   </span>&nbsp;&nbsp;
          <span>   {{it.email}}【{{it.userName}}】</span>
             {{it.description}}
        </div>
      </row>
    </div>
    <DlgEdit  ref="addOrUpdate" :cinemaOnes="editOne"  @refreshDataList="reloadSearch" v-if="addOrUpdateVisible" @done="dlgeditdone"/>
    <!-- 查看图片 -->
    <Modal v-model="viewerShow" title="查看" width="500" height="500">
      <img style="width: 100%;" :src="viewerImage" alt sizes srcset>
    </Modal>
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
import { findIndex } from 'lodash'



const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const timeFormatDate = 'YYYY-MM-DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

const defQuery = {
}

const dataForm = {
  refuseReason: '',
  agree: true
}

const getName = (ptypeCode: any, list: any[]) => {
  const i: number = findIndex(list, (it: any) => {
    return ptypeCode === it.ptypeCode
  })
  const res: string = (!list[i].value || list[i].value == '') ? '-' : list[i].value
  return res
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

  // 查看图片
  viewerShow = false
  viewerImage = ''


  addOrUpdateVisible = false

  // 需要跳过的数量
  jumpNum: any = 0
  // 读取的下一个数据列表

  dataList: any = [
    {
      value: '行业资质',
      key: 'VIDEO_INDUSTRY_QUALIFICATION'
    },
    {
      value: '广告片素材',
      key: '2'
    }
  ]

  fixedRefuseReasonsList: any = [
    {
      controlStatus: 1,
      stypeName: ' 广告主红章涉嫌PS',
      stypeSelected: true,
      ptypeCode: 'VIDEO_INDUSTRY_QUALIFICATION',
      stypeCode: '1',
      ptypeName: '行业资质'
    },
    {
      controlStatus: 1,
      stypeName: '与官网查询结果不一致',
      stypeSelected: false,
      ptypeCode: 'VIDEO_INDUSTRY_QUALIFICATION',
      stypeCode: '2',
      ptypeName: '行业资质'
    },
    {
      controlStatus: 1,
      stypeName: '营业执照经营范围无法备案该行业',
      stypeSelected: false,
      ptypeCode: 'VIDEO_INDUSTRY_QUALIFICATION',
      stypeCode: '3',
      ptypeName: '行业资质'
    },
    {
      controlStatus: 1,
      stypeName: '资质截图不完整',
      stypeSelected: false,
      ptypeCode: 'VIDEO_INDUSTRY_QUALIFICATION',
      stypeCode: '4',
      ptypeName: '行业资质'
    },
    {
      controlStatus: 1,
      stypeName: '资质未注明所需文字及加盖广告主红章',
      stypeSelected: false,
      ptypeCode: 'VIDEO_INDUSTRY_QUALIFICATION',
      stypeCode: '5',
      ptypeName: '行业资质'
    },
    {
      controlStatus: 1,
      stypeName: '资质不清晰需上传原件照片对比',
      stypeSelected: false,
      ptypeCode: 'VIDEO_INDUSTRY_QUALIFICATION',
      stypeCode: '6',
      ptypeName: '行业资质'
    },
    {
      controlStatus: 1,
      stypeName: '资质截图不可出现水印',
      stypeSelected: false,
      ptypeCode: 'VIDEO_INDUSTRY_QUALIFICATION',
      stypeCode: '7',
      ptypeName: '行业资质'
    },
    {
      controlStatus: 1,
      stypeName: '资质未年检',
      stypeSelected: false,
      ptypeCode: 'VIDEO_INDUSTRY_QUALIFICATION',
      stypeCode: '8',
      ptypeName: '行业资质'
    },
    {
      controlStatus: 1,
      stypeName: '发证机关公章涉嫌PS',
      stypeSelected: false,
      ptypeCode: 'VIDEO_INDUSTRY_QUALIFICATION',
      stypeCode: '9',
      ptypeName: '行业资质'
    },
  ]

  columnsReason: any = []


  id = 0

  applyTime = ''

//   // 审核
  dataForm: any = { ...dataForm }

  mounted() {
    this.columnsReason = [
      { title: '审核内容', key: 'ptypeName',  align: 'center' },
      { title: '审核拒绝的原因', key: 'stypeName',   align: 'center' },
      { title: '是否符合审核拒绝的原因', slot: 'stypeSelected', align: 'center' },
    ]
    if ( this.$route.params.status == '1' || this.$route.params.status == '5' ) {
      this.showStatus = true
    }
    if ( this.$route.params.status == '3' || this.$route.params.status == '4' ) {
      this.showedit = true
    }
    this.doSearch()
  }


  // 上传文件
  async onUploadSuccess({ files }: SuccessEvent, key: number) {
    const typetext = key
    // const typecode = this.typeList.map((item: any) => {
    //       return item.sort
    // })
    // const index = typecode.indexOf(typetext)
    // if (index != -1) {
      try {
        await addvideo (this.$route.params.id , {
                                                name: files[0].clientName,
                                                fileId: files[0].fileId,
                                                typeCode: -1
                                              })
        toast('操作成功')
        this.doSearch()
      } catch (ex) {
        this.handleError(ex)
      }
  }

  get tableData() {
    const typeList = (this.typeList || []).map((it: any) => {
      return {
        ...it,
      }
    })
    return typeList
  }

  // 转制附件列表展示
  columns = [
    // { title: '序号', key: 'sort', width: 80 , align: 'center' },
    // { title: '格式', key: 'text', width: 130 , align: 'center' },
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
          return <span class='datetime' v-html={'-'}></span>
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
          return <span class='datetime' v-html={'-'}></span>
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
          return <span class='datetime' v-html={'-'}></span>
        }
        
        /* tslint:enable */
      }
    },
    // <uploadButton style='margin-bottom:17px;' multiple @success="onUploadSuccess">上传</uploadButton>
    {
      title: '操作',
      slot: 'spaction',
      width: 170,
      align: 'center',
    }
  ]


  async doSearch() {
    (this.$Spin as any).show()
    this.oldQuery = { ...this.query }
    const query = clean({ ...this.query })
    try {
      const res = await queryItem(this.$route.params.id)
      this.detail = res.data.item
      this.applyTime = moment(this.detail.applyTime).format(timeFormatDate)
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
  // 新增 / 修改 (录入下载链接/)
  edit(id: number , key: any , row: any ) {
    this.addOrUpdateVisible = true
    !!id ? this.editOne = row : this.editOne
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id , key)
    })
  }

  // 提交并继续审核
  nextSubmit() {
    const dataItem: any = JSON.parse((sessionStorage.getItem('info' + this.$route.params.id) as any))
    if (dataItem.pageidx == 1) {
      this.jumpNum = dataItem.index
    } else {
      this.jumpNum = ((dataItem.pageidx) * dataItem.pagese) + dataItem.index
    }
  }
  // 提交审核拒绝原因
  dataFormSubmit() {

  }

  // 提交批注
  beizhuSubmit() {

  }

  dlgeditdone() {
    this.doSearch()
  }

  // 查看图片
  onView(url: string) {
    this.viewerImage = url
    this.viewerShow = true
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
.addbut {
  margin-top: 10px;
}
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
  border-color: #dcdee2 !important;
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
  margin-bottom: 10px;
}
.logs-item {
  height: 35px;
}
.ingbo {
  border: 1px solid #ccc;
  width: 80px;
  height: 80px;
  margin-right: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
/deep/ .ivu-btn {
  border-color: #fff;
}
/deep/ .ivu-btn:focus {
  box-shadow: 0;
}
/deep/ textarea {
  min-width: 500px;
  min-height: 75px;
  max-height: 75px;
  max-width: 500px;
}
/deep/ .ivu-table-wrapper {
  width: 80%;
}
/deep/ .ivu-table {
  width: 100% !important;
}
/deep/ [type=checkbox] {
  box-sizing: border-box;
  padding: 0;
  width: 20px;
  height: 15px;
}
</style>
