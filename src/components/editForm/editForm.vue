<template>
  <div class="edit-form">
    <Form
      :model="item"
      :key="formKey"
      :label-width="labelWidth"
      :rules="rules"
      :style="{ visibility: loading ? 'hidden' : 'visible' }"
      :loading="submitLoading"
      @submit.native.prevent="onSubmit"
      class="form"
      ref="form"
      v-if="!loading && item"
    >
      <fieldset
        v-for="group in groupFields"
        :key="group.name"
        class="form-group"
      >
        <h3 class="group-name" v-if="group.name">{{group.name}}</h3>
        <section class="field-section">
          <Col
            v-for="it in group.list"
            :key="it.name"
            :span="it.span"
            :offset="it.offsetLeft"
            :class="it.colClass"
            :style="it.style"
            v-if="it.visibleCol(item)"
          >
            <FormItem
              :label="it.label"
              :label-width="it.labelWidth"
              :prop="it.name"
              :error="errorMap[it.name]"
              :class="it.class"
              v-auth="it.auth"
              v-if="it.visible(item)"
            >
              <component
                v-model="item[it.name]"
                :is="it.component"
                :disabled="!!it.disabled"
                v-bind="{
                  enumList: newEnumMap[it.enumKey] || enumMap[it.name],
                  ...it.props
                }"
                v-on="it.handlers"
              />
            </FormItem>
          </Col>
        </section>
      </fieldset>

      <div class="submit-line">
        <slot name="submit">
          <Button
            type="primary"
            html-type="submit"
            size="large"
            class="button-submit"
            v-if="!hideSubmit"
          >{{submitText}}</Button>

          <Button
            type="default"
            size="large"
            class="button-return"
            @click="goback"
            v-if="!hideReturn"
          >{{returnText}}</Button>
        </slot>
      </div>
    </Form>

    <div class="inner-loading" v-show="loading">
      <TinyLoading :size="38" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import {
  MapType,
  AjaxResult,
  isAjaxResult,
  KeyTextControlStatus,
  isKeyTextEnum
} from '@/util/types'
import TinyLoading from '@/components/TinyLoading.vue'
import {
  Field,
  normalizeField,
  normalizeAndGroupField,
  Rule,
  FetchData,
  FetchResult,
  fetchDataToResult,
  EditErrorHandlers,
  WatchParam,
  WatchOptionsWithHandler
} from './types'
import { cloneDeep, isEqual, isEmpty } from 'lodash'
import { defaultParams, dealParams, backfillParams } from '@/util/param'
import { slice } from '@/fn/object'
import { filterByControlStatus, filterItemInList } from '@/util/dealData'
import { random } from '@/fn/string'
import { scrollToError } from '@/util/form'
import { devLog } from '@/util/dev'

const randomKey = () => random('editForm')

@Component({
  components: {
    TinyLoading
  }
})
export default class EditForm extends ViewBase {
  /** 字段配置 */
  @Prop({ type: Array, default: () => [] }) fields!: Field[]

  /** 加载编辑项的请求函数 */
  @Prop({ type: Function }) fetch!: () => Promise<FetchData | FetchResult>

  /** 提交请求函数 */
  @Prop({ type: [Function, Boolean] }) submit!: (data: any) => Promise<AjaxResult | any>

  /** 表单 label 宽度 */
  @Prop({ type: Number, default: 76 }) labelWidth!: number

  /** 错误处理 */
  @Prop({ type: Object, default: () => ({}) }) errorHandlers!: EditErrorHandlers

  /** 是否隐藏提交按钮 */
  @Prop({ type: Boolean, default: false }) hideSubmit!: boolean

  /** 提交按钮文本 */
  @Prop({ type: String, default: '提交' }) submitText!: string

  /** 是否隐藏返回按钮 */
  @Prop({ type: Boolean, default: false }) hideReturn!: boolean

  /** 返回按钮文本 */
  @Prop({ type: String, default: '返回' }) returnText!: string

  /** scrollToErrorOffsetTop */
  @Prop({ type: Number, default: -60 }) scrollToErrorOffsetTop!: number

  /** 内部使用，是否在 editDialog 内 */
  @Prop({ type: Boolean, default: false }) inDialog!: boolean

  // 用来预防 form 被重用，确保每次都使用新的实例
  formKey = randomKey()

  loading = false

  submitLoading = true

  public item: any = null

  defItem: any = {}

  // 旧版枚举类型，慢慢优化掉
  enumMap: MapType<KeyTextControlStatus[]> = {}

  // 新版的筛选枚举，旧版会被慢慢重构掉
  newEnumMap: MapType<KeyTextControlStatus[]> = {}

  errorMap: MapType = {}

  unwatches: any[] = []

  get normalFields() {
    const list = normalizeField(this.fields)
    return list
  }

  get groupFields() {
    const item = this.item
    if (item == null) {
      return []
    }
    const group = normalizeAndGroupField(this.fields, item)
    return group
  }

  get rules() {
    const result = cloneDeep(this.normalFields).reduce(
      (map, it) => {
        map[it.name] = it.rules || []
        return map
      },
      {} as MapType<Rule[]>
    )
    return result
  }

  /**
   * 获取正在编辑的数据
   */
  public getData() {
    return cloneDeep(this.item)
  }

  // 简单包装一下，以便适应两种数据结构
  async fetchWrap() {
    const res = await this.fetch()
    const result = fetchDataToResult(res)
    return result
  }

