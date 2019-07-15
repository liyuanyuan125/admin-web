<template>
  <div class="brand-page">
    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage" v-if="isAlive">
      <template slot="action" slot-scope="{ row: { id, status } }">
        <div class="row-acts">
          <a v-if=" status == '15' " @click="editShow(id)">取消关联</a>
          <router-link v-if=" status=='5' " :to="{ name: 'client-brand-detail', params: { id } }">审核</router-link>
          <router-link v-if=" status=='-1' || status=='10' || status=='15' " :to="{ name: 'client-brand-detail', params: { id } }">查看</router-link>
        </div>
      </template>
      <template slot="createTime" slot-scope="{row}">
        <span>{{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
      <template slot="modifyTime" slot-scope="{row}">
        <span>{{ moment(row.modifyTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
    </ListPage>
    
    <EditDialog :fields="fields" :fetch="editFetch" :submit="editSubmit" ref="editDlg" >
      <template slot="other">
        <div class="tips-box">
          取消关联品牌后，品牌商不可在前台编辑品牌信息。
        </div>
      </template>
    </EditDialog>

  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import BrandsSelect from './brandSelect.vue'
import jsxReactToVue from '@/util/jsxReactToVue'
import { queryList, queryItem, updateItem } from '@/api/clientBrand'
import { formatConversion } from '@/util/validateRules'
import { cloneDeep } from 'lodash'
import { confirm, info } from '@/ui/modal.ts'
import moment from 'moment'
import EditDialog, { Field } from './components'

@Component({
  components: {
    ListPage,
    BrandsSelect,
    EditDialog,
  }
})
export default class Main extends ViewBase {
  moment = moment
  isAlive = true
  loading = false

  showStatus: any = false
  showedit: any = false

  get createRules() {
    const self = this
    return {
      shortName: [{ required: true, message: '不能为空', trigger: 'blur' }],
      code: [{ required: true, message: '不能为空', trigger: 'blur' }]
    }
  }

  fetch = queryList
  filters: Filter[] = [
    {
      name: 'brandId',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '品牌ID'
    },
    {
      name: 'brandName',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '品牌名称待处理'
    },
    // {
    //   name: 'brandName',
    //   defaultValue: 0,
    //   type: BrandsSelect,
    //   width: 168,
    //   minWidth: 168
    // },
    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      width: 85,
      placeholder: '状态',
      enumKey: 'brandRelationStatus'
    },
    {
      name: 'applyType',
      defaultValue: 0,
      type: 'select',
      width: 150,
      placeholder: '申请方式',
      enumKey: 'brandRelationType'
    },
    {
      name: 'companyId',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '公司ID'
    },
    {
      name: 'companyName',
      defaultValue: '',
      type: 'input',
      width: 200,
      placeholder: '公司名称'
    },
    {
      name: 'dateRange',
      defaultValue: '',
      type: 'dateRange',
      width: 200,
      placeholder: '选择时间',
      dealParam(value: string) {
        const [applyStartTime, applyEndTime] = value ? value.split('-') : [null, null]
        return {
          applyStartTime,
          applyEndTime
        }
      }
    }
  ]

  fields: Field[] = [
    {
      name: 'id',
      defaultValue: 0
    },
    {
      name: 'companyId',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '公司ID',
      placeholder: '公司ID',
      // width: 405
    },
    {
      name: 'companyName',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '公司名称',
      placeholder: '公司名称',
      // width: 405
    },
    {
      name: 'brandId',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '品牌id',
      placeholder: '品牌id',
      // width: 405
    },
    {
      name: 'brandName',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '品牌中文名',
      placeholder: '品牌中文名称',
      // width: 405
    },
    {
      name: 'brandEnName',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '品牌外文名',
      placeholder: '品牌外文名称',
      // width: 405
    },
  ]

  enums = [
    'brandRelationType',
    'brandRelationStatus'
  ]

  get columns() {
    return [
      { title: '序号', key: 'id', width: 65 },
      { title: '公司ID', key: 'companyId', width: 80 },
      { title: '公司名称', key: 'companyName', minWidth: 120 },
      { title: '品牌ID', key: 'brandId', width: 80 },
      { title: '品牌中文名称', key: 'brandName', minWidth: 120 },
      { title: '申请方式', minWidth: 100, key: 'applyType', editor: 'enum', enumKey: 'brandRelationType' },
      { title: '申请时间', slot: 'createTime', width: 140 },
      { title: '最后更新时间', slot: 'modifyTime', width: 140 },
      { title: '状态', width: 80, key: 'status', editor: 'enum', enumKey: 'brandRelationStatus'},
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  editFetch = queryItem

  editShow(id = 0) {
    const editor = this.$refs.editDlg as EditDialog
    editor.show({ id }).done((data: any) => {
      (this.$refs.listPage as any).update()
    })
  }

  editSubmit(data: any) {
    return updateItem(data)
  }
}
</script>

<style lang="less" scoped>
.companies:only-child:empty::before {
  content: '-';
}

.approve-radio {
  margin: 15px 0;
}

.label-dese {
  display: block;
  width: 40px;
}

// 自定义样式
.brand-page {
  /deep/ .i-select-apply-type {
    // display: block;
  }
}
.tips-box {
  padding: 15px;
  color: red;
}
</style>
