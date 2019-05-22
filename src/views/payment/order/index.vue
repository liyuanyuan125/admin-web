<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'payment-order-edit', params: { edit: 'detail', id } }"
          >详情</router-link>
          <router-link
            :to="{ name: 'payment-order-edit', params: { edit: 'detail', id } }"
          >首款</router-link>
          <router-link
            :to="{ name: 'payment-order-edit', params: { edit: 'last', id } }"
          >尾款</router-link>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from '@/api/clientFilm'
import EditDialog, { Field } from '@/components/editDialog'
import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'
@Component({
  components: {
    ListPage,
    EditDialog,
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  filters: Filter[] = [
    {
      name: 'email',
      defaultValue: '',
      type: 'input',
      width: 140,
      placeholder: 'KOL名称'
    },

    {
      name: 'payNumber',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '订单管理',
    },

    {
      name: 'paySonNumber',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '子订单编号',
    },

    {
      name: 'status0',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: 'KOL平台',
      enumKey: 'statusList'
    },

    {
      name: 'status3',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '付款状态',
      enumKey: 'statusList'
    },

    {
      name: 'status4',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '发票状态',
      enumKey: 'statusList'
    },

    {
      name: 'dateRange',
      defaultValue: '',
      type: 'dateRange',
      width: 200,
      placeholder: '推广日',
      dealParam(value: string) {
        const [startDate, endDate] = value ? value.split('-') : [null, null]
        return {
          startDate,
          endDate
        }
      }
    },

    {
      name: 'creatTime',
      defaultValue: '',
      type: 'dateRange',
      width: 200,
      placeholder: '订单创建时间',
      dealParam(value: string) {
        const [startDate, endDate] = value ? value.split('-') : [null, null]
        return {
          startDate,
          endDate
        }
      }
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
      { title: '订单编号', key: 'id', width: 65 },
      { title: '子订单编号', key: 'applyEmail', width: 100 },
      { title: 'KOL编号', key: 'companyName', minWidth: 120 },
      { title: 'KOL名称', key: 'movieName', minWidth: 80 },
      { title: '平台', key: 'applyTime', width: 85 },
      { title: '订单创建时间', key: 'operationTime', editor: 'dateTime', width: 100 },
      { title: '推广时间', key: 'operationTime', editor: 'dateTime', width: 100 },
      { title: '子订单金额', key: 'operationTime', width: 100 },
      { title: '已付款金额', key: 'operationTime', width: 100 },
      { title: '待付款金额', key: 'operationTime', width: 100 },
      { title: '待登记', key: 'operationTime', width: 60 },
      { title: '操作', slot: 'action', width: 55 }
    ] as ColumnExtra[]
  }

  editShow() {
    this.$router.push({ name: 'client-film-edit'})
  }

  mounted() {}
}
</script>

<style lang="less" scoped>
</style>
