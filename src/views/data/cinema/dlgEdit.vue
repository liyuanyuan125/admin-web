<template>
  <Modal v-model="inner.show" :width="700" :loading="submitLoading" @on-ok="submit">
    <Form :model="item" :label-width="78" :rules="rules" class="form" ref="form"
      v-show="!loading">
      <Row>
        <Col span="16">
          <FormItem label="影城名称" prop="shortName" :error='shortNameError'>
            <Input v-model="item.shortName" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="专资ID" prop="code">
            <Input v-model="item.code" placeholder="请输入"/>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="16">
          <FormItem label="官方名称" prop="officialName">
            <Input v-model="item.officialName" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="控制状态" prop="controlStatus">
            <Select v-model="item.controlStatus">
              <Option v-for="it in enumType.controlStatusList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="16">
          <FormItem label="院线" prop="chainId">
            <CinemaChainSelect v-model="item.chainId"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="影院等级" prop="gradeCode">
            <Select v-model="item.gradeCode" clearable>
              <Option v-for="it in enumType.gradeList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row class="row-address">
        <Col span="10">
          <FormItem label="公司地址" prop="area">
            <AreaSelect v-model="item.area" noSelf/>
          </FormItem>
        </Col>
        <Col span="14">
          <FormItem class="form-item-address">
            <Input v-model="item.address" placeholder="详细地址"/>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="10">
          <FormItem label="售票系统" prop="softwareCode">
            <Select v-model="item.softwareCode" clearable>
              <Option v-for="it in enumType.softwareList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="邮编" prop="zipCode" :label-width="58">
            <Input v-model="item.zipCode" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="营业状态" prop="status">
            <Select v-model="item.status">
              <Option v-for="it in enumType.statusList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="inner-loading flex-mid" v-if="loading">
      <TinyLoading :size="88"/>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryItem, addItem, updateItem } from '@/api/cinema'
import TinyLoading from '@/components/TinyLoading.vue'
import AreaSelect from '@/components/AreaSelect.vue'
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import { slice } from '@/fn/object'
import { toast } from '@/ui/modal'
import { filterItemInList, filterListByControlStatus } from '@/util/dealData'
import { cloneDeep } from 'lodash'

interface Value {
  show: boolean
  id: number
}

interface KeyTextControlStatus {
  key: string | number
  text: string
  controlStatus: number
}

interface KeyTextControlStatusMap {
  [key: string]: KeyTextControlStatus[]
}

const defItem: any = {
  id: 0,
  shortName: '',
  code: '',
  officialName: '',
  controlStatus: 0,
  chainId: 0,
  gradeCode: '',
  provinceId: 0,
  cityId: 0,
  countyId: 0,
  address: '',
  softwareCode: '',
  zipCode: '',
  status: 0,

  // 辅助字段，提交的时候，应该去掉
  area: [ 0, 0, 0 ],
}

const defValue: Value = {
  show: false,
  id: -1
}

@Component({
  components: {
    TinyLoading,
    AreaSelect,
    CinemaChainSelect,
  }
})
export default class DlgEdit extends ViewBase {
  @Prop({ type: Object, default: () => ({ ...defValue }), required: true }) value!: Value

  inner: Value = { ...defValue }

  loading = false

  submitLoading = true

  item: any = cloneDeep(defItem)

  enumType: KeyTextControlStatusMap = {
    gradeList: [],
    softwareList: [],
    statusList: [],
    controlStatusList: [],
  }

  shortNameError = ''

  // TODO: 临时解决某些组件的验证问题，正常情况下，应该使这些组件避免过度发 change 事件
  preventValidateError = true

  get rules() {
    const self = this
    return {
      shortName: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      officialName: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      chainId: [
        {
          required: true,
          trigger: 'change',
          type: 'number',
          validator(rule: any, value: number, callback: any) {
            if (self.preventValidateError) {
              return callback()
            }
            value > 0 ? callback() : callback(new Error('不能为空'))
          }
        }
      ],
      area: [
        {
          required: true,
          trigger: 'change',
          type: 'array',
          validator(rule: any, value: number[], callback: any) {
            if (self.preventValidateError) {
              return callback()
            }
            const strVal = (value || []).join('')
            ; /^0*$/.test(strVal) ? callback(new Error('不能为空')) : callback()
          }
        }
      ],
    }
  }

  resetSubmitLoading() {
    this.submitLoading = false
    this.$nextTick(() => this.submitLoading = true)
  }

  async submit() {
    const valid = await (this.$refs.form as any).validate()
    if (!valid) {
      return this.resetSubmitLoading()
    }
    try {
      const data = { ...this.item }
      delete data.area
      const res = data.id ? await updateItem(data) : await addItem(data)
      toast(data.id ? '更新成功' : '创建成功')
      this.$emit('done')
      this.inner.show = false
    } catch (ex) {
      this.resetSubmitLoading()
      this.handleError(ex)
    }
  }

  created() {
    this.load()
  }

  async load() {
    const { show, id } = this.inner
    if (!show || id < 0) {
      return
    }

    this.preventValidateError = true

    this.loading = true
    try {
      const query = { id }
      const { data } = await queryItem(query)

      this.enumType = filterListByControlStatus({
        ...this.enumType,
        ...slice(data, Object.keys(this.enumType))
      })

      this.item = filterItemInList({
        ...defItem,
        ...slice(data.item, Object.keys(defItem))
      }, {
        gradeCode: this.enumType.gradeList,
        softwareCode: this.enumType.softwareList,
      }, defItem)

      // 清除非法的 chainId
      if (data.item && data.item.chainControlStatus != 1) {
        this.item.chainId = defItem.chainId
      }

      const { provinceId = 0, cityId = 0, countyId = 0 } = this.item
      this.item.area = [ provinceId, cityId, countyId ]

      // 默认选中第一个
      if (this.item.status == 0) {
        this.item.status = this.enumType.statusList[0].key
      }
      if (this.item.controlStatus == 0) {
        this.item.controlStatus = this.enumType.controlStatusList[0].key
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false

      // 很短时间后，设置 this.preventValidateError 为 false
      setTimeout(() => {
        this.preventValidateError = false
      }, 588)
    }
  }

  // 关闭时清空所有错误
  resetFieldsOnClose() {
    if (!this.value.show) {
      this.preventValidateError = true
      ; (this.$refs.form as any).resetFields()
    }
  }

  @Watch('value', { deep: true })
  watchValue(value: Value) {
    this.inner = value
    this.load()
    this.resetFieldsOnClose()
  }

  @Watch('inner', { deep: true })
  watchInner(value: Value) {
    this.$emit('input', value)
  }

  @Watch('item.area', { deep: true })
  watchArea(val: number[]) {
    if (this.item != null) {
      this.item.provinceId = val[0]
      this.item.cityId = val[1]
      this.item.countyId = val[2]
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  margin-top: 18px;
  padding-right: 28px;
}
.row-address {
  /deep/ .area-select {
    width: 100%;
  }
  .form-item-address {
    position: relative;
    padding-left: 8px;
    /deep/ .ivu-form-item-content {
      margin-left: 0 !important;
    }
  }
}
.inner-loading {
  min-height: 302px;
}
</style>
