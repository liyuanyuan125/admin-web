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
        >创建</Button>
      </template>
      <template slot="action" slot-scope="{ row }">
        <div class="row-acts">
          <a @click="handleStatus(row)" v-text="row.status == 1 ? '禁用':'启用'"></a>
          <a @click="editShow(row.id)" >编辑</a>
        </div>
      </template>
    </ListPage>
    <EditDialog
      v-model="crawlVisible"
      title="新建"
      :width="500"
      :fields="crawlFields"
      :fetch="() => ({  })"
      hideSubmit
      hideReturn
    />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
// Sky
import {confirm , warning , success, toast } from '@/ui/modal'
import {
  queryList,
  updateStatus,
  userList
} from '@/api/business'
import { EditDialog, Field } from '@/components/editForm'
@Component({
  components: {
    ListPage,
    EditDialog
  }
})
export default class Main extends ViewBase {
  stats: any = ''
  fetch = queryList
  userListNow: any = []
  filters: Filter[] = [
    {
      name: 'name',
      defaultValue: '',
      type: 'input',
      width: 120,
      placeholder: '姓名'
    },

    {
      name: 'mobile',
      defaultValue: '',
      type: 'input',
      width: 120,
      placeholder: '手机号'
    },

    {
      name: 'email',
      defaultValue: '',
      type: 'input',
      width: 120,
      placeholder: '邮箱'
    },

    {
      name: 'status',
      defaultValue: '',
      type: 'select',
      width: 120,
      placeholder: '状态'
    },

    {
      name: 'role',
      defaultValue: '',
      type: 'select',
      width: 120,
      placeholder: '角色'
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
    'roleList'
  ]

  crawlVisible = false

  get columns() {
    return [
      { title: '序号', key: 'index', width: 65 },
      { title: '专资ID', key: 'id', width: 80 },
      { title: '姓名', key: 'name', minWidth: 100 },
      { title: '手机号', key: 'mobile', width: 100, },
      { title: '邮箱', key: 'email', minWidth: 150 },
      { title: '角色', key: 'role', editor: 'enum', minWidth: 80 },
      { title: '可享折扣', key: 'discount', width: 80 },
      { title: '创建时间', key: 'createTime', editor: 'dateTime', width: 150 },
      { title: '创建人', key: 'createUserName', width: 80 },
      { title: '状态', key: 'status', editor: 'enum', width: 60, },
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  crawlFields: Field[] = [
    {
      name: 'id',
      defaultValue: '',
      label: '姓名',
      required: true,
      select: {
        // enumList: [{key,text}]
      },
      span: 21,
    },

    {
      name: 'discount',
      defaultValue: '',
      label: '可享折扣',
      required: true,
      placeholder: '数字在0-1之间，例如：0.1，代表可享折扣是1折',
      input: true,
      span: 21,
    }
  ]


  editShow(id = 0) {
    this.crawlVisible = true

  }
  async handleStatus(data: any) {
    try {
      this.stats = data.status == 1 ? '禁用' : '启用'
      await confirm('您确定' + this.stats + '当前状态信息吗？')
      await updateStatus (
        data.id,
        data.status == 1 ? 2 : 1
      )
      this.$Message.success({
        content: `更改成功`,
      });
      (this.$refs.listPage as any).update()
    } catch (error) {
    }
  }

  editSubmit(data: any) {// 创建和提交
  }

  mounted() {}
}
</script>

<style lang="less" scoped>
.companies:only-child:empty::before {
  content: "-";
}
</style>
