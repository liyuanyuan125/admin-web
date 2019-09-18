<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" v-if='$route.params.status == 1' @click="backList" class="btn-back">返回列表</Button>
      <Button icon="md-return-left" v-if='$route.params.status != 1' @click="back" class="btn-back">返回上一页</Button>
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
          <Col span="5"><span>{{detail.customerCategory}}</span></Col>
          <Col span="2"><div>所属行业</div></Col>
          <Col span="5"><span>{{detail.businessType}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>营业执照</div></Col>
          <Col span="5">
            <span v-if='detail.companylicenseFileUrls == null'>暂无</span>
            <span class='ingbo' v-else v-for='(itd,index) in detail.companylicenseFileUrls'><img @click='onView(itd.fileUrl)' :src="itd.fileUrl" alt=""></span>
          </Col>
          <Col span="2"><div>客户ID</div></Col>
          <Col span="5"><span>{{detail.customerId}}</span></Col>
          <Col span="2"><div>客户名称</div></Col>
          <Col span="5"><span>{{detail.customerName}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>上传人</div></Col>
          <Col span="5"><span>{{detail.applyUserName == null ? '暂无' : detail.applyUserName}}</span></Col>
          <Col span="2"><div>上传时间</div></Col>
          <Col span="5"><span>{{applyTime}}</span></Col>
        </Row>
      </div>
      <div v-if='detail.customerCategory != "直客" ' class='titop'>行业资质</div>
      <div v-if='detail.customerCategory != "直客" ' class="detail-header" style='padding-top: 10px; padding-bottom: 5px;'>
        <Row>
          <Col span="2"><div>主体资质</div></Col>
          <Col span="5">
            <span v-if='detail.licenseFileUrl == null'>暂无</span>
            <span class='ingbo' v-else @click='onView(detail.licenseFileUrl)'><img :src="detail.licenseFileUrl" alt=""></span>
          </Col>
          <Col span="2"><div>可选资质</div></Col>
          <Col span="12">
            <span  v-if='detail.grantFileIds == null'>暂无</span>
            <span class='ingbo' v-else v-for='(itd,index) in detail.grantFileIds'><img @click='onView(itd.fileUrl)' :src="itd.fileUrl" alt=""></span>
          </Col>
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
          <Col span="5"><span>{{detail.translated == 1 ? '已转制' : '未转制'}}</span></Col>
          <Col span="2"><div>转制费</div></Col>
          <Col span="5"><span>{{formatNumber(detail.transFee)}}</span></Col>
          <Col span="2"><div>广告片(小样)</div></Col>
          <Col span="5">
            <span v-if='detail.srcFiledAddr != null' style='cursor: pointer;' @click='onViewVideo(detail.srcFiledAddr)'>查看</span>
            <span v-if='detail.srcFiledAddr == null' style='cursor: pointer;'>暂无</span>

          </Col>
        </Row>
        <Row>
          <Col span="2"><div>广告下载地址</div></Col>
          <Col span="10"><span>{{detail.srcFileUrl}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>活动ID</div></Col>
          <Col span="5"><span>{{detail.promotionId}}</span></Col>
          <Col span="2"><div>活动名称</div></Col>
          <Col span="5"><span>{{detail.promotionName}}</span></Col>
          <Col span="2"><div>活动类型</div></Col>
          <Col span="5"><span v-for='(its, index) in promotionTypeList' v-if='detail.promotionType == its.key'>{{its.text}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>活动价格</div></Col>
          <Col span="5"><span>{{formatNumber(detail.promotionPrice)}}</span></Col>
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
             <input v-if='$route.params.status == "1"' type="checkbox"  :checked='row.stypeSelected' @change='addReason( $event , row.ptypeCode , row.stypeCode , row.stypeName)'/>
             <input v-if='$route.params.status == "5"' type="checkbox"  :checked='row.stypeSelected' disabled />
           </template>
        </Table>
        <Row style='padding: 15px 0;'>审核未通过原因（勾选其他时）：</Row>
        <Row>
          <Input style="width:240px" type='textarea' :disabled='$route.params.status == "5"' :maxlength="120" v-model="dataForm.refuseReason"></Input>
        </Row>
        <Row> {{dataForm.refuseReason != null ? dataForm.refuseReason.length : 0}} / {{120 - (dataForm.refuseReason != null ? dataForm.refuseReason.length : 0)}}</Row>
        <Row style='padding: 15px 0;'>
          <Button  type="primary" @click="dataFormSubmit">提交</Button>
          <Button style='margin-left: 15px;' type="primary" @click="nextSubmit">提交并继续审核</Button>
        </Row>
        
      </Row>
      <div class='titop' v-if='showStatus'>批注</div>
      <Row  class='detail-content' v-if='showStatus'>
        <Row style='padding: 15px 0;'>仅公司内容运营人员使用:</Row>
        <Row>
          <Input style="width:240px" type='textarea' v-model="dataForm.annotationInfo"></Input>
        </Row>
        <Row style='padding: 15px 0;'>
          <Button  type="primary" @click="beizhuSubmit">提交</Button>
        </Row>
      </Row>
      <div v-if='showedit' class='titop'>转制</div>
      <Row v-if='showedit' >
        <Table :columns="columns" :data="attachments"
        border disabled-hover size="small" class="table">
          <template slot="spaction" slot-scope="{row}">
       <!--      <UploadButton v-auth="'advert.videos:upload-attachment'" style='margin-top:17px;' v-if='row.desc == null'  @success="onUploadSuccess($event, row.key)">上传</UploadButton> -->
            <a v-if='row.ifedit' @click="edit(0 , row.key)">录入下载链接</a>

            <a v-if='!row.ifedit' v-auth="'advert.videos:modify-attachment'" style='margin-top:17px;'  @click="edit(row.id, row )">编辑</a>&nbsp;&nbsp;&nbsp;
            <a v-if='!row.ifedit' v-auth="'advert.videos:delete-attachment'" style='margin-top:17px;' @click="del( row.id)">删除</a>
 
<!--             <a v-if="row.fileId != null" style='margin-top:17px;' class="operation" :href="row.fileUrl" :download="row.fileUrl">下载</a>&nbsp;&nbsp;&nbsp;
            <a v-auth="'advert.videos:delete-attachment'" style='margin-top:17px;' v-if="row.fileId != null"  @click="del( row.id)">删除</a> -->
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
    <DlgEdit  ref="addOrUpdate"  @refreshDataList="reloadSearch" v-if="addOrUpdateVisible" @done="dlgeditdone"/>
    <VideodlgEdit  ref="addOrUpdateVideo"  @refreshDataList="reloadSearch" v-if="addOrUpdateVisibleVideo" @done="dlgeditdone"/>
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
import { queryList ,
         queryItem ,
         sapproval ,
         dataFrom ,
         dels ,
         addvideo ,
         getVideoIds ,
         annotation } from '@/api/planfilm'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { slice , clean } from '@/fn/object'
import UploadButton, { SuccessEvent } from '@/components/UploadButton.vue'
import DlgEdit from './dlgEdit.vue'
import VideodlgEdit from './videodlgEdit.vue'
import { formatNumber } from '@/util/validateRules'


import { findIndex } from 'lodash'
import {confirm , warning , success, toast , info } from '@/ui/modal'



const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const timeFormatDate = 'YYYY-MM-DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

const defQuery = {
}

const dataForm = {
  refuseReason: '', // 审核拒绝原因
  agree: true, // 审核结果
  annotationInfo: '', // 批注
  fixedRefuseReasons: [] // 审核原因数组
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
    DlgEdit,
    VideodlgEdit
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
  promotionTypeList: any = []


  editOne: any = null

  // 查看图片
  viewerShow = false
  viewerImage = ''


  addOrUpdateVisible = false
  addOrUpdateVisibleVideo = false

  // 存储数据需要调用接口的参数列
  videoIdsList: any = {}
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
  // 不通过原因列表
  reasonName: any = []
  objreasonName: any = []

  fixedRefuseReasonsList: any = []

  columnsReason: any = []



  id = 0

  applyTime = ''

  // 审核
  dataForm: any = { ...dataForm }

  mounted() {
    this.reasonName = []
    this.dataForm.fixedRefuseReasons = []
    // 审核原因列表
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

  get formatNumber() {
        return formatNumber
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

  // get tableData() {
  //   const typeList = (this.typeList || []).map((it: any) => {
  //     return {
  //       ...it,
  //     }
  //   })
  //   return typeList
  // }

  // 转制附件列表展示
  columns = [
    // { title: '序号', key: 'sort', width: 80 , align: 'center' },
    // { title: '格式', key: 'text', width: 130 , align: 'center' },
    { title: '附件', key: 'name',  align: 'center',
      render: (hh: any, { row: { fileId , fileUrl , name } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = fileUrl == null ? '-' : fileUrl
        return <span class='datetime' v-html={html}></span>
        
        /* tslint:enable */
      }
    },
    {
      title: '上传时间',
      key: 'uploadTime',
      width: 150 ,
      align: 'center',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (row.uploadTime != null ) {
          const html = moment(row.uploadTime).format(timeFormatDate)
          return row.uploadTime == null ? <span class='datetime' v-html={'-'}></span> : <span class='datetime' v-html={html}></span>
        } else {
          return <span class='datetime' v-html={'-'}></span>
        }
        /* tslint:enable */
      }
    },
    { title: '上传人', key: 'uploadName', align: 'center', width: 150,
      render: (hh: any, { row: { uploadName , uploadEmail } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = uploadEmail + '【' + uploadName + '】'
        if (uploadEmail != null && uploadName != null) {
          return <span class='datetime' v-html={html}></span>
        } else if(uploadEmail == null) {
          return <span class='datetime' v-html={uploadName}></span>
        } else if(uploadName == null) {
          return <span class='datetime' v-html={uploadEmail}></span>
        } else if (uploadEmail == null && uploadName == null) {
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
      this.fixedRefuseReasonsList = res.data.fixedRefuseReasonsList
      this.dataForm.refuseReason = res.data.item.refuseReason
      this.promotionTypeList = res.data.promotionTypeList
      if (res.data.item.attachments.length == 0) {
        this.attachments = [
          {
            ifedit: true,
            uploadEmail: null,
            uploadName: null,
          }
        ]
      } else {
        this.attachments = res.data.item.attachments
      }
       // 附件
      // this.typeList = res.data.typeList.map((it: any) => {
      //   const key = it.key
      //   const typecode = this.detail.attachments.map((item: any) => {
      //     return item.typeCode
      //   })
      //   const index = typecode.indexOf(key)
      //   if (index != -1) {
      //     return {
      //       ...it,
      //       desc: this.detail.attachments[index]
      //     }
      //   } else {
      //     return {
      //       ...it
      //     }
      //   }
      // })


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
  edit(id: number , row: any ) {
    this.addOrUpdateVisible = true
    // !!id ? this.editOne = row : this.editOne
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id , row)
    })
  }

  onViewVideo(src: any) {
    this.addOrUpdateVisibleVideo = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdateVideo.init(src)
    })
  }

  // 添加原因列表
  addReason(e: any , ptypeCode: any , stypeCode: any , stypeName: any) {
    if (e.target.checked == true) {
      this.dataForm.fixedRefuseReasons.push({
        pCode: ptypeCode,
        sCode: stypeCode,
        stypeName,
      })
    } else {
      for (let i = 0; i < this.dataForm.fixedRefuseReasons.length; i++) {
        if (this.dataForm.fixedRefuseReasons[i].stypeName == stypeName) {
          this.dataForm.fixedRefuseReasons.splice(i, 1)
          break
        }
      }
    }
  }

  // 提交并继续审核
  async nextSubmit() {
    if ((this.dataForm.fixedRefuseReasons || []).map((it: any) => {
              return it.stypeName
            }).indexOf('其他') != -1 && (this.dataForm.refuseReason == '' || this.dataForm.refuseReason == null)) {
      info('请输入审核拒绝原因')
      return
    }
    const dataItem: any = JSON.parse((sessionStorage.getItem('info') as any))
    this.videoIdsList = {
      query: dataItem.query, // 广告片id或者名称
      companyId: dataItem.companyId, // 公司Id
      status: dataItem.status, // 状态
      translated: dataItem.translated, // 1：转制；2：未转制
      skip: dataItem.skip, // 跳过的记录数
      maxSize: dataItem.maxSize, // 最大返回数据量
    }

    const query: any = {
      refuseReason: this.dataForm.refuseReason ,
      agree: this.dataForm.fixedRefuseReasons.length == 0 ? true : false ,
      fixedRefuseReasons: (this.dataForm.fixedRefuseReasons || []).map((it: any) => {
        return {
          pCode: it.pCode,
          sCode: it.sCode,
        }
      })
    }


    // 如果没有videoIds存储值则代表没有请求过ids列表
    if (JSON.parse((sessionStorage.getItem('videoIds') as any)) == null ) {
      try {
        const res =  await getVideoIds (this.videoIdsList) // 请求1000的存储总量
        const videoIds = res.data.item || []
        if (videoIds.length > 1) {
          sessionStorage.setItem('videoIds', JSON.stringify(videoIds.slice(1))) // 存储总量-1
          const data =  await sapproval (this.$route.params.id, query)
          this.$router.push({ name : 'gg-film-detail' , params: {id: videoIds[1] , status: '1'} })
        } else {
           const resdata =  await sapproval (this.$route.params.id, query)
           setTimeout(() => {
              this.backList()
          }, 1000)
        }
      } catch (ex) {
        this.handleError(ex)
      }
    } else { // 如果有则是详情-详情页面
      const dataItemIds: any = JSON.parse((sessionStorage.getItem('videoIds') as any))
      if (dataItemIds.length > 1 && dataItemIds.length < 980) { // 判断剩余存储的数值是否超过存储总量
        sessionStorage.removeItem('videoIds') // 先清空原存值，在存新值
        sessionStorage.setItem('videoIds', JSON.stringify(dataItemIds.slice(1))) // 存储新值
         const res =  await sapproval (dataItemIds[0], query)
        this.$router.push({ name : 'gg-film-detail' , params: {id: dataItemIds[1] , status: '1'} })
      } else {
        const res =  await sapproval (this.$route.params.id, query)
        // toast('没有更多数据了')
                setTimeout(() => {
                        this.backList()
                    }, 1000)
      }
    }
  }
  // 提交审核拒绝原因
  async dataFormSubmit() {

    if ((this.dataForm.fixedRefuseReasons || []).map((it: any) => {
              return it.stypeName
            }).indexOf('其他') != -1 && (this.dataForm.refuseReason == '' || this.dataForm.refuseReason == null)) {
      info('请输入审核拒绝原因')
      return
    }
    const query: any = {
      refuseReason: this.dataForm.refuseReason ,
      agree: this.dataForm.fixedRefuseReasons.length == 0 ? true : false,
      fixedRefuseReasons: (this.dataForm.fixedRefuseReasons || []).map((it: any) => {
        return {
          pCode: it.pCode,
          sCode: it.sCode,
        }
      })
    }
    try {
      const res =  await sapproval (this.$route.params.id, query)
      this.$router.push({ name : 'gg-film' })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 提交批注
  async beizhuSubmit() {
    try {
      const res =  await annotation (this.$route.params.id , {annotationInfo : this.dataForm.annotationInfo})
      this.$router.push({ name : 'gg-film' })
    } catch (ex) {
      this.handleError(ex)
    }
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

  // 返回列表
  backList() {
      this.$router.push({ name: 'gg-film' })
  }

  @Watch('$route.parmas', { deep: true })

    watchParmas(val: any) {
        this.doSearch()
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
