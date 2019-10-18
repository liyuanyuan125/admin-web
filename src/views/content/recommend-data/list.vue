<template>
  <div>
    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage">
      <template slot="acts-2">
        <router-link :to="{
            name: 'content-recommend-data-detail',
            params: {
              action: 'create',
              postId: this.postId
            }
          }">
          <Button type="primary" class="button-audit">新增推荐位数据</Button>
        </router-link>
      </template>

      <template slot="action" slot-scope="{ row: { status, id, name, _index } }">
        <div class="row-acts">
          <a v-if="!(currentPageIndex == 1 && _index === 0)" @click="sortItemHandler(id, true)">上移</a>
          <a @click="sortItemHandler(id, false)" >下移</a>
          <router-link :to="{
              name: 'content-recommend-data-detail',
              params: {
                postId: postId,
                id,
                action: 'edit'
              }
            }">编辑</router-link>
          <router-link :to="{
              name: 'content-recommend-data-detail',
              params: {
                postId: postId,
                id,
                action: 'view'
              }
            }">查看</router-link>
          <a @click="enabledItemHandler(id, name, 'disabled')" >删除</a>
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
  disabledItem,
  sortItem
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

  postId: number|string|null = null

  // 记录listpage 当前分页
  currentPageIndex: number = 1

  enabledTitleName: string = ''
  enabledSubmitFetch: any = null
  enabledItemVisible: boolean = false
  enabledItemData: any = {
    id: '',
    name: '',
  }
  enabledItemFields: Field[] = [
    {
      name: 'id',
      defaultValue: '',
      label: 'ID',
      text: true,
      span: 21
    },

    {
      name: 'name',
      defaultValue: '',
      label: '名称',
      text: true,
      span: 21
    }
  ]

  get listPage() {
    return this.$refs.listPage as ListPage
  }
  // nxd 20191014
  get filters() {
    return [
      {
        name: 'postId',
        defaultValue: this.postId,
      },

      {
        name: 'name',
        defaultValue: '',
        input: true,
        width: 85,
        placeholder: '名称'
      },

      {
        name: 'updateUser',
        defaultValue: '',
        input: true,
        width: 85,
        placeholder: '更新人'
      },

      {
        name: 'dateRange1',
        defaultValue: '',
        dateRange: true,
        width: 200,
        placeholder: '开始时间',
        dealParam(value: string) {
          const [startBeginTime, startEndTime] = value ? value.split('-') : [null, null]
          return {
            startBeginTime,
            startEndTime
          }
        }
      },

      {
        name: 'dateRange3',
        defaultValue: '',
        dateRange: true,
        width: 200,
        placeholder: '结束时间',
        dealParam(value: string) {
          const [overBeginTime, overEndTime] = value ? value.split('-') : [null, null]
          return {
            overBeginTime,
            overEndTime
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
        placeholder: '状态'
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
      { title: '序号', type: 'index' },
      { title: '名称', key: 'name' },
      { title: '开始时间', key: 'beginTime', date: true },
      { title: '结束时间', key: 'endTime', date: true },
      { title: '投放渠道', key: 'channels', enum: 'channelList' },
      { title: '状态', key: 'status', enum: true },
      { title: '更新时间', key: 'modifyTime', date: true },
      { title: '更新人', key: 'modifyUser', },
      { title: '操作', key: 'keyWords', slot: 'action' }
    ] as ColumnExtra[]
  }

  enums = []

  // 删除弹层
  enabledItemHandler(id: number, name: string, status: string) {
    this.enabledTitleName = '删除推荐数据'
    this.enabledSubmitFetch = this.disabledItemSubmit
    this.enabledItemData = {
      id,
      name
    }
    this.enabledItemVisible = true
  }

  // 排序
  sortItemHandler(id: number, isUp: boolean) {
    // 推荐数据使用
    const pageIndexI = this.filters.findIndex((it: any) => {
      return it.name === 'pageIndex'
    })
    const pageSizeI = this.filters.findIndex((it: any) => {
      return it.name === 'pageSize'
    })
    const query = {
      ...this.$route.query
    }
    if (query.dateRange1 && query.dateRange1 !== '' ) {
      query.startBeginTime = (query.dateRange1 as string).split('-')[0]
      query.startEndTime = (query.dateRange1 as string).split('-')[1]
    }
    if (query.dateRange3 && query.dateRange3 !== '' ) {
      query.overBeginTime = (query.dateRange3 as string).split('-')[0]
      query.overEndTime = (query.dateRange3 as string).split('-')[1]
    }
    const data = {
      name: query.name  || null,
      updateUser: query.updateUser  || null,
      overBeginTime: query.overBeginTime || null,
      overEndTime: query.overEndTime || null,
      startBeginTime: query.startBeginTime || null,
      startEndTime: query.startEndTime || null,
      status: query.status || null,
      pageIndex: query.pageIndex || null,
      pageSize: query.pageSize || null,
      isUp
    }
    this.sortItemSubmit(this.postId, id, data)
  }

  // 修改排序请求
  async sortItemSubmit(postId: any, id: number, data: any) {
    await sortItem(postId, id, data)
    toast('操作成功')
    this.refresh()
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

  created() {
    this.postId = parseInt(this.$route.params.postId, 0) || null
    this.currentPageIndex = parseInt((this.$route.query.pageIndex as string), 0) || 1
  }

  @Watch('$route.query.pageIndex')
  watchModel(val: any) {
    this.currentPageIndex = parseInt((this.$route.query.pageIndex as string), 0) || 1
  }
}
</script>

<style lang="less" scoped>
.keyWords:only-child:empty::before {
  content: '-';
}
</style>
