<template>
  <div class="message-page">
    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage" v-if="isAlive">
      <template slot="action" slot-scope="{ row: { id, status } }">
        <div class="row-acts">
          <a v-if=" status == '1' || status == '2' " @click="editDialogHandler(id)">登记处理结果</a>
          <a v-if=" status == '3' || status == '2' " @click="showDialogHandler(id)">查看处理信息</a>
        </div>
      </template>
      <template slot="createTime" slot-scope="{row}">
        <span>{{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
      <template slot="updateTime" slot-scope="{row}">
        <span>{{ moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
    </ListPage>
    <EditDialog v-if='editDialogVisible' okText='确定' title='登记处理结果' :fields="fields" :fetch="editFetch" :submit="editSubmit" ref="editDlg" >
    </EditDialog>
    <EditDialog v-if='showDialogVisible' okText='关闭' title='查看处理结果' :fields="showDlgFfields" :fetch="editFetch" :submit="editSubmit2" ref="showDlg" >
    </EditDialog>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import AreaSelect, { areaParam } from './components/areaSelect'
import RemarkTextarea from './components/RemarkTextarea.vue'
import LogTable from './components/LogTable.vue'
import jsxReactToVue from '@/util/jsxReactToVue'
import { queryList, queryItem, updateItem } from '@/api/message'
import { formatConversion } from '@/util/validateRules'
import { cloneDeep } from 'lodash'
import { confirm, info } from '@/ui/modal.ts'
import moment from 'moment'
import EditDialog, { Field } from './components'

@Component({
  components: {
    ListPage,
    EditDialog,
    AreaSelect,
    RemarkTextarea,
    LogTable
  }
})
export default class Main extends ViewBase {
  moment = moment
  isAlive = true
  loading = false

  showStatus: any = false
  editDialogVisible: boolean = false
  showDialogVisible: boolean = false

  get createRules() {
    const self = this
    return {
      shortName: [{ required: true, message: '不能为空', trigger: 'blur' }],
      code: [{ required: true, message: '不能为空', trigger: 'blur' }]
    }
  }

  fetch = queryList

  editFetch = queryItem

  filters: Filter[] = [
    {
      name: 'contactName',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '联系人姓名'
    },
    {
      name: 'contactTel',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '联系人电话'
    },
    {
      name: 'companyName',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '公司名称'
    },
    {
      ...areaParam,
      type: AreaSelect,
      props: {
        maxLevel: 2,
      },
      width: 160,
      placeholder: '公司所在省市',
      defaultValue: [0, 0],
      dealParam: ([provinceId, cityId]: number[]) => ({
        provinceId: provinceId || 0,
        cityId: cityId || 0,
      }),
      backfillParam: ({ provinceId, cityId }: any) => [
        provinceId || 0,
        cityId || 0,
      ]
    },
    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      width: 85,
      placeholder: '状态',
      enumKey: 'statusList'
    },
    {
      name: 'dateRange',
      defaultValue: '',
      type: 'dateRange',
      width: 200,
      placeholder: '留言日期',
      dealParam(value: string) {
        const [beginCreateTime, endCreateTime] = value ? value.split('-') : [null, null]
        // console.log( beginCreateTime, endCreateTime )
        if ( beginCreateTime && endCreateTime) {
          return {
            beginCreateTime: moment(beginCreateTime as string).unix(),
            endCreateTime: moment(endCreateTime as string).unix()
          }
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

  fields: Field[] = [
    {
      name: 'id',
      defaultValue: 0
    },
    {
      name: 'contactName',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '联系人姓名',
      placeholder: '联系人姓名',
      // width: 405
      props: {
        disabled: true,
      },
    },
    {
      name: 'contactTel',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '联系人电话',
      placeholder: '联系人电话',
      // width: 405
      props: {
        disabled: true,
      },
    },
    {
      name: 'companyName',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '公司名称',
      placeholder: '公司名称',
      // width: 405
      props: {
        disabled: true,
      },
    },
    {
      name: 'address',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '公司地址',
      placeholder: '公司地址',
      // width: 405
      props: {
        disabled: true,
      },
    },
    {
      name: 'remark',
      defaultValue: '',
      type: RemarkTextarea,
      label: '备注',
      minWidth: 600,
      props: {
        disabled: true,
      },
    },
    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      label: '状态',
      props: {
        disabled: false,
      },
      defaultEnumIndex: 0,
      width: 205
    },
    {
      name: 'newRemark',
      defaultValue: '',
      type: RemarkTextarea,
      label: '备注',
      minWidth: 600,
    },
  ]

  showDlgFfields: Field[] = [
    {
      name: 'id',
      defaultValue: 0
    },
    {
      name: 'contactName',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '联系人姓名',
      placeholder: '联系人姓名',
      // width: 405
      props: {
        disabled: true,
      },
    },
    {
      name: 'contactTel',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '联系人电话',
      placeholder: '联系人电话',
      // width: 405
      props: {
        disabled: true,
      },
    },
    {
      name: 'companyName',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '公司名称',
      placeholder: '公司名称',
      // width: 405
      props: {
        disabled: true,
      },
    },
    {
      name: 'address',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '公司地址',
      placeholder: '公司地址',
      // width: 405
      props: {
        disabled: true,
      },
    },
    {
      name: 'remark',
      defaultValue: '',
      type: 'input',
      span: 12,
      label: '备注',
      placeholder: '备注',
      minWidth: 600,
      props: {
        disabled: true,
      },
    },
    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      label: '状态',
      props: {
        disabled: true,
      },
      span: 8,
      defaultEnumIndex: 0,
      // width: 405
    },
    {
      name: 'id',
      defaultValue: -1,
      type: LogTable,
      label: '操作详情',
      minWidth: 700,
    }
  ]

  enums = [
    'statusList'
  ]

  get columns() {
    return [
      { title: '序号', key: 'id', width: 65 },
      { title: '联系人姓名', key: 'contactName', width: 100 },
      { title: '联系人电话', key: 'contactTel', width: 120 },
      { title: '公司名称', key: 'companyName', minWidth: 150 },
      { title: '公司所在省份', key: 'provinceName', width: 100 },
      { title: '公司所在城市', key: 'cityName', width: 100 },
      { title: '备注', key: 'remark', minWidth: 200 },
      { title: '留言时间', slot: 'createTime', width: 140 },
      { title: '最后处理时间', slot: 'updateTime', width: 140 },
      { title: '最后处理人', key: 'updateName', width: 120 },
      // { title: '申请时间', slot: 'createTime', width: 140 },
      { title: '状态', key: 'status', editor: 'enum', width: 80 },
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  editDialogHandler(id: number = 0) {
    this.editDialogVisible = true
    this.$nextTick(() => {
      const editor = this.$refs.editDlg as EditDialog
      editor.show({ id }).done((data: any) => {
        (this.$refs.listPage as any).update()
      })
    })
  }

  showDialogHandler(id: number = 0) {
    this.showDialogVisible = true
    this.$nextTick(() => {
      const editor = this.$refs.showDlg as EditDialog
      editor.show({ id }).done((data: any) => {
        (this.$refs.listPage as any).update()
      })
    })
  }

  editSubmit(data: any) {
    const id = data.id
    const query = {
      status: data.status,
      remark: data.newRemark || 'test'
    }
    return updateItem(id, query)
  }

  editSubmit2(data: any) {
    // console.log(data)
    // todo
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
.message-page {
  /deep/ .i-select-apply-type {
    // display: block;
  }
}
.tips-box {
  padding: 15px;
  color: red;
}
</style>
