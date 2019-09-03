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

const makeMap = (list: any[]) => toMap(list, 'typeCode', 'typeName')
@Component({
  components: {
    ListPage
  }
})
export default class Main extends ViewBase {
  fetch = querylist

  filters: Filter[] = [
    {
      name: 'companyId',
      defaultValue: 0,
      type: 'input',
      width: 108,
      placeholder: 'id'
    },
    {
      name: 'code',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '片商名称'
    },

    {
      name: 'resourceBillNo',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '客户等级',
    },
    {
      name: 'billStatus',
      defaultValue: '',
      type: 'select',
      width: 100,
      placeholder: '客户类型',
    },

    {
      name: 'invoiceType',
      defaultValue: 0,
      type: 'select',
      width: 100,
      placeholder: '关联销售',
      enumKey: 'invoiceTypeCodeList'
    },

    {
      name: 'invoiceContent',
      defaultValue: '',
      type: 'select',
      width: 100,
      placeholder: '推荐人电话',
      enumKey: 'invoiceContentCodeList'
    },
    {
      name: 'yearMonth',
      defaultValue: null,
      type: 'input',
      width: 108,
      placeholder: '创建时间'
    },
    {
      name: 'payStatus',
      defaultValue: '',
      type: 'select',
      width: 100,
      placeholder: '更新时间',
      enumKey: 'payStatusList'
    },

    {
      name: 'payStatus',
      defaultValue: '',
      type: 'select',
      width: 100,
      placeholder: '更新人',
      enumKey: 'payStatusList'
    },

    {
      name: 'payStatus',
      defaultValue: '',
      type: 'select',
      width: 100,
      placeholder: '状态',
      enumKey: 'payStatusList'
    },

    {
      name: 'payStatus',
      defaultValue: '',
      type: 'select',
      width: 100,
      placeholder: '审核状态',
      enumKey: 'payStatusList'
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
    'applyTypeList',
    'invoiceContentCodeList',
    'invoiceStatusList',
    'invoiceTypeCodeList',
    'payStatusList',
    'billStatusList'
  ]

  columns = [
    { title: 'ID', key: 'id', minWidth: 65 },
    { title: '片商名称', key: 'name', minWidth: 100 },
    { title: '客户等级', key: 'levelCode', minWidth: 60, editor: 'enum' },
    { title: '关联销售', key: 'businessDirectorName', minWidth: 60 },
    { title: '推荐人电话', key: 'recommendMobile', minWidth: 100 },
    { title: '创建时间', key: 'createTime', minWidth: 60, editor: 'dateTime' },
    { title: '更新时间', key: 'modifyTime', minWidth: 60, editor: 'dateTime' },
    { title: '更新人', key: 'amount', minWidth: 100 },
    { title: '状态', key: 'status', minWidth: 60, editor: 'enum'},
    { title: '审核状态', key: 'approveStatus', minWidth: 60, editor: 'enum'},
    { title: '操作', slot: 'operate', minWidth: 90 },
  ]

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