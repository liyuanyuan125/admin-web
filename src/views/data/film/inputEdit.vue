<template>
  <Poptip v-model="show" v-if="!loading">
    <span class="edit">
      {{inValue.text}}
      <icon type="ios-create-outline"/>
    </span>
    <div slot="content">
      <div class="flex-box">
        <div class="flex-1">
          <Input v-model="inValue.value" size="small" placeholder="" style="width: 80px" />
        </div>
        <Button type="primary" size="small" class="btn-ok" @click="onOk">修改</Button>
      </div>
    </div>
  </Poptip>
  <span class="loading-box" v-else>
    <Spin>
      <Icon type="ios-loading" class="loading"></Icon>
    </Spin>
  </span>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import View from '@/util/View'

interface Item {
  key: number
  text: string
}

interface Value {
  id: string
  text: any
  value: any
}

@Component
export default class PartPoptipEdit extends View {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Object, default: () => {} }) value!: Value

  inValue: Value = this.value

  show = false

  loading = false

  @Watch('value')
  watchValue(val: Value) {
    this.inValue = val
  }

  @Watch('inValue', { deep: true })
  watchInValue(val: Value) {
    this.$emit('input', val)
  }

  onOk() {
    this.show = false
    const { id, value } = this.inValue
    this.$emit('change', {
      id,
      value,
      showLoading: () => {
        this.loading = true
      },
      hideLoading: () => {
        this.loading = false
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

.edit {
  cursor: pointer;
  .ivu-icon {
    position: relative;
    top: -2px;
    left: 2px;
    color: @c-base;
    font-size: 18px;
  }
}
.btn-ok {
  margin-left: 5px;
}
.loading-box {
  display: inline-block;
}
.loading {
  font-size: 16px;
  animation: ring 1s linear infinite;
}
@keyframes ring {
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
</style>
