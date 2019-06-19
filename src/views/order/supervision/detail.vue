<template>
  <div class='page'>
    <header>
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
    </header>
    <div class='title'>基础信息</div>
    <div class='bos'>
      <Row>
        <Col :span='12'>资源方公司&nbsp;：&nbsp;{{listitem.companyName == null ? '暂无' : listitem.companyName}}</Col>        
      </Row>
      <Row>      
        <Col :span='12'>影院名称&nbsp;：&nbsp;【{{listitem.cinemaCode == null ? '暂无影院专资编码' : listitem.cinemaCode}}】 {{listitem.cinemaName == null ? '暂无影院名称' : listitem.cinemaName}}</Col>
      </Row>
      <Row>
        <Col :span='12'>投放周期&nbsp;：&nbsp;{{start}} ~ {{end}} &nbsp; 【{{day + 1}}天】</Col>
      </Row>
      <Row>
        包含广告片&nbsp;：&nbsp;共计{{listitem.totalLength}}s
        <a style='margin-left: 5px;' v-for='(item,index) in listitem.videoDetails' :key='index'>{{item.videoName}} ({{item.videoLength}})s</a>  
      </Row>
    </div>
    <div class='title'>监播文件</div>
    <div class='bos'>
      <span v-if='listitem.fileUrl == null'>暂无监播文件</span>
      <video v-if='listitem.fileUrl != null'  :src='listitem.fileUrl' width='100%' height='50%' controls="controls"></video>
    </div>
    <div class='title' v-if='listitem.approvalStatus == 2'>审核</div>
    <div class='bos' v-if='listitem.approvalStatus == 2'>
       <Form ref="dataForm" :model="dataForm" label-position="left" :label-width="80">
      <!-- <video src="" width='100%' height='50%' controls="controls"></video> -->
      <FormItem label="审核意见" prop="closeReason">
        <RadioGroup v-model="statusform.status" >
          <Radio v-for="it in appList" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>
      <Row v-if='statusform.status == 1' style='margin-left: 80px;'>请勾选在监播中已出现的广告，如有未出现广告，请及时与资源方联系！<br><Checkbox  :indeterminate="indeterminate" :value="checkAll"  @click.prevent.native="handleCheckAll">全选</Checkbox></Row>
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
    </div>
    <div class='title'>操作记录</div>
    <div class='bos' v-if='logList.length != 0'>
      <Row>2018-10-01 11:22:22 zhiping.zhao@aiads.com【老麦】审核通过</Row>
      <Row>2018-10-01 11:22:22 zhiping.zhao@aiads.com【老麦】审核通过</Row>
      <Row>2018-10-01 11:22:22 zhiping.zhao@aiads.com【老麦】审核通过</Row>
    </div>
    <div class='bos' v-if='logList.length == 0'>
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
import { warning , success, toast , info } from '@/ui/modal'
import { slice , clean } from '@/fn/object'
import {
  queryList,
  itemlist,
  okpass,
  refuse
} from '@/api/supervision'
import EditDialog, { Field } from '@/components/editDialog'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'



@Component({
  components: {
  }
})
export default class Main extends ViewBase {
  dataForm = {
    closeReason: '',
    orderIds: []
  }


  statusform =  {
    status: 1,
  }


  listitem: any = []
  logList: any = []
  checkAll: any = false
  indeterminate: any = true

  // 投放排期
  start: any = ''
  end: any = ''
  day: any = null

  appList: any = [
    {
      key: 1,
      text: '通过'
    },
    {
      key: 2,
      text: '拒绝'
    }
  ]



  mounted() {
    this.search()
  }

  // 返回上一页
  back() {
    this.$router.go(-1)
  }

  // 审核取消按钮
  cancel() {
    this.statusform.status = 1
  }

  // 审核确定按钮
  change(dataForms: any) {
    const myThis: any = this
    myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        if (this.statusform.status == 1) {
          try {
            const res =  await okpass (this.$route.params.id , {orderIds : this.dataForm.orderIds})
            this.$router.push({ name : 'order-supervision' })
          } catch (ex) {
            this.handleError(ex)
          }
        } else if (this.statusform.status == 2) {
          try {
            const res =  await refuse (this.$route.params.id , {closeReason : this.dataForm.closeReason})
            this.$router.push({ name : 'order-supervision' })
          } catch (ex) {
            this.handleError(ex)
          }
        }
      }
    })
  }

  async search() {
     try {
      const { data } = await itemlist(this.$route.params.id )
      this.listitem = data.item
      // this.prelist = prelist
      const a = String(this.listitem.beginDate)
      const b = String(this.listitem.endDate)
      this.start = a.slice(0 , 4) + '-' + a.slice(4 , 6) + '-' + a.slice(6 , 8)
      this.end = b.slice(0 , 4) + '-' + b.slice(4 , 6) + '-' + b.slice(6 , 8)
      this.day = ((new Date(this.end).getTime() + 16 * 60 * 60 * 1000 - 1) -
        (new Date(this.start).getTime() + 16 * 60 * 60 * 1000 - 1)) / (24 * 60 * 60 * 1000)
      this.logList = data.logList
    } catch (ex) {
      // this.handleError(ex)
    } finally {
    }
  }

  handleCheckAll() {
    if (this.indeterminate) {
        this.checkAll = false
    } else {
        this.checkAll = !this.checkAll
    }
    this.indeterminate = false

    if (this.checkAll) {
        this.dataForm.orderIds = (this.listitem.videoDetails || []).map((it: any ) => {
          return it.orderId
        })
    } else {
        this.dataForm.orderIds = []
    }
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
  em, i {
    font-style: normal;
    margin-right: 6px;
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
}
.row-li {
  line-height: 40px;
  font-size: 14px;
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
}
</style>
