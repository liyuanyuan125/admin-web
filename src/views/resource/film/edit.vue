<template>
  <div>
    <Form class="create-form form-item" ref="refform" :model="form" :rules="rule" :label-width="120">
      <div class="modal-item">
        <FormItem label="选择影片:" prop="cinemaName">
          <Select v-model="form.cinemaName" filterable remote :remote-method="remoteMethod" :loading="loading" placeholder="请选择资源关联的影片" >
            <option v-for="item in filmList" :key="item.key" :value="item.key">{{item.text}}</option>
          </Select>
        </FormItem>
      </div>
      <div class="modal-item">
          <h2>图片/视频类无聊</h2>
          <FormItem label="物料下载地址：">
            <Input v-model="form.downUrl" placeholder="下载地址" class="input"/>
          </FormItem>
          <FormItem label="资源使用说明：">
            <Input v-model="form.desc" type="textarea" :rows="4" placeholder="使用说明" />
          </FormItem>
      </div>
      <div class="modal-item">
          <h2>导入券资源</h2>
          <FormItem label="已有的电子券" v-if="editID">
            <Table :columns="columns" :data="dataList" border stripe disabled-hover size="small" class="table" ></Table>
          </FormItem>
          <FormItem label="导入电子券：">
            上传execl
          </FormItem>
          <FormItem label="资源使用说明：">
            <Input v-model="form.desc" type="textarea" :rows="4" placeholder="使用说明" />
          </FormItem>
      </div>
      <div class="batch-btn text-center">
          <Button type="primary" class="btn" @click="handleSubmit('form')"> 提交</Button>
          <Button> 取消</Button>
      </div>
    </Form>
    
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Main extends ViewBase {
  form = {
    cinemaName: ''
  }
  loading = false

  filmList = [
    {key: 1, text: '影片1'},
    {key: 2, text: '影片2'},
    {key: 3, text: '影片3'},
    {key: 4, text: '影片4'},
  ]

  editID = ''

  columns = [
    { title: '导入时间', key: 'importTime', align: 'center'},
    { title: '导入数量', key: 'importNum', align: 'center'},
    { title: '已占用数量', key: 'usedQuantity', align: 'center'},
    { title: '剩余可用数量', key: 'remainingQuantity', align: 'center'},
  ]
  dataList = []

  get rule() {
    return {
      cinemaName: [
        {
          required: true,
          message: '请选择',
          trigger: 'blur',
        }
      ]
    }
  }
  mounted() {
    this.editID = this.$route.params.id
  }
  // 模糊查询关联影片
  remoteMethod(query: string) {
    if (query != '') {
      this.loading = true
      // 模糊查询 从新赋值给filmList
    }
  }

  // 提交数据
  async handleSubmit(form: any) {
    const validate = await (this.$refs.refform as any).validate()
  }
}

</script>
<style lang='less' scoped>
@import '../less/common.less';
.create-form {
  font-size: 14px;
}
</style>