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
        >广告主管理</Button>
      </template>

      <template slot="year" slot-scope="{row: {year, month}}">
        <span>{{year}}-{{month && String(month).length == 1 ? `0${month}` : month}}</span>
      </template>

      <template slot="operate" slot-scope="{row: {billStatus, id}}">
        <div class="operate-btn">
          <span @click="$router.push({name: 'finance-billmanage-detail', params: {id}})">详情</span><br />
          <span v-if="billStatus == 1"
           @click="$router.push({name: 'finance-billmanage-confirmbill', params: {id}})">确定运营账单</span>

           <span v-if="billStatus == 3"
           @click="$router.push({name: 'finance-billmanage-confirmbill', params: {id}})">确定审核账单</span>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { querylist } from '@/api/ggsiter'

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
      name: 'shortName',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '广告主名称'
    },

    {
      name: 'resourceId',
      defaultValue: 0,
      type: 'input',
      width: 100,
      placeholder: '广告主身份'
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
    { title: '广告主名称', key: 'name', minWidth: 100 },
    { title: '广告主身份', key: 'code', minWidth: 60 },
    { title: '客户等级', key: 'resourceName', minWidth: 60 },
    { title: '客户类型', key: 'contractNo', minWidth: 100 },
    { title: '关联销售', slot: 'year', minWidth: 60 },
    { title: '推荐人电话', key: 'createTime', minWidth: 100, editor: 'dateTime'},
    { title: '创建时间', key: 'showCount', minWidth: 60 },
    { title: '更新时间', key: 'personCount', minWidth: 60 },
    { title: '更新人', key: 'amount', minWidth: 100 },
    { title: '状态', key: 'billStatus', minWidth: 60, editor: 'enum'},
    { title: '审核状态', key: 'invoiceStatus', minWidth: 60, editor: 'enum'},
    { title: '操作', slot: 'operate', minWidth: 90 },
  ]

  editShow(id?: any) {
    this.$router.push({
      name: 'client-ggiser-edit',
      params: {
        id
      }
    })
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