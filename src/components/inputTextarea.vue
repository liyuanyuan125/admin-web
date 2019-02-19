<template>
  <div class="component">
    <Row>
      <Col>
        <div class="input" v-if="type == 'text'">
          <Input v-model="invalue" @input="remark"/>
          <span style="pointer-events: none" :class="{ red: minlength > 30}">{{minlength}}/{{maxLength}}</span>
        </div>
        <div v-else class="input-area">
          <Input v-model="invalue" @input="remark" placeholder="请输入" type="textarea" :rows="4" />
          <span style="pointer-events: none" :class="{ red: minlength > 30}">{{minlength}}/{{maxLength}}</span>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getSize } from '@/fn/string.ts'

@Component
export default class ComponentMain extends ViewBase {
  @Prop({ type: Number, default: () => 30}) maxLength: any
  @Prop({type: String, default: () => 'text'}) type: any
  @Prop({type: String, default: () => ''}) value: any
  invalue = ''

  get minlength() {
    return getSize(this.invalue)
  }
  remark() {
    this.$emit('input', this.invalue)
  }
}
</script>

<style lang="less" scoped>
.input {
  span {
    position: absolute;
    margin-left: 6px;
    float: right;
  }
}
.input-area {
  position: relative;
  span {
    position: absolute;
    right: 0;
    bottom: -30px;
    color: #ccc;
  }
}
.red {
  color: red;
}
</style>
