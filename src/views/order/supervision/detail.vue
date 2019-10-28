<template>
    <div class='page'>
        <header>
            <Button icon="md-return-left" @click="backList" class="btn-back">返回列表</Button>
        </header>
        <div class='title'>基础信息</div>
        <div class='bos'>
            <Row>
                <Col :span='12'><span class='spons'>资源方公司&nbsp;：&nbsp;</span>{{listitem.resourceName == null ? '暂无资源方公司' : listitem.resourceName}}</Col>
                <Col :span='12'><span class='spons'>资源方影院名称&nbsp;：&nbsp;</span>【{{listitem.cinemaCode == null ? '暂无影院专资编码' : listitem.cinemaCode}}】 {{listitem.cinemaName == null ? '暂无影院名称' : listitem.cinemaName}}</Col>
            </Row>
            <Row>
                <Col :span='12'><span class='spons'>影片名称&nbsp;：&nbsp;</span>{{(listitem.movieName == null || listitem.movieName == '') ? '暂无影片名称' : listitem.movieName}}</Col>
                <Col :span='12'><span class='spons'>包含广告片&nbsp;：&nbsp;</span>共计{{listitem.totalLength}}s
                        <a style='margin-left: 5px;' v-for='(item) in listitem.videoDetails' :key='item.videoId'>
                            <em style='font-style: normal;font-right: -5px;' v-for='(its,index) in deliveryPositionList' :key='index' v-if='item.deliveryPosition != null && item.deliveryPosition == its.key'>【{{its.text}}】</em>
                            {{item.videoName}} ({{item.videoLength}})s
                        </a> 
                </Col>
            </Row>
            <Row>
                <Col :span='12'><span class='spons'>投放周期&nbsp;：&nbsp;</span>{{start}} ~ {{end}} &nbsp; 【{{day + 1}}天】</Col>
                <Col :span='12'><span class='spons'>上传渠道&nbsp;：&nbsp;</span>{{listitem.fileFrom == null ? '暂无' : listitem.fileFrom}}</Col>
            </Row>
        </div>
        <div class='title' v-if='listitem.approvalStatus == 2 || listitem.approvalStatus == 3  || listitem.approvalStatus == 4'>监播审核</div>
        <Row class='bos' v-if='listitem.approvalStatus == 2 || listitem.approvalStatus == 3  || listitem.approvalStatus == 4'>
            <Col :span='15'>
            <span v-if='listitem.fileUrl == null'>暂无监播文件</span>
            <video ref='videoplay' :style="{'transform': 'rotate(' + roteNum + 'deg)', 'width': roteTrue != true ? '350px' : '98%' }" v-if='listitem.fileUrl != null' :src='listitem.fileUrl' width='93%' height='60%' autobuffer controls="controls" type="video/mp4" ></video>
                <p v-if='listitem.fileUrl != null' style='margin-top: 3px;'>选择播放速率：
                    <Select v-model="videoplay.speed" placeholder="设置播放状态">
                      <Option v-for="it in videoplayList" :key="it.key" :value="it.key"
                          :label="it.text">{{it.text}}</Option>
                    </Select>
                    <Button @click='changeRote(1)' style='margin-right: 5%;' type='default' class='rote'>向左旋转</Button>
                    <Button @click='changeRote(0)' type='default' class='rote'>恢复</Button>
                    <Button @click='changeRote(2)' type='default' class='rote'>向右旋转</Button>
               </p>
            </Col>
            <Col :span='9'>
            <Row style='margin-top: -14px;font-size: 12px;'>通过监播视频选择未通过审核的广告片，并选择审核未通过的原因</Row>
            <Row style='margin-top: -18px;color: red;font-size: 12px;'>如未勾选，则表示该广告审核成功，正常财务结算</Row>
            <Row class='mainRow'>
                <Form style='margin-top: -18px;padding-left: 20px;' ref="dataForm" :model="dataForm" label-position="left" :label-width="80">
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" :disabled='listitem.approvalStatus == 4 || listitem.approvalStatus == 3' @click.prevent.native="handleCheckAll">全选</Checkbox>
                    <!-- <Checkbox v-if='listitem.approvalStatus == 4' :indeterminate="indeterminate" :value="checkAll" disabled >全选</Checkbox> -->
                    <FormItem label="" prop="closeReason">
                        <CheckboxGroup v-model="dataForm.orderIds">
                            <Checkbox v-for="(it) in listitem.videoDetails" :key="it.orderId" :value="it.orderId" :label="it.orderId" :disabled='listitem.approvalStatus == 4 || listitem.approvalStatus == 3'>
                                <em style='font-style: normal;font-right: -5px;' v-for='(its,index) in deliveryPositionList' :key='index' v-if='it.deliveryPosition != null && it.deliveryPosition == its.key'>【{{its.text}}】</em>
                              {{it.videoName}} ({{it.videoLength}})s
                            </Checkbox></br>
                        </CheckboxGroup>
                    </FormItem>
                </Form>
                <Form style='margin-top: -27px;padding-left: 20px;background: #eee;' v-if='dataForm.orderIds.length != 0' ref="dataForm" :model="dataForm" label-position="left" :label-width="80">
                    <Row>审核未通过的原因</Row>
                    <FormItem label="" prop="closeReason">
                        <CheckboxGroup v-model="dataForm.reasonOrderIds">
                            <Checkbox v-for="(it) in reason" :key="it.key" :value="it.key" :label="it.key" :disabled='listitem.approvalStatus == 4 || listitem.approvalStatus == 3'>{{it.text}} </Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <Row style='margin-top: -32px;' v-if='dataForm.reasonOrderIds.indexOf("9") != -1 '>审核未通过原因(勾选其他时):</Row>
                    <FormItem label="" prop="closeReason" v-if='dataForm.reasonOrderIds.indexOf("9") != -1 '>
                         <Input :maxlength="120" type='textarea' :disabled='listitem.approvalStatus == 4 || listitem.approvalStatus == 3' placeholder='勾选其他时请输入原因' v-model="dataForm.refuseReason"></Input>
                    </FormItem>
                </Form>
            </Row>
            <div v-if='listitem.approvalStatus == 2' class="dialog-footer">
                <Button type="primary" @click="dataFormSubmit">提交</Button>
                <Button type="primary" style='margin-left: 20px;' @click="nextSubmit">提交并继续审核</Button>
            </div>
            </Col>
        </Row>
        <!--     <div class='title' v-if='listitem.approvalStatus == 2'>审核</div>
    <div class='bos' v-if='listitem.approvalStatus == 2'>
       <Form ref="dataForm" :model="dataForm" label-position="left" :label-width="80">
      <FormItem label="审核意见" prop="closeReason">
        <RadioGroup v-model="statusform.status" >
          <Radio v-for="it in appList" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>
      <Row v-if='statusform.status == 1' style='margin-left: 80px;'>请勾选在监播中已出现的广告，如有未出现广告，请及时与资源方联系！<span style='color: red'>(审核通过后，未勾选的广告片将不参与到结算中，请谨慎操作)</span><br><Checkbox  :indeterminate="indeterminate" :value="checkAll"  @click.prevent.native="handleCheckAll">全选</Checkbox></Row>
      <FormItem v-if='statusform.status == 1' label="" prop="closeReason">
        <CheckboxGroup  v-model="dataForm.orderIds" >
          <Checkbox  v-for="(it,index) in listitem.videoDetails" :key="it.index" :value="it.orderId" :label="it.orderId">{{it.videoName}} ({{it.videoLength}})s</Checkbox >
        </CheckboxGroup >
      </FormItem>
      <FormItem v-if='statusform.status == 2' label="" prop="closeReason">
        <Input v-model='dataForm.closeReason' />
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" style='margin-left: 20px;' @click="change('dataForm')">确定</Button>
    </div>
    </div> -->
        <div v-if='listitem.approvalStatus != 2' class='title'>操作记录</div>
        <div class='bos' v-if='listitem.approvalStatus != 2 && logList.length != 0'>
            <p style='line-height: 25px;' v-for='(logit,index) in logList' :key='index'>
                {{logit.createTime}} {{logit.email}}【{{logit.userName}}】{{logit.description}}
            </p>
        </div>
        <div class='bos' v-if='listitem.approvalStatus != 2 && logList.length == 0'>
            暂无操作日志
        </div>
    </div>
