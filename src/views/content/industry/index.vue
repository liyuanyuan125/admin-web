<template>
  <div>
    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage">
      <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          @click="view(0 , 0)"
        >新增行业</Button>
      </template>
      <template slot="modifyTime" slot-scope="{ row: { id , modifyTime } }">
        <div class="row-acts">
          <span>{{modifyTime.split('T')[0]}} {{modifyTime.split('T')[1].split('.')[0]}}</span>
        </div>
      </template>
      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <a @click="view(1 , id)">编辑</a>
          <a @click="view(-1 , id)">查看</a>
          <a @click="del(id)" >删除</a>
        </div>
      </template>
    </ListPage>

    <DlgEdit ref="addOrUpdate" v-if="addOrUpdateVisible" @done="refresh" />

  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList , addList , setList , itemList , dels } from '@/api/industry'
import { alert, toast , confirm } from '@/ui/modal'
import DlgEdit from './dlgEdit.vue'

@Component({
  components: {
    ListPage,
    DlgEdit
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  addOrUpdateVisible = false

  enums = []

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  // 筛选列表
  get filters() {
    return [
      {
        name: 'tradeName',
        defaultValue: '',
        input: true,
        width: 85,
        placeholder: '行业名称'
      },

      {
        name: 'tradeId',
        defaultValue: '',
        input: true,
        width: 85,
        placeholder: '行业ID'
      },

      {
        name: 'dateRange',
        defaultValue: '',
        dateRange: true,
        width: 200,
        placeholder: '更新时间',
        dealParam(value: string) {
          const [beginUpdateTime, endUpdateTime] = value ? value.split('-') : [null, null]
          return {
            beginUpdateTime,
            endUpdateTime
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
  }

  // 内容列表
  get columns() {
    return [
      { title: 'ID', key: 'id' },
      { title: '行业名称', key: 'tradeName' },
      { title: '行业ID', key: 'tradeId' },
      { title: '更新时间', slot: 'modifyTime', },
      { title: '更新人', key: 'modifyUser', },
      { title: '操作', slot: 'action' }
    ] as ColumnExtra[]
  }

  // 新建/编辑/查看
  view(id: any , viewid: any) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id , viewid)
    })
  }

  // 删除
  async del(id: any) {
    try {
      await confirm('您确定删除当前行业信息吗？')
      await dels(id)
      this.$Message.success({
        content: `删除成功`,
      })
      this.refresh()
    } catch (ex) {
      this.handleError(ex)
    }
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
