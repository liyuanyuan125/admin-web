<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
      <template slot="budgetAmount" slot-scope="{ row: { budgetAmount   } }">
        <div class="row-acts">
          <Number :addNum='budgetAmount' />
        </div>
      </template>
      <template slot="action" slot-scope="{ row: { id , status  } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'order-beforeplan-detail', params: { id , status } }"
          >详情</router-link>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import planList from './filename.vue'
import CompanyList from './fileplan.vue'
import videoList from './videoList.vue'
import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'
import Number from '@/components/number.vue'


import {
  queryList
} from '@/api/beforeplan'
import EditDialog, { Field } from '@/components/editDialog'

const timeFormat = 'YYYY-MM-DD'


@Component({
  components: {
    ListPage,
    EditDialog,
    Number
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  filters: Filter[] = [
    {
      name: 'companyName',
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
      name: 'videoName',
      defaultValue: '',
      type: videoList,
      width: 140,
      placeholder: '广告片名称'
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
      name: 'applyDate',
      defaultValue: '',
      type: 'date',
      width: 140,
      placeholder: '提交时间'
    },

    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '订单状态',
      enumKey: 'statusList'
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
  ]

  get columns() {
    return [
      { title: '计划id', key: 'id', width: 65 },
      { title: '计划名称', key: 'name', minWidth: 160 },
      { title: '广告主公司名称', key: 'companyName'},
      { title: '广告片', key: 'videoName', minWidth: 160 },
      {
        title: '投放周期',
        key: 'beginDate',
        width: 150,
        align: 'center',
        render: (hh: any, { row: { beginDate , endDate} }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const start = String(beginDate).slice(0, 4) + '-' + String(beginDate).slice(4, 6) + '-' + String(beginDate).slice(6, 8)
          const end = String(endDate).slice(0, 4) + '-' + String(endDate).slice(4, 6) + '-' + String(endDate).slice(6, 8)
          return <span> {start} ~ {end}</span>
          /* tslint:enable */
        }
      },
      { title: '预算', slot: 'budgetAmount', width: 100},
      { title: '提交时间', key: 'applyTime', editor: 'dateTime', width: 135 },
      { title: '状态', key: 'status', width: 100 , editor: 'enum' },
      { title: '操作', slot: 'action', width: 55 }
    ] as ColumnExtra[]
  }

  editShow() {
    this.$router.push({ name: 'client-film-edit'})
  }

  mounted() {
  }


  @Watch('$route')
  watch$route(val: any) {
    // console.log(val.fullPath)
  }

}
</script>

<style lang="less" scoped>
</style>