</template>
<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { warning, success, toast, info } from '@/ui/modal'
import { slice, clean } from '@/fn/object'
import {
    queryList,
    itemlist,
    okpass,
    refuse,
    monitorsIds,
    approve,
    reset
} from '@/api/supervision'
import EditDialog, { Field } from '@/components/editDialog'
import Decimal from 'decimal.js'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'



@Component({
    components: {}
})
export default class Main extends ViewBase {
    dataForm: any = {
        closeReason: '',
        orderIds: [],
        reasonOrderIds: [],
        refuseReason: ''
    }


    statusform = {
        status: 1,
    }

    roteNum: any = 0
    roteTrue: any = true

    videoplayList: any = [
      {
        key: 0.5,
        text: '0.5'
      },
      {
        key: 1,
        text: '1'
      },
      {
        key: 1.25,
        text: '1.25'
      },
      {
        key: 1.5,
        text: '1.5'
      },
      {
        key: 2,
        text: '2'
      }
    ]

    videoplay = {
      speed: 1,
    }


    listitem: any = []
    logList: any = []
    checkAll: any = false
    indeterminate: any = true

    // 投放排期
    start: any = ''
    end: any = ''
    day: any = null

    appList: any = [{
            key: 1,
            text: '通过'
        },
        {
            key: 2,
            text: '拒绝'
        }
    ]
    // 广告片位置
    deliveryPositionList: any = []

