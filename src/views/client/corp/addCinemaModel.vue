<template>
  <Modal 
    v-model='showDlg'
    :transfer='false'
    :width='720'
    title="添加关联影院"
    >
    <p class="cinema-header">注：因资源方类型为影院，因此仅能关联一家影院</p>
    <Row class="shouDlg-header">
      <Col span="9">
        <AreaSelect v-model="area"/>
      </Col>
      <Col span="9" offset="1">
         <Input v-model="value" placeholder="请输入影院名称" />
      </Col>
      <Button style="float:right" type="primary" @click="findClick">搜索</Button>
    </Row>
     <Table stripe style="border:0" :show-header='false' :loading="loading" :columns="columns" :data="cinemaList"></Table>
    <div  slot="footer" class="dialog-footer">
      <Button type="primary" @click="dataFormSubmit()">关联</Button>
      <Button @click="cancel()">取消</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import View from '@/util/View'

@Component
export default class Main extends View {
  showDlg: any = false
  loading = true
  value = ''
  area = ''
  cinemaList: any = []
  dataForm = {}
  columns: any = [
  ]
  init() {
    this.showDlg = true
    this.seach()
  }
  seach() {

  }
  dataFormSubmit() {

  }
  findClick() {

  }
  cancel(dataForms: string) {
    this.value = ''
    this.showDlg = false
  }
}
</script>

<style lang="less" scoped>
.cinema-header {
  position: absolute;
  top: 14px;
  left: 120px;
  font-size: 12px;
  color: #be1a22;
  font-weight: 400;
}
/deep/ .ivu-table-wrapper > .ivu-spin-fix {
  border: 0;
}
</style>
