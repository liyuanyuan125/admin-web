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
      v-model="editVisible"
      :title="editId > 0 ? '编辑' : '新建'"
      :width="500"
      :fields="editFields"
      :fetch="editFetch"
      hideSubmit
      hideReturn
    />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { confirm , warning , success, toast } from '@/ui/modal'
import {
  queryList,
  getItem,
  updateStatus,
  userList
} from '@/api/business'
import { EditDialog, Field } from '@/components/editForm'
import { devLog } from '@/util/dev'

@Component({
  components: {
    ListPage,
    EditDialog
  }
})
export default class Main extends ViewBase {
  stats: any = ''

  roleList: any = []

  filters: Filter[] = [
    {
      name: 'name',
      defaultValue: '',
      input: true,
      width: 120,
      placeholder: '姓名'
    },

    {
      name: 'mobile',
      defaultValue: '',
      input: true,
      width: 120,
      placeholder: '手机号'
    },

    {
      name: 'email',
      defaultValue: '',
      input: true,
      width: 120,
      placeholder: '邮箱'
    },

    {
      name: 'status',
      defaultValue: '',
      select: true,
      width: 120,
      placeholder: '状态'
    },

    {
      name: 'role',
      defaultValue: '',
      select: true,
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

  editId = 0

  editVisible = false

  get columns() {
    return [
      { title: '序号', key: 'index', width: 65 },
      { title: '专资ID', key: 'id', width: 80 },
      { title: '姓名', key: 'name', minWidth: 100 },
      { title: '手机号', key: 'mobile', width: 100, },
      { title: '邮箱', key: 'email', minWidth: 150 },
      { title: '角色', key: 'role', enum: true, minWidth: 80 },
      { title: '可享折扣', key: 'discount', width: 80 },
      { title: '创建时间', key: 'createTime', dateTime: true, width: 150 },
      { title: '创建人', key: 'createUserName', width: 80 },
      { title: '状态', key: 'status', enum: true, width: 60, },
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  editFields: Field[] = [
    {
      name: 'id',
      defaultValue: 0,
      label: '姓名',
      required: true,
      select: {
        enumKey: 'userList'
      },
      span: 21,
    },

    {
      name: 'role',
      defaultValue: 0,
      label: '角色',
      required: true,
      radio: {
        enumKey: 'roleList'
      },
      span: 21,
    },

    {
      name: 'discount',
      defaultValue: 0,
      label: '可享折扣',
      required: true,
      placeholder: '数字在0-1之间，例如：0.1，代表可享折扣是1折',
      number: true,
      min: 0,
      max: 1,
      span: 21,
    }
  ]

  async fetch() {
    const res = await queryList()
    this.roleList = res.roleList
    return res
  }

  async editFetch() {
    const list = await userList()
    const item = this.editId > 0
      ? await getItem(this.editId)
      : { userId: 0, role: 0, discount: 1 }
    const result = {
      item: {
        id: item.userId,
        role: item.role,
        discount: item.discount
      },
      userList: list,
      roleList: this.roleList
    }
    return result
  }

  async editShow(id = 0) {
    this.editId = id
    this.editVisible = true
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
