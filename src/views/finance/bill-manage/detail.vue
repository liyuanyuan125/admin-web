<template>
  <div>
     <div class="base-mess">
       <h2 class="title">投放信息</h2>
       <ListPage
        :fetch="fetch"
        :filters="filters"
        :enums="enums"
        :columns="columns"
        ref="listPage">
      </ListPage>
     </div>

     <div class="base-mess">
       <h2 class="title">资源方审核信息</h2>
       <Row>
          <Col :span="8"><p><label>影城系统人次</label><em>{{items.personCount || '-'}}</em></p></Col>
        </Row>
        <Row>
          <Col :span="8"><p><label>影城系统截图</label>
            <em class="imgs-list" v-for="(img, index) in (items.picturesUrl || [])" :key="index">
              <img src="" width="80px"/>
            </em>
            </p>
          </Col>
        </Row>
        <Row>
          <Col :span="8"><p><label>备注</label><em>{{items.remark || '-'}}</em></p></Col>
        </Row>
     </div>

     <div class="base-mess" v-if="audit">
        <h2 class="title">运营确认</h2>
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
import {detail, resourceBillDetail} from '@/api/financeBill'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import {intDate, toThousands} from '@/util/dealData'
import {formatNumber } from '@/util/validateRules'
import moment from 'moment'
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

@Component({
  components: {
    ListPage
  }
})


export default class Main extends ViewBase {
  @Prop({ type: Number}) id!: number
  @Prop({ type: Number, default: 0}) audit!: number

  // 操作日志
  resourceBillLogs: any[] = []
  items: any = {}

  // fetch = resourceBillDetail
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

  enums = [
    'statusList',
    'movieCustomList',
    'playMonitorStatusList'
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
    { title: '监播文件', key: 'playMonitorStatus', minWidth: 90, editor: 'enum' },
    { title: '是否需要结算', key: 'status', minWidth: 90, editor: 'enum' },
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
    this.items = item
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
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>
<style lang='less' scoped>
@import '~@/views/data/person/less/common.less';
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
.imgs-list {
  display: flex;
  img {
    margin: 10px 10px 0 0;
  }
}
</style>