    reason: any = []

    // 存储数据需要调用接口的参数列
    videoIdsList: any = {}



    mounted() {
        this.search()
    }

    // 返回上一页
    back() {
        this.$router.go(-1)
    }
    // 返回列表
    backList() {
        this.$router.push({ name: 'order-supervision' })
    }

    // 审核取消按钮
    cancel() {
        this.statusform.status = 1
    }

    changeRote(num: any) {
      // 角度恢复
      if (num == 0) {
        this.roteNum = 0
        if (String(new Decimal(this.roteNum).div(360)).indexOf('.') == -1) {
          this.roteTrue = true
        } else {
          this.roteTrue = false
        }
      }
      // 向左旋转
      if (num == 1) {
        this.roteNum = new Decimal(this.roteNum).plus(90)
        if (String(new Decimal(this.roteNum).div(360)).indexOf('.') == -1) {
          this.roteTrue = true
        } else {
          this.roteTrue = false
        }
      }
      // 向右旋转
      if (num == 2) {
        this.roteNum = new Decimal(this.roteNum).plus(-90)
        if (String(new Decimal(this.roteNum).div(360)).indexOf('.') == -1) {
          this.roteTrue = true
        } else {
          this.roteTrue = false
        }
      }
    }


    // 提交并继续审核
    async nextSubmit() {
        if (this.dataForm.orderIds.length != 0) {
            if (this.dataForm.reasonOrderIds.length == 0) {
                info('请选择未通过原因')
                return
            } else if (this.dataForm.reasonOrderIds.indexOf('9') != -1) {
                if (this.dataForm.refuseReason == '') {
                    info('请输入拒绝原因')
                    return
                }
            }
        }
        const dataItem: any = JSON.parse((sessionStorage.getItem('supinfo') as any))
        this.videoIdsList = {
            query: dataItem.query, // 广告片id或者名称
            companyId: dataItem.companyId, // 公司Id
            movieName: dataItem.movieName,
            businessDirector: dataItem.businessDirector,
            approvalUserName: dataItem.approvalUserName,
            cinemaId: dataItem.cinemaId,
            videoId: dataItem.videoId,
            beginDate: dataItem.dateRange ? dataItem.dateRange.split('-')[0] : null,
            endDate: dataItem.dateRange ? dataItem.dateRange.split('-')[1] : null,
            approvalBeginTime: dataItem.dateRang3e ? Number(new Date(String(dataItem.dateRang3e.split('-')[0])
            .slice(0, 4) + '-' + String(dataItem.dateRang3e.split('-')[0]).slice(4, 6) + '-' +
                        String(dataItem.dateRang3e.split('-')[0]).slice(6, 8)).getTime() -
                        (8 * 60 * 60 * 1000)) : null,
            approvalEndTime: dataItem.dateRang3e ? Number(new Date(String(dataItem.dateRang3e.split('-')[1])
            .slice(0, 4) + '-' + String(dataItem.dateRang3e.split('-')[1]).slice(4, 6) + '-' +
                        String(dataItem.dateRang3e.split('-')[1]).slice(6, 8)).getTime() +
                        (16 * 60 * 60 * 1000 - 1)) : null,
            status: dataItem.status, // 状态
            translated: dataItem.translated, // 1：转制；2：未转制
            skip: dataItem.skip, // 跳过的记录数
            maxSize: dataItem.maxSize, // 最大返回数据量
            code: dataItem.code,
            uploadBeginTime: dataItem.dateRange2 ? Number(new Date(String(dataItem.dateRange2.split('-')[0])
            .slice(0, 4) + '-' + String(dataItem.dateRange2.split('-')[0]).slice(4, 6) + '-' +
                        String(dataItem.dateRange2.split('-')[0]).slice(6, 8)).getTime() -
                        (8 * 60 * 60 * 1000)) : null,
            uploadEndTime: dataItem.dateRange2 ? Number(new Date(String(dataItem.dateRange2.split('-')[1])
            .slice(0, 4) + '-' + String(dataItem.dateRange2.split('-')[1]).slice(4, 6) + '-' +
                        String(dataItem.dateRange2.split('-')[1]).slice(6, 8)).getTime() +
                        (16 * 60 * 60 * 1000 - 1)) : null,
        }
        // 如果没有videoIds存储值则代表没有请求过ids列表
        if (JSON.parse((sessionStorage.getItem('videoIds') as any)) == null) {
            try {
                const res = await monitorsIds(this.videoIdsList) // 请求500的存储总量
                const videoIds = res.data.item || []
                if (videoIds.length > 1) {
                    sessionStorage.setItem('videoIds', JSON.stringify(videoIds.slice(1))) // 存储总量-1
                    const aaa = await approve(this.$route.params.id,
                        { orderIds: this.dataForm.orderIds, fixRefuses: this.dataForm.reasonOrderIds ,
                          refuseReason: this.dataForm.refuseReason})
                    this.$router.push({ name: 'order-supervision-detail', params: { id: videoIds[1] } })
                } else { // 如果ids列表没有了数据则直接返回列表
                    const aaa = await approve(this.$route.params.id,
                        { orderIds: this.dataForm.orderIds, fixRefuses: this.dataForm.reasonOrderIds ,
                          refuseReason: this.dataForm.refuseReason})
                    // toast('没有更多数据了')
                    setTimeout(() => {
                        this.backList()
                    }, 1000)
                }
            } catch (ex) {
                this.handleError(ex)
            }
        } else { // 如果有则是详情-详情页面
            const dataItemIds: any = JSON.parse((sessionStorage.getItem('videoIds') as any))
            if (dataItemIds.length > 1 && dataItemIds.length < 700) { // 判断剩余存储的数值是否超过存储总量
                sessionStorage.removeItem('videoIds') // 先清空原存值，在存新值
                sessionStorage.setItem('videoIds', JSON.stringify(dataItemIds.slice(1))) // 存储新值
                const aaa = await approve(dataItemIds[0],
                    { orderIds: this.dataForm.orderIds, fixRefuses: this.dataForm.reasonOrderIds ,
                      refuseReason: this.dataForm.refuseReason})
                this.$router.push({ name: 'order-supervision-detail', params: { id: dataItemIds[1] } })
            } else { // 如果ids列表没有了数据则直接返回列表
                const aaa = await approve(this.$route.params.id,
                    { orderIds: this.dataForm.orderIds, fixRefuses: this.dataForm.reasonOrderIds ,
                      refuseReason: this.dataForm.refuseReason})
                // toast('没有更多数据了')
                setTimeout(() => {
                        this.backList()
                    }, 1000)
            }
        }
    }

