<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
    <template slot="id" slot-scope="{ row: { id , status } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'order-beforeplan-detail', params: { id , status } }"
          >{{id}}</router-link>
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
import videoList from '../supervision/videoList.vue'
import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'


import {
  queryList
} from '@/api/beforeplan'
import EditDialog, { Field } from '@/components/editDialog'

const timeFormat = 'YYYY-MM-DD'


@Component({
  components: {
    ListPage,
    EditDialog
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  filters: Filter[] = [
    {
      name: 'companyName',
      defaultValue: null,
      type: CompanyList,
      width: 140,
      placeholder: '广告主公司名称'
    },

    {
      name: 'name',
      defaultValue: null,
      type: planList,
      width: 140,
      placeholder: '广告计划名称'
    },

    {
      name: 'videoName',
      defaultValue: null,
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

    // {
    //   name: 'ordername',
    //   defaultValue: '',
    //   type: 'date',
    //   width: 140,
    //   placeholder: '提交时间'
    // },

    {
      name: 'status',
      defaultValue: null,
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
      { title: '计划id', slot: 'id', width: 65 },
      { title: '计划名称', key: 'name', minWidth: 160 },
      { title: '广告主公司名称', key: 'companyName', width: 65 },
      { title: '广告片', key: 'videoName', minWidth: 160 },
      {
      title: '投放周期',
      key: 'beginDate',
      width: 150,
      align: 'center',
      render: (hh: any, { row: { beginDate , endDate} }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const start = moment(beginDate).format(timeFormat)
        const end = moment(endDate).format(timeFormat)
        return <span> {start} ~ {end}</span>
        /* tslint:enable */
      }
    },
      { title: '预算', key: 'budgetAmount', width: 100 },
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
