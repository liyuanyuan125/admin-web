<template>
  <div class="page">
      <form class="form-list" @submit.prevent="search">
          <LazyInput v-model="query.cinemaName" placeholder="影片名称" class="input"/>
          <LazyInput v-model="query.cinemaID" placeholder="影片专资id" class="input"/>
          <Select v-model="query.exhibition" filterable clearable placeholder="影片上映" class="select-company">
            <Option v-for="it in exhibitionFilm" :key="it.key" :value="it.key">{{it.text}}</Option>
          </Select>
          <Select v-model="query.exhibition" filterable clearable placeholder="资源形式" class="select-company">
            <Option v-for="it in resourceFormat" :key="it.key" :value="it.key">{{it.text}}</Option>
          </Select>
          <Select v-model="query.cinemaStatus" filterable clearable placeholder="状态" class="select-company">
            <Option v-for="it in exhibitionFilm" :key="it.key" :value="it.key">{{it.text}}</Option>
          </Select>
           <Button type="default" class="btn-reset"  @click="reset">清空</Button>
      </form>
      <div class="batch-btn">
        <Button type="primary" @click="handleAudit" class="btn">批量审核</Button>
        <Button type="primary" @click="$router.push({name: 'resource-film-edit'})" class="btn">新建影片资源</Button>
      </div>

      <Table :columns="columns" :data="list" :loading="loading"  border stripe disabled-hover size="small"
      class="table" @on-select-all="allSelect" @on-selection-change="handleSelect" >
      <template slot="status" slot-scope="{row}">
          <span v-for="item in cinemaStatus" v-if="item.key == row.status">{{item.text}}</span>
      </template>
      <template slot="operate" slot-scope="{row}">
          <div class="operate-btn">
              <span>审核</span>
              <span>编辑</span>
              <span>查看</span>
          </div>
      </template>
      </Table>

      <Page :total="total" :current="page.pageIndex" :page-size="page.pageSize" class="page-list"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="size => page.pageIndex = size"
        @on-page-size-change="size => page.pageSize = size"/>
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
@Component
export default class Main extends ViewBase {
    total = 3
    page = {
        pageIndex: 1,
        pageSize: 1
    }

    query = {}
    loading = false

    // 批量审核
    auditCheck: any[] = []
    visibleAudit = false
    auditOpinion = ''
    desc = ''

    // 影片上映
    exhibitionFilm = [
        {key: 1, text: '正在上映'},
        {key: 2, text: '暂未上映'}
    ]
    // 资源形式
    resourceFormat = [
        {key: 1, text: '授权海报'},
        {key: 2, text: '电影票券'},
    ]
    // 影片状态
    cinemaStatus = [
      { key: 1, text: '待审核'},
      { key: 2, text: '审核通过'},
      { key: 3, text: '审核不通过'}
    ]
    columns = [
        {type: 'selection', width: 50, align: 'center'},
        {title: '影片名称', key: 'cinemaName', minWidth: 100, align: 'center'},
        {title: '影片专资id', key: 'cinemaID', minWidth: 100, align: 'center'},
        {title: '影片上映情况', key: 'cinemaBeOn', minWidth: 100, align: 'center'},
        {title: '资源形式', key: 'resourceFormat', minWidth: 80, align: 'center'},
        {title: '创建时间', key: 'createTime', minWidth: 100, align: 'center'},
        {title: '状态', slot: 'status', minWidth: 100, align: 'center'},
        {title: '操作', slot: 'operate', minWidth: 120, align: 'center'},
    ]
    list = [
        {
            cinemaName: 'xxxxx',
            cinemaID: 'xxxxx',
            cinemaBeOn: 'xxxxxxxx',
            resourceFormat: 'xxxxx',
            createTime: 'xxxxx',
            status: 1,
            id: 1,
        },
        {
            cinemaName: 'xxxxx',
            cinemaID: 'xxxxx',
            cinemaBeOn: 'xxxxxxxx',
            resourceFormat: 'xxxxx',
            createTime: 'xxxxx',
            status: 2,
            id: 2,
        },
        {
            cinemaName: 'xxxxx',
            cinemaID: 'xxxxx',
            cinemaBeOn: 'xxxxxxxx',
            resourceFormat: 'xxxxx',
            createTime: 'xxxxx',
            status: 3,
            id: 3
        },
    ]

    async handleAudit() {
        if (this.auditCheck.length == 0) {
            await info('请选择数据审核')
            return
        }
        this.visibleAudit = true
    }
    reset() {}
    search() {}
    allSelect(option: any[]) {
         this.auditCheck = option.map((item: any) => item.id)
    }
    handleSelect(option: any[]) {
         this.auditCheck = option.map((item: any) => item.id)
    }
    handleSubmit() {}

    @Watch('query', {deep: true})
    watchQuery() {
        this.page.pageIndex = 1
        this.search()
    }

    @Watch('page', {deep: true})
    watchPage() {
        this.search()
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
</style>