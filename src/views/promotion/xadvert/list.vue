<template>
  <div>
    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage">
      <template slot="acts-2">
        <router-link :to="{
            name: 'promotion-xadvert-detail',
            params: {
              action: 'create'
            }
          }">
          <Button type="primary" class="button-audit">新建活动</Button>
        </router-link>
      </template>

      <template slot="action" slot-scope="{ row: { status, id, name, enName } }">
        <div class="row-acts">
          <router-link v-if="status === 1" :to="{
              name: 'promotion-xadvert-detail',
              params: {
                id,
                action: 'edit'
              }
            }">编辑</router-link>
          <router-link v-if="status === 1" :to="{
              name: 'promotion-xadvert-detail',
              params: {
                id,
                action: 'audit'
              }
            }">审批</router-link>
          <router-link :to="{
              name: 'promotion-xadvert-detail',
              params: {
                id,
                action: 'view'
              }
            }">查看</router-link>
          <a @click="enabledItemHandler(id, name, enName, 'disabled')" v-if="status === 2">下线</a>
        </div>
      </template>
    </ListPage>

    <EditDialog v-model="enabledItemVisible" :title="enabledTitleName" :labelWidth="120" :width="550" :fields="enabledItemFields" :fetch="() => { return this.enabledItemData }" :submit="enabledSubmitFetch" hideSubmit hideReturn />
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import {
  queryList,
  disabledItem
} from './data'
import { alert, toast } from '@/ui/modal'
import { EditDialog, Field } from '@/components/editForm'
import moment from 'moment'

@Component({
  components: {
    ListPage,
    EditDialog
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  moment = moment

  enabledTitleName: string = ''
  enabledSubmitFetch: any = null
  enabledItemVisible: boolean = false
  enabledItemData: any = {
    id: '',
    name: '',
    enName: ''
  }
  enabledItemFields: Field[] = [
    {
      name: 'id',
      defaultValue: '',
      label: '活动ID',
      text: true,
      span: 21
    },

    {
      name: 'name',
      defaultValue: '',
      label: '活动名称',
      text: true,
      span: 21
    }
  ]

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  get filters() {
    return [
      {
        name: 'name',
        defaultValue: '',
        input: true,
        width: 85,
        placeholder: '活动名称'
      },

      {
        name: 'customerType',
        defaultValue: 0,
        select: {
          enumKey: 'customerTypeList',
        },
        width: 128,
        placeholder: '客户范围'
      },

      {
        name: 'channelCode',
        defaultValue: 0,
        select: {
          enumKey: 'channelList',
        },
        width: 128,
        placeholder: '适用渠道'
      },

      // {
      //   name: 'type',
      //   defaultValue: 0,
      //   select: {
      //     enumKey: 'typeList',
      //   },
      //   width: 128,
      //   placeholder: '促销活动类型'
      // },

      {
        name: 'dateRange',
        defaultValue: '',
        dateRange: true,
        width: 200,
        placeholder: '活动时间',
        dealParam(value: string) {
          const [beginDate, endDate] = value ? value.split('-') : [null, null]
          return {
            beginDate,
            endDate
          }
        }
      },

      {
        name: 'status',
        defaultValue: 0,
        select: {
          enumKey: 'statusList',
        },
        width: 128,
        placeholder: '活动状态'
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
  }

  get columns() {
    return [
      { title: '活动ID', key: 'id' },
      { title: '活动名称', key: 'name' },
      { title: '客户范围', key: 'customerType', enum: true },
      { title: '适用渠道', key: 'channelCodes', enum: 'channelList' },
      { title: '促销活动类型', key: 'type', enum: true },
      { title: '活动开始时间', key: 'beginDate', date: true},
      { title: '活动结束时间', key: 'endDate', date: true },
      { title: '活动状态', key: 'status', enum: true },
      { title: '审批人', key: 'approvalName', },
      { title: '操作', key: 'keyWords', slot: 'action' }
    ] as ColumnExtra[]
  }

  enums = []

  // 下线弹层
  enabledItemHandler(id: number, name: string, enName: string, status: string) {
    this.enabledTitleName = '活动下线'
    this.enabledSubmitFetch = this.disabledItemSubmit
    this.enabledItemData = {
      id,
      name,
      enName
    }
    this.enabledItemVisible = true
  }

  // 下线请求
  async disabledItemSubmit({ id }: any) {
    await disabledItem(id)
    toast('操作成功')
    this.enabledItemVisible = false
    this.refresh()
  }

  refresh() {
    this.listPage.update()
  }

  created() {}
}
</script>

<style lang="less" scoped>
.keyWords:only-child:empty::before {
  content: '-';
}
</style>
