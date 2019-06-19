<template>
  <Modal
    v-model="visible"
    :width="width"
    :loading="submitLoading"
    @on-ok="onSubmit"
  >
    <main class="modal-main">
      <Form
        :model="item"
        :key="formKey"
        :label-width="labelWidth"
        :rules="rules"
        class="form"
        :style="{ visibility: loading ? 'hidden' : 'visible' }"
        ref="form"
      >
        <Col
          v-for="it in normalFields"
          :key="it.name"
          :span="it.span"
          :class="{ 'col-no-label': !it.label }"
          :style="it.style"
        >
          <FormItem
            :label="it.label"
            :prop="it.name"
            :error="errorMap[it.name]"
            v-auth="it.auth"
          >
            <component
              v-model="item[it.name]"
              :is="it.component"
              :placeholder="it.placeholder"
              v-bind="it.props"
            >
              <Option
                v-for="sub in enumMap[it.name]"
                :key="sub.key"
                :value="sub.key"
                v-if="it.type == 'select'"
              >{{sub.text}}</Option>
            </component>
          </FormItem>
        </Col>
      </Form>

      <div class="inner-loading flex-mid" v-show="loading">
        <TinyLoading :size="38"/>
      </div>
    </main>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { MapType, AjaxResult, KeyTextControlStatus } from '@/util/types'
import TinyLoading from '@/components/TinyLoading.vue'
import { Field, normalizeField, Rule } from './types'
import { cloneDeep, isEqual } from 'lodash'
import { defaultParams, dealParams, backfillParams } from '@/util/param'
import { slice } from '@/fn/object'
import { filterByControlStatus, filterItemInList } from '@/util/dealData'
import { random } from '@/fn/string'

@Component({
  components: {
    TinyLoading
  }
})
export default class EditDialog extends ViewBase {
  /** 加载编辑项的请求函数 */
  @Prop({ type: Function, required: true }) fetch!: (query?: any) => Promise<AjaxResult>

  /** 查询字段列表，默认为 id，可以使用以逗号分隔的字符串，指定多个字段，例如：key1,key2 */
  @Prop({ type: String, default: 'id' }) queryKeys!: string

  /** 提交请求函数 */
  @Prop({ type: Function, required: true }) submit!: (data: any) => Promise<AjaxResult>

  /** 字段配置 */
  @Prop({ type: Array, default: () => [], required: true }) fields!: Field[]

  /** 对话框宽度 */
  @Prop({ type: Number, default: 770 }) width!: number

  /** 表单 label 宽度 */
  @Prop({ type: Number, default: 76 }) labelWidth!: number

  /** 过滤器，对字段进一步加工 */
  @Prop({ type: Function }) filter!: (item: any) => any

  visible = false

  // 用来预防 form 被重用，确保每次都使用新的实例
  formKey = random('editDialog')

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

  get rules() {
    const result = cloneDeep(this.fields).reduce(
      (map, it) => {
        if ((it.rules == null || it.rules.length == 0) && it.required) {
          const defaultValue = it.defaultValue
          it.rules = [
            {
              required: true,
              message: '不能为空',
              trigger: it.type == 'input' ? 'blur' : 'change',
              transform(value: any[]) {
                const equal = isEqual(value, defaultValue)
                return equal ? '' : 'not-empty'
              }
            }
          ]
        }
        map[it.name] = it.rules || []
        return map
      },
      {} as any
    )
    return result
  }

  created() {
    const item = defaultParams(this.fields)
    this.defItem = cloneDeep(item)
    this.item = cloneDeep(item)
    this.errorMap = Object.keys(item).reduce(
      (map, key) => {
        map[key] = ''
        return map
      },
      {} as MapType
    )
  }

  public show(data?: any) {
    this.item = cloneDeep({ ...this.defItem, ...data })
    this.visible = true
    this.formKey = random('editDialog')
    this.load()
    return this
  }

  public hide() {
    this.visible = false
    return this
  }

  public done(handler: (data: any) => any) {
    this.$once('done', handler)
    return this
  }

  async load() {
    this.loading = true
    try {
      const query = slice(this.item, this.queryKeys)
      const { data } = await this.fetch(query)

      // 从 select 中推断出所用枚举
      const enumMap = this.normalFields
        .filter(it => it.type == 'select')
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

      const finalItem = this.filter ? this.filter(item) : item
      this.item = finalItem
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  resetSubmitLoading() {
    this.submitLoading = false
    this.$nextTick(() => (this.submitLoading = true))
  }

  async onSubmit() {
    const valid = await (this.$refs.form as any).validate()
    if (!valid) {
      this.resetSubmitLoading()
      return
    }

    try {
      const item = { ...this.item }
      const data = dealParams(this.fields, item)
      const res = await this.submit(data)
      this.$emit('done', res && res.data)
      this.visible = false
    } catch (ex) {
      this.resetSubmitLoading()
      // TODO: custom error
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
.modal-main {
  position: relative;
  padding: 18px 28px 0 0;
}

.form {
  &::after {
    content: '';
    display: block;
    clear: both;
  }
  /deep/ .ivu-col {
    display: inline-block;
    float: none;
  }
  /deep/ .ivu-form-item-label {
    user-select: none;
  }
  /deep/ .ivu-form-item-content {
    line-height: 1;
  }
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
</style>
