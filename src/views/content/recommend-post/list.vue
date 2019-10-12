<template>
  <div>
    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage">
      <template slot="acts-2">
        <router-link :to="{
            name: 'promotion-cpm-detail',
            params: {
              action: 'create'
            }
          }">
          <Button type="primary" class="button-audit">新增推荐位</Button>
        </router-link>
      </template>

      <template slot="action" slot-scope="{ row: { status, id, name, enName } }">
        <div class="row-acts">
          <router-link v-if="status === 1" :to="{
              name: 'promotion-cpm-detail',
              params: {
                id,
                action: 'edit'
              }
            }">编辑</router-link>
          <router-link v-if="status === 1" :to="{
              name: 'promotion-cpm-detail',
              params: {
                id,
                action: 'audit'
              }
            }">审批</router-link>
          <router-link :to="{
              name: 'promotion-cpm-detail',
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

@Component({
  components: {
    ListPage,
    EditDialog
  }
})
export default class Main extends ViewBase {
  fetch = queryList

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
        placeholder: '推荐位名称'
      },

      {
        name: 'dateRange',
        defaultValue: '',
        dateRange: true,
        width: 200,
        placeholder: '活动时间',
        dealParam(value: string) {
          const [beginTime, endTime] = value ? value.split('-') : [null, null]
          return {
            beginTime,
            endTime
          }
        }
      },

      {
        name: 'pageIndex',
        defaultValue: 1
      },

      {
        name: 'pageSize',
        defaultValue: 2
      }
    ]
  }

  get columns() {
    return [
      { title: '活动ID', key: 'id' },
      { title: '推荐位名称', key: 'name' },
      { title: '描述', key: 'customerType', enum: true },
      { title: '更信人', key: 'auditor', },
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

    // const pageIndexI = this.filters.findIndex((it: any) => {
    //   return it.name === 'pageIndex'
    // })
    // const pageSizeI = this.filters.findIndex((it: any) => {
    //   return it.name === 'pageSize'
    // })
    // const query = {
    //   ...this.$route.query
    // }
    // if (query.dateRange !== '' ) {
    //   query.beginTime = (query.dateRange as string).split('-')[0]
    //   query.endTime = (query.dateRange as string).split('-')[1]
    // }
    // delete query.dateRange
    // console.log(query, 'query')
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
