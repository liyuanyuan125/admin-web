<template>
  <div class="brand-page">
    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage" v-if="isAlive">
    </ListPage>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import jsxReactToVue from '@/util/jsxReactToVue'
import { queryList } from '@/api/refundOrder'
import { formatConversion } from '@/util/validateRules'
import { cloneDeep } from 'lodash'
import { confirm, info } from '@/ui/modal.ts'
import moment from 'moment'
import { startDayTimestamp, endDayTimestamp } from '@/util/dealData'

@Component({
  components: {
    ListPage
  }
})
export default class Main extends ViewBase {
  moment = moment
  isAlive = true
  loading = false

  fetch = queryList
  filters: Filter[] = [
    {
      name: 'planId',
      defaultValue: '',
      input: true,
      width: 178,
      placeholder: '广告计划单编号'
    },

    {
      name: 'applyTime',
      defaultValue: '',
      dateRange: true,
      width: 178,
      placeholder: '退款创建日期区间',
      dealParam(value: string) {
        const [queryStartTime, queryEndTime] = value ? value.split('-') : [null, null]
        return {
          queryStartTime,
          queryEndTime
        }
      }
    },

    {
      name: 'refundBusType',
      defaultValue: 0,
      select: {
        enumKey: 'refundBusTypeList',
      },
      width: 128,
      placeholder: '业务类型'
    },

    {
      name: 'refundPayType',
      defaultValue: 0,
      select: {
        enumKey: 'refundPayTypeList',
      },
      width: 128,
      placeholder: '支付方式'
    },

    {
      name: 'refundNumber',
      defaultValue: '',
      input: true,
      width: 188,
      placeholder: '支付流水'
    },

    {
      name: 'refundNo',
      defaultValue: '',
      input: true,
      width: 188,
      placeholder: '退款单'
    },

    {
      name: 'refundStatus',
      defaultValue: 0,
      select: {
        enumKey: 'refundStatusList',
      },
      width: 128,
      placeholder: '退款状态'
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

  enums = []

  get columns() {
    return [
      { title: '序号', key: 'id', width: 65 },
      { title: '广告计划单编号', key: 'planId', minWidth: 120 },
      { title: '支付流水', key: 'refundNumber', minWidth: 120 },
      { title: '退款单', key: 'refundNo', width: 120 },
      { title: '支付方式', key: 'refundPayType', width: 60, enum: true },
      { title: '退款方式', key: 'refundType', width: 70, enum: true },
      { title: '退款金额', key: 'refundAmount', minWidth: 120 },
      { title: '业务类型', key: 'refundBusType', width: 80, enum: true },
      { title: '退款原因', key: 'refundReason', minWidth: 120, enumKey: 'refundTypeList' },
      { title: '退款状态', key: 'refundStatus', width: 80, enum: true },
      { title: '退款创建时间', key: 'createTime', minWidth: 130, dateTime: true },
      { title: '退款完成时间', key: 'finishTime', minWidth: 130, dateTime: true }
    ] as ColumnExtra[]
  }
}
</script>

<style lang="less" scoped>
.companies:only-child:empty::before {
  content: '-';
}

.approve-radio {
  margin: 15px 0;
}

.label-dese {
  display: block;
  width: 40px;
}

.tips-box {
  padding: 15px;
  color: red;
}
</style>
