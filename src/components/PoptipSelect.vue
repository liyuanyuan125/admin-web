<template>
  <Poptip v-model="show" @on-popper-show="onShow" v-if="!loading">
    <span class="edit">
      {{inValue.text}}
      <icon type="ios-create-outline"/>
    </span>
    <div slot="content">
      <div class="flex-box">
        <div class="flex-1">
          <Select v-model="inValue.value" size="small">
            <Option v-for="it in inValue.list" :key="it.key"
              :value="it.key">{{it.text}}</Option>
          </Select>
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
import ViewBase from '@/util/ViewBase'
import { filterByControlStatus } from '@/util/dealData'

interface KeyTextControlStatus {
  key: number | string
  text: string
  controlStatus: number
}

interface Value {
  id: string
  text: string
  value: number | string
  list: KeyTextControlStatus[]
}

@Component
export default class PoptipSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Object, default: () => {} }) value!: Value

  inValue: Value = {} as Value

  show = false

  loading = false

  @Watch('value', { deep: true })
  watchValue() {
    this.syncValue()
  }

  mounted() {
    this.syncValue()
  }

  onShow() {
    this.syncValue()
  }

  syncValue() {
    this.inValue = this.filterList(this.value)
  }

  filterList(val: Value) {
    const result = { ...val }
    result.list = filterByControlStatus(result.list)
    return result
  }

  onOk() {
    this.show = false
    const { id, value } = this.inValue
    const { value: oldValue } = this.value
    if (value != oldValue) {
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
}
</script>

<style lang="less" scoped>
@import '../site/lib.less';

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