    // 提交审核拒绝原因
    async dataFormSubmit() {
        if (this.dataForm.orderIds.length != 0) {
            if (this.dataForm.reasonOrderIds.length == 0) {
                info('请选择未通过原因')
                return
            } else if (this.dataForm.reasonOrderIds.indexOf('9') != -1) {
                if (this.dataForm.refuseReason == '') {
                    info('请输入拒绝原因')
                    return
                }
            }
        }
        const aaa = await approve(this.$route.params.id,
            { orderIds: this.dataForm.orderIds, fixRefuses: this.dataForm.reasonOrderIds ,
              refuseReason: this.dataForm.refuseReason})

        this.back()

    }

    async search() {
        (this.$Spin as any).show()
        try {
            const { data } = await itemlist(this.$route.params.id)
            this.listitem = data.item
            this.deliveryPositionList = data.deliveryPositionList
            // this.prelist = prelist
            const a = String(this.listitem.beginDate)
            const b = String(this.listitem.endDate)
            this.start = a.slice(0, 4) + '-' + a.slice(4, 6) + '-' + a.slice(6, 8)
            this.end = b.slice(0, 4) + '-' + b.slice(4, 6) + '-' + b.slice(6, 8)
            this.day = ((new Date(this.end).getTime() + 16 * 60 * 60 * 1000 - 1) -
                (new Date(this.start).getTime() + 16 * 60 * 60 * 1000 - 1)) / (24 * 60 * 60 * 1000)
            this.logList = (data.logList || []).map((it: any) => {
                return {
                    ...it,
                    createTime: moment(it.createTime).format(timeFormat)
                }
            })
            this.reason = data.fixRefusesList
            if (this.listitem.approvalStatus == 4) {
              this.dataForm.refuseReason = this.listitem.refuseReason
                this.dataForm.reasonOrderIds = this.listitem.fixRefuses
                this.dataForm.orderIds = (this.listitem.videoDetails || []).map((it: any) => {
                    if (it.orderStatus == 2) {
                        return it.orderId
                    }
                })
            }
            setTimeout(() => {
                (this.$Spin as any).hide()
            }, 1000)
        } catch (ex) {
            (this.$Spin as any).hide()
            // this.handleError(ex)
        } finally {}
    }

