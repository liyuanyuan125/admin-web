<template>
  <div class="list-enum">
    <div v-if="!isArray">
      <div v-if="!readonly">
        <Poptip
          v-model="show"
          @on-popper-show="onShow"
          @on-popper-hide="onHide"
          v-if="!loading"
        >
          <span class="edit">
            <span :class="parts[0].classes">{{parts[0].text}}</span>
            <icon type="ios-create-outline"/>
          </span>
          <div slot="content">
            <div class="flex-box">
              <div class="flex-1">
                <Select v-model="model" size="small">
                  <Option v-for="it in validList" :key="it.key"
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
      </div>
      <span :class="parts[0].classes" v-else>{{parts[0].text}}</span>
    </div>
    <span class="enum-list" v-else>
      <span
        v-for="part in parts"
        :key="part.key"
        :class="part.classes"
      >{{part.text}}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { filterByControlStatus } from '@/util/dealData'
import { KeyTextControlStatus } from '@/util/types'
import { hasPerm } from '@/store'
import { devWarn } from '@/util/dev'

@Component
export default class ListEnum extends ViewBase {
  /** 枚举值 */
  @Prop({ type: [Number, String, Array], default: 0 })
  value!: number | string | Array<number | string>

  /** 枚举列表 */
  @Prop({ type: Array, default: () => [] }) enumList!: KeyTextControlStatus[]

  /** 更新字段的函数 */
  @Prop({ type: Function }) updateField?: (value: any) => Promise<any>

  /** 权限值，用来控制是否可以编辑 */
  @Prop({ type: String, default: '' }) auth!: string

  model = this.value

  show = false

  loading = false

  hasPerm = true

  get isArray() {
    return Array.isArray(this.model)
  }

  get validList() {
    const list = filterByControlStatus(this.enumList)
    return list
  }

  get readonly() {
    return this.updateField == null || !this.hasPerm
  }

  get parts() {
    const keys = Array.isArray(this.model) ? this.model : [ this.model ]
    const enumList = this.enumList
    const validList = this.validList
    const result = keys.map(key => {
      const text = (enumList.find(it => it.key == key) || { text: '' }).text
      const found = validList.find(it => it.key == key)
      const deprecated = found == null
      return {
        key,
        text,
        deprecated,
        classes: {
          deprecated,
          [`enum-key-${key}`]: true
        }
      }
    })
    return result
  }

  onShow() {
    debugger
  }

  onHide() {
    debugger
  }

  async onOk() {
    this.show = false
    const value = this.model
    const oldValue = this.value
    const updateField = this.updateField
    if (value != oldValue && updateField != null) {
      try {
        this.loading = true
        await updateField(value)
        this.$emit('afterUpdateField', { value })
      } catch (ex) {
        this.handleError(ex)
      } finally {
        this.loading = false
      }
    }
  }

  checkValue() {
    if (Array.isArray(this.value) && !this.readonly) {
      devWarn('ListEnum 组件，暂时不支持对一组数据进行编辑')
    }
  }

  @Watch('value', { deep: true })
  watchValue(value: number | string | Array<number | string>) {
    this.model = value
    this.checkValue()
  }

  @Watch('auth', { immediate: true })
  watchAuth(value: string) {
    // 若 auth 为空，则认为是有权限的
    this.$nextTick(async () => {
      const has = value !== '' ? await hasPerm(value) : true
      this.hasPerm = has
    })
  }

  @Watch('readonly', { immediate: true  })
  watchReadonly() {
    this.checkValue()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

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

.enum-list {
  & > span ~ span {
    margin-left: 1em;
  }
}
</style>
