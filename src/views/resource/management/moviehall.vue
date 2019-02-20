<template>
  <Modal 
    v-model='showDlg'
    :transfer='false'
    :width='620'
    title='添加关联影厅'
    :mask-closable='false'
    @on-cancel="cancel"
    >
    <Row v-if="dataLoading">
      <Col class="demo-spin-col" span="22">
        <Spin fix>
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </Col>
    </Row>
    <div v-else class="hall-header">
      <CheckboxGroup v-model="hallcheck">
        <div v-if="hallList.length>0">
          <div v-for="(item) in hallList" :key="item.id" class="check">
            <Checkbox :label="item.id">{{item.name}} ({{typeList[item.typeCode]}})</Checkbox>
          </div>
          <div v-if="(hallList.length%4) == 3" class="check">&nbsp;</div>
        </div>
        <div v-else class="text-center">
          暂无数据
        </div>
      </CheckboxGroup>
    </div>
    <div  slot="footer" class="dialog-footer">
      <Button type="primary" @click="done()">关联</Button>
      <Button @click="cancel()">取消</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { cinemaCldList } from '@/api/rateCard'
import { toMap } from '@/fn/array'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')

@Component
export default class Main extends ViewBase {
  showDlg = false
  modelCheck: any = []
  hallcheck: any = []
  hallList: any = []
  typeList: any = []
  id: any = ''
  dataLoading = false

  async init(id: any, inhallCheck: any) {
    this.dataLoading = false
    this.id = id
    this.hallcheck = inhallCheck
    try {
      const {
        data: {
          item,
          typeList
        }
      } = await cinemaCldList(id)
      this.hallList = item.halls || []
      this.typeList = makeMap(typeList)
      this.showDlg = true
      this.dataLoading = false
    } catch (ex) {
      this.handleError(ex)
    }
  }

  cancel() {
    this.showDlg = false
  }

  done() {
    const hallname = this.hallList.map((item: any) => item.name)

    this.$emit('done', {
      id: this.id,
      hallcheck: this.hallcheck,
      hallName: hallname
    })
    this.showDlg = false
  }
}
</script>

<style lang="less" scoped>
.hall-header {
  min-height: 200px;
  overflow-y: auto;
  /deep/ .check {
    position: relative;
    width: 48%;
    padding-left: 5%;
    float: left;
    .cinema-icon-left {
      position: absolute;
      top: 5px;
      right: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }
  /deep/ .check:nth-child(4n - 1) {
    background: #f0faff;
  }
  /deep/ .check:nth-child(4n) {
    background: #f0faff;
  }
  .text-center {
    text-align: center;
    line-height: 200px;
  }
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  height: 200px;
  position: relative;
}
</style>
