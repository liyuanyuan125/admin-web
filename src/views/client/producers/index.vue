<template>
  <div>
     <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage">

      <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          @click="editShow()"
        >片商管理</Button>
      </template>

      <template slot="year" slot-scope="{row: {year, month}}">
        <span>{{year}}-{{month && String(month).length == 1 ? `0${month}` : month}}</span>
      </template>

      <template slot="operate" slot-scope="{row}">
         <a v-auth="'customer.companies:change-status'" style="margin-right: 8px" v-if="row.status == 1" class="operation" @click="editStatus(row.id, row.status)">停用</a>
          <a v-auth="'customer.companies:change-status'" style="margin-right: 8px" v-else class="operation" @click="editStatus(row.id, row.status)">启用</a>
          <!-- <router-link v-auth="'customer.companies:modify'" style="margin-right: 8px" v-if="row.approveStatus == 1" class="operation" :to="{ name: 'client-producers-edit', params: { id:row.id } }">审核</router-link> -->
          <router-link v-auth="'customer.companies:modify'" style="margin-right: 8px" class="operation" :to="{ name: 'client-producers-edit', params: { id:row.id } }">编辑</router-link>
          <router-link v-auth="'customer.companies:info'" style="margin-right: 8px" class="operation" :to="{ name: 'client-producers-detail', params: { id:row.id }}">详情</router-link>
      </template>
    </ListPage>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { querylist, stop } from '@/api/ggsiter'
import { toMap } from '@/fn/array'
import { directorList } from '@/api/corpReal'

const makeMap = (list: any[]) => toMap(list, 'typeCode', 'typeName')
@Component({
  components: {
    ListPage
  }
})
export default class Main extends ViewBase {

  filters: Filter[] = [
    {
      name: 'companyId',
      defaultValue: '',
      type: 'input',
      width: 108,
      placeholder: 'id'
    },
    {
      name: 'shortName',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '片商名称'
    },

    {
      name: 'levelCode',
      defaultValue: '',
      type: 'select',
      width: 100,
      placeholder: '客户等级',
      enumKey: 'levelList'
    },

    {
      name: 'businessDirector',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '关联销售',
      enumKey: 'businesList'
    },

    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '状态',
      enumKey: 'statusList'
    },

    {
      name: 'approveStatus',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '审核状态',
      enumKey: 'approveStatusList'
    },

    {
      name: 'pageIndex',
      defaultValue: 1
    },

    {
      name: 'typeCode',
      defaultValue: 'film'
    },

    {
      name: 'pageSize',
      defaultValue: 20
    }
  ]

  enums = [
    'approveStatusList',
    'statusList',
    'companyTypeList',
    'customerTypeList',
    'levelList',
    'businesList',
  ]

  columns = [
    { title: 'ID', key: 'id', minWidth: 65 },
    { title: '片商名称', key: 'name', minWidth: 100 },
    { title: '客户等级', key: 'levelCode', minWidth: 60, editor: 'enum' },
    { title: '关联销售', key: 'businessDirectorName', minWidth: 60 },
    { title: '创建时间', key: 'createTime', minWidth: 60, editor: 'dateTime' },
    { title: '更新时间', key: 'modifyTime', minWidth: 60, editor: 'dateTime' },
    { title: '更新人', key: 'modifyUserName', minWidth: 100 },
    { title: '状态', key: 'status', minWidth: 60, editor: 'enum'},
    { title: '审核状态', key: 'approveStatus', minWidth: 60, editor: 'enum'},
    { title: '操作', slot: 'operate', minWidth: 90 },
  ]

  fetch = async (req: any) => {
    const res = await querylist(req)
    const {
      data: {
        items
      }
    } = await directorList()
    const businesList = (items || []).map((it: any) => {
      return {
        key: it.id,
        text: it.userName
      }
    })
    res.data.approveStatusList = res.data.approveStatusList.filter((it: any) => {
      return it.key != 0
    })
    res.data.statusList = res.data.statusList.filter((it: any) => {
      return it.key != 0
    })
    res.data.businesList = businesList
    return res
  }

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  editShow(id?: any) {
    this.$router.push({
      name: 'client-producers-edit',
      params: {
        id
      }
    })
  }

  async editStatus(id: number, status: number) {
    const statu = status == 1 ? '停用' : '启用'
    const statusType = status == 1 ? 2 : 1
    await confirm(`确定要${statu}该项吗？`)
    try {
      await stop(id, { status: statusType})
      this.listPage.update()
    } catch (ex) {
      setTimeout(() => {
        this.handleError(ex)
      }, 1000)
    }

  }
}
</script>
<style lang='less' scoped>
.operate-btn {
  span {
    cursor: pointer;
    color: #2d8cf0;
    margin: 4px 6px;
  }
}
</style>