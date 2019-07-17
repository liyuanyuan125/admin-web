<template>
  <div class="edit-form">
    <Form
      :model="item"
      :key="formKey"
      :label-width="labelWidth"
      :rules="rules"
      class="form"
      :style="{ visibility: loading ? 'hidden' : 'visible' }"
      :loading="submitLoading"
      @submit.native.prevent="onSubmit"
      ref="form"
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
          >
            <FormItem
              :label="it.label"
              :prop="it.name"
              :error="errorMap[it.name]"
              :class="it.class"
              v-auth="it.auth"
              v-if="it.visible(item)"
            >
              <component
                v-model="item[it.name]"
                :is="it.component"
                :enumList="enumMap[it.name] || []"
                :disabled="!!it.disabled"
                v-bind="it.props"
              >
              </component>
            </FormItem>
          </Col>
        </section>
      </fieldset>

      <div class="submit-line">
        <slot name="submit">
          <Button
            type="primary"
            html-type="submit"
            class="button-submit"
          >{{submitText}}</Button>

          <Button
            type="primary"
            class="button-return"
            @click="goback"
          >{{returnText}}</Button>
        </slot>
      </div>
    </Form>

    <div class="inner-loading flex-mid" v-show="loading">
      <TinyLoading :size="38" />
    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { MapType, AjaxResult, isAjaxResult, KeyTextControlStatus } from '@/util/types'
import TinyLoading from '@/components/TinyLoading.vue'
import {
  Field,
  normalizeField,
  normalizeAndGroupField,
  Rule,
  FetchData,
  FetchResult,
  fetchDataToResult,
  EditErrorHandlers
} from './types'
import { cloneDeep, isEqual, isEmpty } from 'lodash'
import { defaultParams, dealParams, backfillParams } from '@/util/param'
import { slice } from '@/fn/object'
import { filterByControlStatus, filterItemInList } from '@/util/dealData'
import { random } from '@/fn/string'
import { scrollToError } from '@/util/form'

@Component({
  components: {
    TinyLoading
  }
})
export default class EditForm extends ViewBase {
  /** 字段配置 */
  @Prop({ type: Array, default: () => [] }) fields!: Field[]

  /** 加载编辑项的请求函数 */
  @Prop({ type: Function }) fetch!: (query?: any) => Promise<FetchData | FetchResult>

  /** 初始化数据 */
  @Prop({ type: Object, default: () => ({}) }) initData!: object

  /** 查询字段列表，默认为 id，可以使用以逗号分隔的字符串，指定多个字段，例如：key1,key2 */
  @Prop({ type: String, default: 'id' }) queryKeys!: string

  /** 提交请求函数 */
  @Prop({ type: Function }) submit!: (data: any) => Promise<AjaxResult>

  /** 表单 label 宽度 */
  @Prop({ type: Number, default: 76 }) labelWidth!: number

  /** 错误处理 */
  @Prop({ type: Object, default: () => ({}) }) errorHandlers!: EditErrorHandlers

  /** 提交按钮文本 */
  @Prop({ type: String, default: '提交' }) submitText!: string

  /** 返回按钮文本 */
  @Prop({ type: String, default: '返回' }) returnText!: string

  // 用来预防 form 被重用，确保每次都使用新的实例
  formKey = random('editForm')

  loading = false

  submitLoading = true

  item: any = {}

  defItem: any = {}

  enumMap: MapType<KeyTextControlStatus[]> = {}

  errorMap: MapType = {}

  get normalFields() {
    const list = normalizeField(this.fields)
    return list
  }

  get groupFields() {
    const group = normalizeAndGroupField(this.fields)
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

  init(initData = {}) {
    const item = defaultParams(this.fields)
    this.defItem = cloneDeep(item)
    this.item = cloneDeep({ ...item, ...initData })
    this.formKey = random('editForm')
    this.errorMap = Object.keys(this.item).reduce(
      (map, key) => {
        map[key] = ''
        return map
      },
      {} as MapType
    )
  }

  // 简单包装一下，以便适应两种数据结构
  async fetchWrap(query: any) {
    const res = await this.fetch(query)
    return fetchDataToResult(res)
  }

  async load() {
    if (this.fetch == null) {
      return
    }

    this.loading = true
    try {
      const query = slice(this.item, this.queryKeys)
      const { data } = await this.fetchWrap(query)

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
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  async onSubmit() {
    const form = this.$refs.form as any
    const valid = await form.validate()
    if (!valid) {
      return scrollToError(form)
    }

    if (this.submit == null) {
      return
    }

    const item = { ...this.item }

    try {
      const data = dealParams(this.fields, item)
      const res = await this.submit(data)
      this.$emit('done', res && res.data)
    } catch (ex) {
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
    }
  }

  setError(name: string, error: string) {
    this.errorMap[name] = error
  }

  @Watch('initData', { deep: true, immediate: true })
  watchInitData(value: object) {
    this.init(value)
    this.load()
  }
}
</script>

<style lang="less" scoped>
.edit-form {
  position: relative;
  padding: 0 0 38px 0;
  max-width: 1200px;
}

.form {
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
  /deep/ .ivu-form-item-label {
    user-select: none;
  }
  /deep/ .ivu-form-item-content {
    line-height: 1;
  }
  /deep/ .form-text {
    padding: 10px 12px 10px 0;
  }
  /deep/ .form-radio {
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
  position: absolute;
  top: 18px;
  left: 0;
  width: 100%;
  height: 100%;
}

.col-no-label {
  /deep/ .ivu-form-item-content {
    margin-left: 8px !important;
  }
}

each(range(23), {
  .col-offset-right-@{value} {
    margin-right: (100% / 24 * @value);
  }
});
</style>
