<template>
  <Poptip v-model="show" @on-popper-show="onShow" v-if="!loading">
    <span class="edit">
      <span :class="{ deprecated: isDeprecated }">{{showText}}</span>
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
  value: number | string
  list: KeyTextControlStatus[]
  // text 可选，不提供，则使用 value 在 list 中查找
  text?: string
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

  // 是否是废弃的
  get isDeprecated() {
    // inValue 里的 list 是过滤过的，若查找不到，则说明是废弃的
    const { value, list = [] } = this.inValue
    const found = list.find(it => it.key == value)
    return found == null
  }

  get showText() {
    const { value, list = [], text } = this.inValue
    const result = text || (list.find(it => it.key == value) || { text: '' }).text
    return result
  }

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

.deprecated {
  position: relative;
  user-select: none;
  &:hover {
    color: transparent;
    &::before {
      position: absolute;
      left: 0;
      top: -2px;
      width: 100%;
      content: '已下架';
      color: #888;
    }
  }
}
</style>
