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
      width: 85,
      placeholder: '订单号'
    },
    // {
    //   name: 'brandName',
    //   defaultValue: '',
    //   type: 'input',
    //   width: 85,
    //   placeholder: '品牌名称待处理'
    // },
    // {
    //   name: 'companyName',
    //   defaultValue: '',
    //   type: 'input',
    //   width: 200,
    //   placeholder: '公司名称'
    // },
    // {
    //   name: 'dateRange',
    //   defaultValue: '',
    //   type: 'dateRange',
    //   width: 200,
    //   placeholder: '选择时间',
    //   dealParam(value: string) {
    //     const [applyStartTime, applyEndTime] = value ? value.split('-') : [null, null]
    //     return {
    //       applyStartTime,
    //       applyEndTime
    //     }
    //   }
    // }

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
    'brandRelationType'
  ]

  get columns() {
    return [
      { title: '序号', key: 'id', width: 65 },
      { title: '订单号', key: 'orderNo', width: 80 },
      // { title: '影院名称', key: 'companyName', minWidth: 120 },
      // { title: '专资编码', key: 'brandId', width: 80 },
      // { title: '所属影管', key: 'brandName', minWidth: 120 },
      // { title: '关联资源方', key: 'brandName', minWidth: 120 }
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
