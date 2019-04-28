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
        >新建影片关联</Button>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'data-cinema-hall', params: { id } }"
            v-auth="'theater.cinemas:info'"
          >详情</router-link>
        </div>
      </template>

      <template slot="operationTime" slot-scope="{ row: { operationTime } }">
        <span>{{timeFormat(operationTime)}}</span>
      </template>

      <template slot="applyTime" slot-scope="{ row: { applyTime } }">
        <span>{{timeFormat(applyTime)}}</span>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'data-cinema-hall', params: { id } }"
            v-auth="'theater.cinemas:info'"
          >详情</router-link>
        </div>
      </template>
    </ListPage>

    <!-- <EditDialog :fields="fields" :fetch="editFetch" :submit="editSubmit" ref="editDlg"/> -->
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import moment from 'moment'
import {
  queryList
} from '@/api/clientFilm'
import EditDialog, { Field } from '@/components/editDialog'
const timeFormat = 'YYYY/MM/DD HH:mm:ss'

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
      name: 'applyEmail',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '申请人邮箱'
    },

    {
      name: 'companyName',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '申请人公司名称'
    },

    {
      name: 'movieName',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '影片名称'
    },

    {
      name: 'createrUser',
      defaultValue: 0,
      type: 'select',
      width: 100,
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
      { title: '申请人邮箱', key: 'applyEmail', width: 180 },
      { title: '申请人公司名称', key: 'companyName', minWidth: 180 },
      { title: '影片名称', key: 'movieName', minWidth: 180 },
      { title: '申请人时间', key: 'applyTime', slot: 'applyTime', minWidth: 140 },
      { title: '状态', key: 'status', width: 80 },
      { title: '操作人', key: 'operationUser', width: 100 },
      { title: '操作时间', key: 'operationTime', slot: 'operationTime', width: 140 },
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

  timeFormat(time: any) {
    const createdTime = time ? moment(time).format(timeFormat) : ''
    return createdTime
  }

  editShow() {
    this.$router.push({ name: 'client-film-edit'})
  }

  mounted() {}
}
</script>

<style lang="less" scoped>
</style>
