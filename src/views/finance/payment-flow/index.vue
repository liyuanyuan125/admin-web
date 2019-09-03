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
import { queryList } from '@/api/paymentflow'
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
      placeholder: '支付创建日期区间',
      dealParam(value: any) {
        const [start, end] = value.split('-')
        return {
          applyStartTime: startDayTimestamp(start),
          applyEndTime: endDayTimestamp(end),
        }
      }
    },

    {
      name: 'busType',
      defaultValue: 0,
      select: {
        enumKey: 'busTypeList',
      },
      width: 128,
      placeholder: '业务类型'
    },

    {
      name: 'payTypeList',
      defaultValue: 0,
      select: {
        enumKey: 'payStatusList',
      },
      width: 128,
      placeholder: '支付方式'
    },

    {
      name: 'payNumber',
      defaultValue: '',
      input: true,
      width: 188,
      placeholder: '支付流水'
    },

    {
      name: 'orderNo',
      defaultValue: '',
      input: true,
      width: 188,
      placeholder: '订单号'
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
      { title: '广告计划单编号', key: 'planId', width: 120 },
      { title: '订单号', key: 'orderNo', minWidth: 120 },
      { title: '支付流水', key: 'payNumber', width: 120 },
      { title: '支付方式', key: 'payType', minWidth: 120, enum: true },
      { title: '支付金额', key: 'payAmount', minWidth: 120 },
      { title: '渠道', key: 'payChannel', minWidth: 120, enum: true },
      { title: '业务类型', key: 'busType', minWidth: 120, enum: true },
      { title: '支付状态', key: 'payStatus', minWidth: 120, enum: true },
      { title: '支付创建时间', key: 'createTime', minWidth: 120, dateTime: true },
      { title: '支付完成时间', key: 'finishTime', minWidth: 120, dateTime: true }
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
