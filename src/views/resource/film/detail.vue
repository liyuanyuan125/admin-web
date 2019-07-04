<template>
  <div>
    <Form class="create-form form-item" :label-width="120">
      <div class="modal-item">
        <FormItem label="选择影片:" prop="cinemaName">{{detailList.name}}</FormItem>
      </div>
      <div class="modal-item">
          <h2>图片/视频类物料2</h2>
          <FormItem label="物料下载地址：">{{detailList.materialUrl}} </FormItem>
          <FormItem label="资源使用说明：">{{detailList.materialDescription}}</FormItem>
      </div>
      <div class="modal-item">
          <h2>导入券资源</h2>
          <FormItem label="已有的电子券">
            <Table :columns="columns" :data="dataList" border stripe disabled-hover size="small" class="table" ></Table>
          </FormItem>
          <FormItem label="资源使用说明："></FormItem>
      </div>
      <div class="modal-item">
          <h2>审核意见</h2>
          <div v-if="isAudit">
            <FormItem label="审核意见:">
              <RadioGroup v-model="auditOpinion"> <Radio label="1">审核通过</Radio> <Radio label="2">审核不通过</Radio> </RadioGroup>
            </FormItem>
            <FormItem label="备注:" v-if="auditOpinion == 2">
              <Input type="textarea" v-model="auditDesc" :rows="4" />
            </FormItem>
          </div>
          
          <Table v-else :columns="columnsAudit" :data="dataListAudit" border stripe disabled-hover size="small" class="table" ></Table>
      </div>

    </Form>
    <div class="batch-btn text-center">
      <Button v-if="isAudit" type="primary" @click="handleSubmit" class="btn">提交</Button>
      <Button v-if="isAudit" :to="{name: 'resource-film-index'}">取消</Button>
      <Button v-else :to="{name: 'resource-film-index'}">返回</Button>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryDetail } from '@/api/resourceFilm'

@Component
export default class Main extends ViewBase {
  // 详情id
  detailId = ''
  detailList: any = {}

  columns = [
    { title: '导入时间', key: 'importTime', align: 'center'},
    { title: '导入数量', key: 'importNum', align: 'center'},
    { title: '已占用数量', key: 'usedQuantity', align: 'center'},
    { title: '剩余可用数量', key: 'remainingQuantity', align: 'center'},
  ]
  dataList = []

  // 查看-审核意见
  columnsAudit = [
    {title: '操作类型', key: 'type', align: 'center'},
    {title: '操作时间', key: 'type', align: 'center'},
    {title: '操作人', key: 'type', align: 'center'},
    {title: '字段', key: 'type', align: 'center'},
    {title: '原值', key: 'type', align: 'center'},
    {title: '新值', key: 'type', align: 'center'},
  ]
  dataListAudit = []

  // 审核
  isAudit = ''
  auditOpinion = ''
  auditDesc = ''

  mounted() {
    this.isAudit = this.$route.params.audit
    this.detailId = this.$route.params.id
    this.queryDetailList()
  }
  async queryDetailList() {
    try {
      const { data } = await queryDetail(this.detailId)
      this.detailList = data
    } catch (ex) {
      this.handleError(ex)
    }
  }
  handleSubmit() {}
}

</script>
<style lang='less' scoped>
@import '../less/common.less';
.create-form {
  font-size: 14px;
}
</style>