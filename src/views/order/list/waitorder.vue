<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='600'
    :title="'设为待接单'"
    @on-cancel="cancel" >
      <ListPage
      v-if ='showlist == true'
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      selectable
      :selectedIds.sync = "selectedIds"
      disableUrlManager
      ref="listPage">
      </ListPage>
      已选{{selectedIds.length}}条数据
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop  , Watch} from 'vue-property-decorator'
import { chgstatus } from '@/api/orderSys'
import { warning , success, toast , info , confirm } from '@/ui/modal'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'
import { queryList , cinemaList } from '@/api/orderSys'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
const dataForm = {
  settlementAmount: '',
}

@Component({
    components: {
        ListPage,
    }
})
export default class ComponentMain extends ViewBase {
  // fetch = cinemaList
  showDlg = false
  id = 0
  items: any = null

  showlist = false

  selectedIds: any[] = []

  filters: Filter[] = [
    {
      name: 'status',
      defaultValue: 3
    },
    {
      name: 'pageIndex',
      defaultValue: 1
    },
    {
      name: 'pageSize',
      defaultValue: 10
    },
  ]

  get columns() {
     return [
        // {type: 'selection', width: 50},
        { title: '专资编码', key: 'code', width: 80, align: 'center' },
        { title: '影院名称', key: 'shortName', align: 'center' },
        { title: '接单状态', key: 'status', align: 'center', width: 90 , enum: true},
     ] as ColumnExtra[]
  }

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  async init(id: number) {
    this.showDlg = true
    this.id = id
    this.showlist = true
  }

  fetch(query: any) {
    const list = cinemaList(this.id, query)
    return list
  }

  get enums() {
    return [
      'statusList',
    ]
  }

  cancel() {
    this.showDlg = false
    this.showlist = false
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    if (this.selectedIds.length == 0) {
      info('请选择影院')
      return
    }
    await confirm('设为待接单时将同步删除该订单的监播、上刊等数据；是否确认？')
    try {
      const res = await chgstatus ({id : this.id , cinemaIds: this.selectedIds})
      toast('成功')
      this.showDlg = false
      this.showlist = false
      this.$emit('done')
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
      this.showlist = false
    }
  }

}
</script>

<style lang="less" scoped>
</style>