    handleCheckAll() {
        if (this.indeterminate) {
            this.checkAll = false
        } else {
            this.checkAll = !this.checkAll
        }
        this.indeterminate = false

        if (this.checkAll) {
            this.dataForm.orderIds = (this.listitem.videoDetails || []).map((it: any) => {
                return it.orderId
            })
        } else {
            this.dataForm.orderIds = []
        }
    }

    @Watch('$route.parmas', { deep: true })

    watchParmas(val: any) {
        this.search()
    }

    @Watch('videoplay', { deep: true })

    watchVideoplay(val: any) {
      // alert(val.speed)
      (this.$refs.videoplay as any).playbackRate = val.speed
    }
}
</script>
<style lang="less" scoped>
@import '../../../site/lib.less';

.page {
  line-height: 40px;
  font-size: 14px;
}

.header {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;

  em,
  i {
    font-style: normal;
    margin-right: 3px;
  }

  em {
    font-size: 16px;
    color: @c-base;
  }
}

.title {
  font-size: 16px;
  color: @c-base;
  line-height: 50px;
}

.bos {
  border: 1px solid #ccc;
  padding: 15px;
  /deep/ .ivu-select {
    width: 20%;
  }
}

.row-li {
  line-height: 40px;
  font-size: 14px;
}

.spons {
  display: inline-block;
  width: 120px;
  text-align: left;
}

.mainRow {
  overflow-y: auto;
  padding: 4px;
  height: 320px;

  &&::-webkit-scrollbar {
    display: none;
  }
}
.rote {
  display: inline-block;
  text-align: center;
  float: right;
  margin-top: 5px;
  margin-right: 1%;
}

/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
}

/deep/ .ivu-form-item-content {
  margin-left: 0 !important;
  line-height: 26px !important;
}

/deep/ video {
  height: 350px;
}

/deep/ .ivu-checkbox-group-item {
  width: 100%;
}
/deep/ textarea {
  min-height: 80px;
  max-height: 80px;
}
/deep/ .ivu-input {
  width: 95%;
  height: 50px;
}
</style>