<template>
  <div class="page">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      @selectionChange="selectionChange"
      ref="listPage">
      <template slot="acts-2">
        <div class="table-btn">
          <Button  type="primary" class="btn" @click="handleAudit">批量审核</Button>
          <Button  type="primary"  @click="$router.push({name: 'resource-film-index-edit'})">新建影片资源</Button>
        </div>
      </template>
      <template slot="materialUrl" slot-scope="{row: {material}}">
        <a :href="material.url" target="_brank">{{material.url}}</a>
      </template>
      <template slot="coupon" slot-scope="{row: {coupon}}">
        <span>{{reduceCoupon(coupon.batches)}}</span>
      </template>
      <template slot="operate" slot-scope="{row}">
        <div class="operate-btn">
          <span v-if="row.status == 1" @click="handleSingAudit(row.id)" >审核</span>
          <span @click="$router.push({name: 'resource-film-index-edit', params: {id: row.id}})">编辑</span>
          <span @click="$router.push({name: 'resource-film-index-detail', params: {id: row.id}})">查看</span>
        </div>
      </template>
    </ListPage>
    
    <Modal v-model="visibleAudit" width="500" title="批量审核操作" class="audit-modal" @on-ok="handleSubmit" >
        <p v-if="isSingFlag">您选择了1条片商资源申请</p>
        <p v-else>您选择了{{auditCheck.length}}条片商资源申请</p>
        <RadioGroup class="audit-radio" v-model="auditOpinion"> <Radio label="2">审核通过</Radio> <Radio label="3">审核不通过</Radio> </RadioGroup>
        <p class="flex-box"  v-if="auditOpinion == 3">
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
import { queryList, batchUpdate } from '@/api/resourceFilm'

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
      name: 'govId',
      defaultValue: '',
      type: 'input',
      width: 140,
      placeholder: '影片专资id'
    },
    {
      name: 'releaseStatus',
      defaultValue: '',
      type: 'select',
      width: 140,
      placeholder: '影片上映情况',
      enumKey: 'releaseStatusList'
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
    'releaseStatusList', // 影片上映情况
    'statusList',
  ]

  get columns() {
    return [
      {type: 'selection', width: 50},
      {title: '影片名称', key: 'name', minWidth: 150},
      {title: '影片专资id', key: 'id', minWidth: 100},
      {title: '影片上映情况', key: 'releaseStatus', minWidth: 100, editor: 'enum'},
      {title: '海报资源地址', slot: 'materialUrl', minWidth: 80},
      {title: '电子券资源总数量', slot: 'coupon', minWidth: 80},
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
  singAuditId: number = 0
  isSingFlag = false // 是否单个审核

  // 批量审核
  async handleAudit() {
    if (this.auditCheck.length == 0) {
        await info('请选择数据审核')
        return
    }
    this.visibleAudit = true
  }
  // 单个审核
  handleSingAudit(id: number) {
    this.visibleAudit = true
    this.isSingFlag = true
    this.singAuditId = id
  }
  // 电子卷总数量累加
  reduceCoupon(ary: any[]) {
    const reduceAry = ary.map((item: any) => {
      return item.totalCount
    })
    const count = reduceAry.reduce((prev, next) => prev + next)
    return count
  }
  // table 全选
  async selectionChange(list: any) {
    this.auditCheck = list.map((item: any) => item.id)
  }
  async handleSubmit() {
    let checkIds: any[] = []
    if (this.isSingFlag) {
      checkIds = [this.singAuditId]
    } else {
      checkIds = this.auditCheck
    }
    try {
      const { data } = await batchUpdate({
        movieResourceIds: checkIds,
        status: this.auditOpinion,
        reviewMessage: this.desc
      });
      (this.$refs.listPage as any).update()
    } catch (ex) {
      this.handleError(ex)
    }
  }
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
.table-btn {
  margin-top: 15px;
  .btn {
    margin-right: 15px;
  }
}
.operate-btn {
  span {
    cursor: pointer;
    margin: 0 6px;
  }
}
</style>