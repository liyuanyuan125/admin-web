<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      :listMap="listMap"
      ref="listPage"
    >
      <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          @click="editShow()"
          v-auth="'theater.cinemas:add'"
        >新建影院</Button>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'data-cinema-hall', params: { id } }"
            v-auth="'theater.cinemas:info'"
          >查看影厅</router-link>
          <a @click="editShow(id)" v-auth="'theater.cinemas:modify'">编辑</a>
        </div>
      </template>
    </ListPage>

    <EditDialog :fields="fields" :fetch="editFetch" :submit="editSubmit" ref="editDlg"/>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import {
  queryList,
  // queryItem,
  // addItem,
  // updateItem
} from '@/api/clientFilm'
import EditDialog, { Field } from '@/components/editDialog'

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
      name: 'email',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '申请人邮箱'
    },

    {
      name: 'corpName',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '申请人公司名称'
    },

    {
      name: 'filmName',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '申请人公司名称'
    },

    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '关联状态'
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
      { title: '申请人邮箱', key: 'email', width: 180 },
      { title: '申请人公司名称', key: 'corpName', minWidth: 180 },
      { title: '影片名称', key: 'filmName', minWidth: 180 },
      { title: '状态', key: 'status', width: 80 },
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  fields: Field[] = [
    {
      name: 'id',
      defaultValue: 0
    },

    {
      name: 'shortName',
      defaultValue: '',
      type: 'input',
      label: '影城名称',
      span: 16,
      required: true
    },

    {
      name: 'code',
      defaultValue: '',
      type: 'input',
      label: '专资ID',
      span: 8,
      required: true
    },

    {
      name: 'officialName',
      defaultValue: '',
      type: 'input',
      label: '官方名称',
      span: 16,
      required: true
    },

    {
      name: 'gradeCode',
      defaultValue: '',
      type: 'select',
      label: '影院等级',
      span: 8
    },

    {
      name: 'softwareCode',
      defaultValue: '',
      type: 'select',
      label: '售票系统',
      span: 8
    },

    {
      name: 'address',
      defaultValue: '',
      type: 'input',
      span: 14,
      placeholder: '详细地址',
      width: 405
    },

    {
      name: 'zipCode',
      defaultValue: '',
      type: 'input',
      label: '邮编',
      span: 8
    },

    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      label: '营业状态',
      span: 8,
      defaultEnumIndex: 0,
      auth: 'theater.cinemas:change-status'
    },

    {
      name: 'controlStatus',
      defaultValue: 0,
      type: 'select',
      label: '控制状态',
      span: 8,
      defaultEnumIndex: 0,
      auth: 'theater.cinemas:change-control-status'
    },

    {
      name: 'pricingLevelCode',
      defaultValue: '',
      type: 'select',
      label: '定价级别',
      span: 8,
      auth: 'theater.cinemas:change-pricing-level'
    },

    {
      name: 'boxLevelCode',
      defaultValue: '',
      type: 'select',
      label: '票房级别',
      span: 8,
      auth: 'theater.cinemas:change-box-level'
    }
  ]

  // editFetch = queryItem

  // editShow(id = 0) {
  //   const editor = this.$refs.editDlg as EditDialog
  //   editor.show({ id }).done((data: any) => {
  //     (this.$refs.listPage as any).update()
  //   })
  // }

  // editSubmit(data: any) {
  //   return data.id ? updateItem(data) : addItem(data)
  // }

  mounted() {}
}
</script>

<style lang="less" scoped>
</style>
