<template>
    <Modal v-model="visible" title="操作日志" width="800px">
      <div class="base-mess logs max-height">
          <h2 class="title">操作日志</h2>
          <p v-for="(item, index) in logList" :key="index">
            <span>{{item.createUserName}}</span>
            <span>{{item.createTime}}</span>
            <span>{{item.description}}</span>
          </p>
      </div>
      <div slot="footer">
          <Button @click="visible = false">关闭</Button>
      </div>
    </Modal>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Main extends ViewBase {
  @Prop({ type: Function}) fetch!: any

  visible = false
  logList = []

  async mounted() {
    const data = await this.fetch()
    this.logList = data
  }

  public show() {
    this.visible = true
  }
}

</script>
<style lang='less' scoped>
@import '~@/views/data/person/less/common.less';
.max-height {
  height: 600px;
  max-height: 600px;
  overflow-y: scroll;
}

/deep/ .ivu-modal-footer {
  text-align: center;
}
</style>