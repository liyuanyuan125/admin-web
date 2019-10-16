<template>
  <div class="index-page" :key="auditStatusCode">
    <Tabs v-model="auditStatusCode" type="card" class="tabs">
      <TabPane v-for="it in auditStatusList" :key="it.value" :name="it.value" :label="it.name" />
    </Tabs>

    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage">

      <template slot="action" slot-scope="{ row: { id , status, auditStatus  } }">
        <div class="row-acts">
          <router-link
          v-if="auditStatus === 1"
            :to="{ name: 'order-beforeplanAudit-detail', params: { id , status, ifs: '1' } }"
          >审核</router-link>
          <router-link
          v-if="auditStatus !== 1"
            :to="{ name: 'order-beforeplanAudit-detail', params: { id , status, ifs: '0' } }"
          >查看</router-link>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from './data'
import { alert, toast } from '@/ui/modal'
import jsxReactToVue from '@/util/jsxReactToVue'
// 广告主公司名称列表
import CompanyList from './files/adscompany-audit-list.vue'
// 广告片名称列表
import videoList from './files/videoList.vue'

const auditStatusListLocal = [
  { name: '待审核', value: '1' },
  { name: '审核通过', value: '2' },
  { name: '审核未通过', value: '3' },
  { name: '审核失败', value: '4' }
]

const defaultAuditStatusCode = auditStatusListLocal[0].value

@Component({
  components: {
    ListPage
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: String, default: defaultAuditStatusCode }) status!: string

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  auditStatusCode = '1'
  auditStatusList = auditStatusListLocal

  fetch = queryList

  get filters(): Filter[] {
    return [
      {
        name: 'auditStatus',
        defaultValue: this.auditStatusCode
      },

      {
        name: 'id',
        defaultValue: '',
        type: 'input',
        width: 140,
        placeholder: '广告计划ID'
      },

      {
        name: 'companyId',
        defaultValue: 0,
        type: CompanyList,
        width: 140,
        placeholder: '广告主公司名称'
      },

      {
        name: 'name',
        defaultValue: '',
        type: 'input',
        width: 140,
        placeholder: '广告计划名称'
      },

      {
        name: 'advertTypeCode',
        defaultValue: null,
        type: 'select',
        width: 100,
        placeholder: '广告类型',
        enumKey: 'advertTypeList'
      },

      {
        name: 'channelCode',
        defaultValue: 0,
        width: 100,
        placeholder: '渠道',
        select: {
          enumKey: 'channelList',
        },
      },

      {
        name: 'dateRange',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '选择时间',
        dealParam(value: string) {
          const [beginDate, endDate] = value ? value.split('-') : [null, null]
          return {
            beginDate,
            endDate
          }
        }
      },

      {
        name: 'planApplyDate',
        defaultValue: '',
        type: 'date',
        width: 140,
        placeholder: '计划提交时间'
      },

      {
        name: 'auditApplyDate',
        defaultValue: '',
        type: 'date',
        width: 140,
        placeholder: '提交审核时间'
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
  }

  enums = []

  get columns() {
    return [
      { title: '计划id', key: 'id', width: 65 },
      { title: '计划名称', key: 'name' },
      { title: '广告主公司名称', key: 'companyName'},
      { title: '广告片', key: 'videoName', maxWidth: 100 },
      { title: '广告类型', key: 'advertTypeCode', maxWidth: 100, editor: 'deprecated' },
      { title: '渠道', key: 'channelCode', maxWidth: 100,  editor: 'deprecated' },
      { title: '派单影院数量', key: 'cinemaCount', maxWidth: 100 },
      { title: '折扣', key: 'discount', maxWidth: 100 },
      { title: '定金', key: 'depositAmount', width: 100},
      { title: '计划提交时间', key: 'planApplyTime', width: 135, dateTime: true },
      { title: '提交审核时间', key: 'auditApplyTime', width: 135, dateTime: true },
      { title: '审批状态', key: 'auditStatus', width: 100 , enum: true },
      { title: '操作', slot: 'action', width: 70 }
    ] as ColumnExtra[]
  }

  refresh() {
    this.listPage.update()
  }

  @Watch('auditStatusCode')
  watchChannelCode(val: string) {
    this.$router.push({
      name: 'order-beforeplanaudit',
      params: val == defaultAuditStatusCode ? {} : { val }
    })
  }

  @Watch('status')
  watchChannel(val: string) {
    this.listPage.query.auditStatus = val
  }
}
</script>

<style lang="less" scoped>
.button-crawl {
  margin-left: 12px;
}

.price-table {
  margin: 4px 0;
  /deep/ th,
  /deep/ td {
    height: 24px;
    background-color: #fff !important;
  }
}
</style>
