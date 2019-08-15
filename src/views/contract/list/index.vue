<template>
  <div class="index-page">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      ref="listPage"
    >
      <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          :to="editRoute('new')"
        >新建合同</Button>
      </template>

      <template slot="action" slot-scope="{ row: { id, approveStatus: status } }">
        <div class="row-acts">
          <router-link :to="editRoute('edit', id)" v-if="status == 1">编辑</router-link>
          <router-link :to="editRoute('audit', id)" v-if="status == 1">审批</router-link>
          <a @click="cancel(id)" v-if="status == 2">作废</a>
          <router-link :to="editRoute('copy', id)">复制</router-link>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList, auditItem } from './data'
import { alert, toast, confirm } from '@/ui/modal'

import {
  updateStatus,
  updateControlStatus,
  updatePricingLevelCode,
  updateBoxLevelCode,
  queryItem,
  addItem,
  updateItem
} from '@/api/cinema'

import { EditDialog, Field } from '@/components/editForm'

// 审核状态：0 未知、1 待审核、2 通过、3 拒绝、4 作废

@Component({
  components: {
    ListPage,
    EditDialog,
  }
})
export default class IndexPage extends ViewBase {
  get listPage() {
    return this.$refs.listPage as ListPage
  }

  fetch = queryList

  get filters(): Filter[] {
    return [
      {
        name: 'contractNo',
        defaultValue: '',
        input: true,
        width: 168,
        placeholder: '合同编号/合同名称',
      },

      {
        name: 'companyBName',
        defaultValue: '',
        input: true,
        width: 168,
        placeholder: '乙方公司名称'
      },

      {
        name: 'validityDate',
        defaultValue: '',
        dateRange: true,
        width: 188,
        placeholder: '到期时间',
        dealParam(value: string) {
          const [validityStartDate, validityEndDate] = value ? value.split('-') : [null, null]
          return {
            validityStartDate,
            validityEndDate
          }
        }
      },

      {
        name: 'approveStatus',
        defaultValue: -1,
        select: true,
        width: 88,
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
      {
        title: '合同编号',
        key: 'contractNo',
        minWidth: 90,
        maxWidth: 120,
        link: ({ item }) => this.editRoute('view', item.id)
      },
      { title: '合同名称', key: 'contractName', minWidth: 90 },
      { title: '乙方公司名称', key: 'companyBName', minWidth: 100 },
      { title: '有效期', key: 'validityDate', width: 150 },
      { title: '创建时间', key: 'createTimeText', width: 135 },
      { title: '签订人', key: 'signingUserName', minWidth: 80, maxWidth: 100 },
      { title: '跟进人', key: 'followUserName', minWidth: 80, maxWidth: 100 },
      { title: '状态', key: 'approveStatus', width: 60, enum: true },
      { title: '操作', slot: 'action', width: 120 }
    ] as ColumnExtra[]
  }

  editRoute(action: string, id = 0) {
    const params: any = { action }
    id > 0 && (params.id = id)
    return {
      name: 'contract-edit',
      params
    }
  }

  // 作废
  async cancel(id: number) {
    await confirm('确定要作废该项吗？')
    try {
      await auditItem(id, { approveStatus: 4 })
      toast('操作成功')
      this.listPage.update()
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
// 通过
/deep/ .enum-key-2 {
  color: #19be6b;
}

// 拒绝
/deep/ .enum-key-3 {
  color: #e20;
}

// 作废
/deep/ .enum-key-4 {
  color: #ccc;
}
</style>