  public async load() {
    if (this.fetch == null) {
      return
    }

    this.loading = true
    try {
      const { data } = await this.fetchWrap()

      this.initFields()

      // TODO: 老式 enumMap，基于 enumKey 属性，将慢慢优化掉
      const enumMap = this.normalFields
        .filter(it => !!it.enumKey)
        .reduce(
          (map, it) => {
            map[it.name] = filterByControlStatus(data[it.enumKey!])
            return map
          },
          {} as MapType<KeyTextControlStatus[]>
        )
      this.enumMap = enumMap

      // 新版 enumMap，自动判断，不再依赖配置中的 enumKey
      // TODO: 可以清理对 enumKey 的提升代码
      const enumList = Object.entries(data).filter(([key, list]) => isKeyTextEnum(list))
      const newEnumMap = enumList.reduce(
        (map, [name, list]) => {
          map[name] = list
          return map
        },
        {} as MapType<KeyTextControlStatus[]>
      )
      this.newEnumMap = newEnumMap

      const defItem = this.defItem

      // 回填数据：执行自定义的回填逻辑
      const filledItem = backfillParams(this.fields, data.item)

      // 过滤掉非法或废弃的值
      const item = filterItemInList(
        {
          ...defItem,
          ...slice(filledItem, Object.keys(defItem))
        },
        enumMap,
        defItem
      )

      // 处理自动选中
      this.fields
        .filter(it => it.defaultEnumIndex != null)
        .map(({ name, defaultValue, defaultEnumIndex }) => {
          // 如果没有被选中，则执行自动选中
          if (item[name] == defaultValue) {
            item[name] = enumMap[name][defaultEnumIndex!].key
          }
        })

      this.item = item

      this.initWatches()

      // 允许外部代码，获取内部属性的引用
      this.$emit('inspect', { item, enumMap })
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  initFields() {
    const item = defaultParams(this.fields)
    this.defItem = cloneDeep(item)
    this.errorMap = Object.keys(item).reduce(
      (map, key) => {
        map[key] = ''
        return map
      },
      {} as MapType
    )
  }

  initWatches() {
    // 取消监听原有的
    this.unwatches.forEach(handler => handler())

    const unwatches = this.normalFields
    .filter(it => it.watch != null)
    .map(({ name, watch }) => {
      const exp = `item.${name}`
      const { handler, deep, immediate } = watch as WatchOptionsWithHandler
      const unwatch = this.$watch(
        exp,
        (value: any, oldValue: any) => handler(value, {
          vm: this,
          oldValue,
          item: this.item,
        }),
        { deep, immediate }
      )
      return unwatch
    })
    this.unwatches = unwatches
  }

  public async onSubmit() {
    const form = this.$refs.form as any
    const valid = await form.validate()
    if (!valid) {
      this.$emit('validateFail')
      return this.inDialog || scrollToError(form, {
        offsetTop: this.scrollToErrorOffsetTop
      })
    }

    if (typeof this.submit !== 'function') {
      return
    }

    const item = cloneDeep(this.item)

    const intent = { preventSubmit: false, item }
    this.$emit('beforeSubmit', intent)
    if (intent.preventSubmit) {
      this.$emit('submitPrevented')
      return
    }

    try {
      const data = dealParams(this.fields, item, {
        cleanList: [null, undefined]
      })
      const res = await this.submit(data)
      const eventData = isAjaxResult(res) ? res.data : res
      this.$emit('done', eventData)
    } catch (ex) {
      this.$emit('fail', ex)
      if (isAjaxResult(ex) && (ex.code in this.errorHandlers)) {
        const handler = this.errorHandlers[ex.code]
        const errorData = typeof handler === 'function' ? handler(ex, { item }) : handler
        if (!isEmpty(errorData)) {
          Object.entries(errorData).forEach(([ name, error ]) => {
            this.setError(name, error)
          })
          return
        }
      }
      this.handleError(ex)
    } finally {
      this.$emit('always')
    }
  }

  setError(name: string, error: string) {
    this.errorMap[name] = error
  }

  goback() {
    this.$router.back()
  }

  created() {
    this.formKey = randomKey()
    this.load()
  }
}
</script>

<style lang="less" scoped>
.edit-form {
  position: relative;
  max-width: 1200px;
}

.form {
  padding-bottom: 38px;
  &::after {
    content: '';
    display: block;
    clear: both;
  }
  /deep/ .ivu-col {
    display: inline-block;
    vertical-align: top;
    float: none;
  }
  /deep/ .col-field-auto-width {
    width: auto;
    margin-right: 10px;
  }
  /deep/ .ivu-form-item-label {
    user-select: none;
  }
  /deep/ .ivu-form-item-content {
    line-height: 1;
  }
  /deep/ .form-text {
    padding: 10px 12px 10px 0;
  }
  /deep/ .form-radio,
  /deep/ .form-check {
    padding: 9px 12px 9px 0;
  }
  /deep/ .form-switch {
    margin-top: 5px;
  }
  /deep/ .ivu-input-group {
    top: 0;
  }
}

.form-group {
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 15px;
}

.group-name {
  font-size: 14px;
}

.field-section {
  margin-top: 24px;
}

.inner-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  text-align: center;
  padding-top: 42vh;
}

.col-no-label {
  /deep/ .ivu-form-item-content {
    margin-left: 8px !important;
  }
}

.submit-line {
  margin: 30px 0;
  text-align: center;
  user-select: none;
  /deep/ .ivu-btn {
    margin: 0 15px;
    padding: 8px 26px;
  }
  /deep/ span {
    user-select: none;
  }
}

each(range(23), {
  .col-offset-right-@{value} {
    margin-right: (100% / 24 * @value);
  }
});
</style>
