<template>
  <div>
    <Form class="create-form form-item" :label-width="120">
      <div class="modal-item">
        <FormItem label="选择影片:" prop="cinemaName">{{detailList.name}}</FormItem>
      </div>
      <div class="modal-item">
          <h2>图片/视频类物料</h2>
          <FormItem label="物料下载地址：">{{detailList.materialUrl}} </FormItem>
          <FormItem label="资源使用说明：">{{detailList.materialDescription}}</FormItem>
      </div>
      <div class="modal-item">
          <h2>导入券资源</h2>
          <FormItem label="已有的电子券">
            <Table :columns="columns" :data="detailList.couponBatches" border stripe disabled-hover size="small" class="table" ></Table>
          </FormItem>
          <FormItem label="资源使用说明：">
            <span>{{detailList.couponDescription}}</span>
          </FormItem>
      </div>
      <div class="modal-item">
          <h2>操作日志</h2>
          <p v-for="(item, index) in logs" :key="index">
            <span>{{item.user}}</span>
            <span>{{item.time}}</span>
            <span>{{item.descption}}</span>
          </p>
      </div>

    </Form>
    <div class="batch-btn text-center">
      <Button :to="{name: 'resource-film-index'}">返回</Button>
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
    { title: '导入时间', key: 'uploadTime', align: 'center'},
    { title: '导入数量', key: 'totalCount', align: 'center'},
    { title: '已占用数量', key: 'usedCount', align: 'center'},
    { title: '剩余可用数量', key: 'remainingCount', align: 'center'},
  ]
  dataList = []

  // 日志
  logs = []

  mounted() {
    this.detailId = this.$route.params.id
    this.queryDetailList()
  }
  async queryDetailList() {
    const data = await queryDetail(this.detailId)
    this.detailList = data || {}
    this.logs = data.logList || []
  }
}

</script>
<style lang='less' scoped>
@import '../less/common.less';
.create-form {
  font-size: 14px;
}
.logs {
  p {
    padding-bottom: 10px;
    span {
      padding-right: 10px;
    }
  }
}
</style>