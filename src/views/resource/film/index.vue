<template>
  <div class="page">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      @selectionChange="selectionChange"
      ref="listPage">
      <template slot="acts">
        <div class="table-btn">
          <Button  type="success" icon="md-add-circle" @click="handleAudit">批量审核</Button>
          <Button  type="success" icon="md-add-circle" @click="$router.push({name: 'resource-film-index-edit'})">新建影片资源</Button>
        </div>
      </template>
      <template slot="operate" slot-scope="{row}">
        <span @click="$router.push({name: 'resource-film-index-detail', params: {id: row.id, audit: 1}})">审核</span>
        <span @click="$router.push({name: 'resource-film-index-edit', params: {id: row.id}})">编辑</span>
        <span @click="$router.push({name: 'resource-film-index-detail', params: {id: row.id}})">查看</span>
      </template>
    </ListPage>
    
    <Modal v-model="visibleAudit" width="500" title="批量审核操作" class="audit-modal" @on-ok="handleSubmit" >
        <p>您选择了{{auditCheck.length}}条片商资源申请</p>
        <RadioGroup class="audit-radio" v-model="auditOpinion"> <Radio label="1">审核通过</Radio> <Radio label="2">审核不通过</Radio> </RadioGroup>
        <p class="flex-box"  v-if="auditOpinion == 2">
          <span class="label-dese">备注：</span>
          <Input v-model="desc" type="textarea" placeholder="请输入备注"></Input>
        </p>
    </Modal>
  </div>
</template>

<script lang='ts'>
import {Component, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info } from '@/ui/modal.ts'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from '@/api/cinema'

@Component({
  components: {
    ListPage
  }
})
export default class Main extends ViewBase {
  fetch = queryList
  filters: Filter[] = [
    {
      name: 'name',
      defaultValue: '',
      type: 'input',
      width: 140,
      placeholder: '影院名称'
    },
    {
      name: 'id',
      defaultValue: '',
      type: 'input',
      width: 140,
      placeholder: '影院专资id'
    },
    {
      name: 'pricingLevelCode',
      defaultValue: '',
      type: 'select',
      width: 140,
      placeholder: '影片上映情况',
      enumKey: 'pricingLevelCode'
    },
    {
      name: 'controlStatus',
      defaultValue: '',
      type: 'select',
      width: 140,
      placeholder: '资源形式',
      enumKey: 'controlStatusList'
    },
    {
      name: 'status',
      defaultValue: '',
      type: 'select',
      width: 140,
      placeholder: '状态',
      enumKey: 'statusList'
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
    'pricingLevelList', // 影片客厅
    'controlStatusList', // 上下架
    'statusList',
  ]

  get columns() {
    return [
      {type: 'selection', width: 50},
      {title: '影片名称', key: 'shortName', minWidth: 150},
      {title: '影片专资id', key: 'id', minWidth: 100},
      {title: '影片上映情况', key: 'pricingLevelCode', minWidth: 100, editor: 'enum'},
      {title: '资源形式', key: 'controlStatus', minWidth: 80, editor: 'enum'},
      {title: '创建时间', key: 'createTime', minWidth: 100, editor: 'dateTime'},
      {title: '状态', key: 'status', minWidth: 100, editor: 'enum'},
      {title: '操作', slot: 'operate', minWidth: 120},
    ] as ColumnExtra[]
  }

  // 批量审核
  auditCheck: any[] = []
  visibleAudit = false
  auditOpinion = ''
  desc = ''
  // 批量审核
  async handleAudit() {
    if (this.auditCheck.length == 0) {
        await info('请选择数据审核')
        return
    }
    this.visibleAudit = true
  }
  // table 全选
  async selectionChange(list: any) {
    this.auditCheck = list.map((item: any) => item.id)
  }
  handleSubmit() {}
}

</script>

<style lang='less' scoped>
@import '../less/common.less';
.audit-radio {
  margin: 15px 0;
}
.label-dese {
  display: block;
  width: 40px;
}
</style>