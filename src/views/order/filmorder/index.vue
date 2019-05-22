<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
    <template slot="id" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'order-kollist-detail', params: { id } }"
          >{{id}}</router-link>
        </div>
      </template>
      <template slot="action" slot-scope="{ row: { id , status  } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'order-kollist-detail', params: { id } }"
          >详情{{status}}</router-link>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import CompanyList from './filename.vue'
import dateDicker from './dateDicker.vue'


import {
  queryList
} from '@/api/orderkol'
import EditDialog, { Field } from '@/components/editDialog'

@Component({
  components: {
    ListPage,
    EditDialog,
    dateDicker
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  filters: Filter[] = [
    {
      name: 'companyId1',
      defaultValue: 0,
      type: CompanyList,
      width: 140,
      placeholder: '公司名称'
    },

    {
      name: 'dateRange',
      defaultValue: '',
      type: 'dateRange',
      width: 200,
      placeholder: '选择时间',
      dealParam(value: string) {
        const [startDate, endDate] = value ? value.split('-') : [null, null]
        return {
          startDate,
          endDate
        }
      }
    },


    {
      name: 'companyId',
      defaultValue: 0,
      type: CompanyList,
      width: 140,
      placeholder: '影片名称'
    },

    {
      name: 'status3',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '单据状态',
      enumKey: 'statusList'
    },

    {
      name: 'status5',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '资源类型',
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
      { title: '订单编号', slot: 'id', width: 65 },
      { title: '公司ID', slot: 'id', width: 65 },
      { title: '公司名称', key: 'movieName', minWidth: 160 },
      { title: '项目名称', key: 'applyTime', editor: 'dateTime', width: 135 },
      { title: '关联影片id', key: 'status', width: 100, editor: 'enum'},
      { title: '关联影片名称', key: 'status', width: 100, editor: 'enum'},
      { title: '下单时间', key: 'operationTime', editor: 'dateTime', width: 135 },
      { title: '影片资源类型', key: 'status', width: 100 , editor: 'enum' },
      { title: '品牌方线上资源', key: 'status', width: 100 , editor: 'enum' },
      { title: '品牌方线下资源', key: 'status', width: 100 , editor: 'enum' },
      { title: '订单状态', key: 'status', width: 100 , editor: 'enum' },
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
