<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
      <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          @click="editShow()"
        >新建影片关联</Button>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'client-film-detail', params: { id } }"
          >详情</router-link>
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
import Director from './director.vue'

import {
  queryList
} from '@/api/clientFilm'
import EditDialog, { Field } from '@/components/editDialog'

@Component({
  components: {
    ListPage,
    EditDialog,
    Director
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
      placeholder: '申请人邮箱'
    },

    {
      name: 'companyId',
      defaultValue: 0,
      type: CompanyList,
      width: 140,
      placeholder: '申请人公司名称'
    },

    {
      name: 'movieId',
      defaultValue: 0,
      type: CompanyList,
      width: 140,
      placeholder: '影片名称',
    },

    {
      name: 'operatorId',
      defaultValue: 0,
      type: Director,
      width: 240,
      placeholder: '操作人'
    },

    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '关联状态',
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
      { title: '序号', key: 'id', width: 65 },
      { title: '申请人邮箱', key: 'applyEmail', width: 160 },
      { title: '申请人公司名称', key: 'companyName', minWidth: 180 },
      { title: '影片名称', key: 'movieName', minWidth: 180 },
      { title: '申请人时间', key: 'applyTime', editor: 'dateTime', width: 135 },
      { title: '状态', key: 'status', width: 60, editor: 'enum'},
      { title: '操作人', key: 'operationEmail', width: 100 },
      { title: '操作时间', key: 'operationTime', editor: 'dateTime', width: 135 },
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
