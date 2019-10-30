<template>
  <div>
     <div class="base-mess">
       <h2 class="title">投放信息</h2>
       <ListPage
        :fetch="fetch"
        :filters="filters"
        :columns="columns"
        ref="listPage">
      </ListPage>
     </div>

     <div class="base-mess">
       <h2 class="title">资源方审核信息</h2>
       <Row>
          <Col :span="8"><p><label>影城系统人次</label><em>{{items.resourcePersonCount || '-'}}</em></p></Col>
        </Row>

        <Row>
          <Col :span="8"><p><label>影城金额/元</label><em>{{items.resourceAmount || '-'}}</em></p></Col>
        </Row>

        <Row>
          <Col :span="8"><p><label>影城系统截图</label>
          <ImagePreviewer
            v-for="(item, i) in (items.picturesUrl || [])"
            :key="i"
            :url="item"
            class="picture-url"
          />
            </p>
          </Col>
        </Row>
        
        <Row>
          <Col :span="8"><p><label>备注</label><em>{{items.resourceRemark || '-'}}</em></p></Col>
        </Row>
     </div>

     <div class="base-mess" v-if="audit">
        <h2 class="title">运营确认</h2>
         <Row>
          <Col :span="8"><p><label>系统账单人次</label><em>{{items.personCount || '-'}}</em></p></Col>
        </Row>
         <Row>
          <Col :span="8"><p><label>影城系统人次</label><em>{{items.resourcePersonCount}}</em></p></Col>
        </Row>
        <Row>
          <Col :span="8"><p><label>差异比例</label><em>{{items.proportion}} %</em></p></Col>
        </Row>
        <Form ref="form" :model="form" :label-width="100" label-position="left">
          <FormItem label="是否审核">
              <RadioGroup v-model="form.agree">
                <Radio :label="1" >确定通过</Radio>
                <Radio :label="0">确定不通过</Radio>
            </RadioGroup>
          </FormItem>
           <FormItem label="备注">
             <Input type="textarea" v-model="form.remark" :rows="6"/>
          </FormItem>
        </Form>
        <div class="footer-btn">
              <Button type="primary" :to="{name: 'finance-billmanage'}" class="btn">返回</Button>
              <Button type="primary" @click="editSubmit">提交</Button>
          </div>
     </div>
     <div class="base-mess logs" v-if="!audit">
       <h2 class="title">操作日志</h2>
        <p v-for="(item, index) in resourceBillLogs" :key="index">
          <span>{{item.createName}}</span>
          <span>{{item.createTime}}</span>
          <span>{{item.describe}}</span>
        </p>
        <div class="text-align" v-if="resourceBillLogs.length == 0"> 暂无日志</div>
      </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {detail, resourceBillDetail, sureAduit} from '@/api/financeBill'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import {intDate, toThousands} from '@/util/dealData'
import {formatNumber } from '@/util/validateRules'
import moment from 'moment'
const dateFormat = 'YYYY-MM-DD HH:mm:ss'
import ImagePreviewer from '@/components/imagePreviewer'

@Component({
  components: {
    ListPage,
    ImagePreviewer
  }
})


export default class Main extends ViewBase {
  @Prop({ type: Number}) id!: number
  @Prop({ type: Number, default: 0}) audit!: number

  // 审核
  form: any = {}

  // 操作日志
  resourceBillLogs: any[] = []
  items: any = {}

  filters: Filter[] = [
    {
      name: 'id',
      defaultValue: 0,
    },
    {
      name: 'pageIndex',
      defaultValue: 1
    },

    {
      name: 'pageSize',
      defaultValue: 20
    }
  ]

  columns = [
    { title: '广告片名称', key: 'videoName', minWidth: 90 },
    { title: '影片名称', key: 'movieName', minWidth: 90 },
    { title: '投放时长', key: 'specification', minWidth: 90 },
    { title: '执行开始时间', key: 'beginDate', minWidth: 90 },
    { title: '执行完成时间', key: 'endDate', minWidth: 90 },
    { title: '曝光场次', key: 'showCount', minWidth: 90 },
    { title: '曝光人次/人次', key: 'personCount', minWidth: 90 },
    { title: '单价/元/人次', key: 'unitPrice', minWidth: 90 },
    { title: '金额', key: 'amount', minWidth: 90 },
    { title: '监播文件', key: 'playMonitorStatus', minWidth: 90, enum: 'playMonitorStatusList' },
    { title: '是否需要结算', key: 'status', minWidth: 90, enum: 'statusList' },
    { title: '备注', key: 'remark', minWidth: 90 },
  ]

  mounted() {
    this.list()
  }

  async fetch(query: any) {
    const {data } = await resourceBillDetail(query)
    const item = (data.items || []).map((it: any) => {
      return {
        ...it,
        beginDate: intDate(it.beginDate),
        endDate: intDate(it.endDate),
        personCount: toThousands(it.personCount),
        amount: formatNumber(it.amount)
      }
    })
    return {
      ...data,
      items: item
    }
  }

  async list() {
    try {
      const { data: {item} } = await detail(this.id)
      this.resourceBillLogs = (item.resourceBillLogs || []).map((it: any) => {
        return {
          ...it,
          createTime: moment(it.createTime).format(dateFormat)
        }
      })
      this.items = item
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async editSubmit() {
    const agree = this.form.agree ? true : false
    try {
      const { data } = await sureAduit({
        ...this.form,
        agree,
        id: this.id,
      })
      this.$router.push({name: 'finance-billmanage'})
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>
<style lang='less' scoped>
@import '~@/views/data/person/less/common.less';
.picture-url {
  width: 150px;
  margin-right: 25px;
}
.list-page {
  margin-bottom: 0;
  min-height: auto;
  /deep/ .btn-reset {
    display: none;
  }
  .form {
    display: none;
  }
}
.footer-btn {
  text-align: center;
  .btn {
    margin-right: 15px;
  }
}
</style>