<template>
  <Modal v-model="inner.show" :width="700" :loading="submitLoading" @on-ok="submit">
    <Form :model="item" :label-width="98" :rules="rules" class="form" ref="form"
      v-show="!loading">
      <Row>
        <Col span="16">
          <FormItem label="影厅名称" prop="name" :error="nameError">
            <Input v-model="item.name" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="8" v-auth="'theater.halls:change-control-status'">
          <FormItem label="控制状态" prop="controlStatus">
            <Select v-model="item.controlStatus">
              <Option v-for="it in enumType.controlStatusList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="8">
          <FormItem label="影厅类型" prop="typeCode">
            <Select v-model="item.typeCode">
              <Option v-for="it in enumType.typeList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="座位数" prop="seats" :error="seatsError">
            <InputNumber v-model="item.seats" :min="0" :max="1000"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="影厅业务类型" prop="businessTypeCode">
            <Select v-model="item.businessTypeCode">
              <Option v-for="it in enumType.businessTypeList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="8">
          <FormItem label="放映机类型" prop="projectorTypeCode">
            <Select v-model="item.projectorTypeCode">
              <Option v-for="it in enumType.projectorTypeList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="机位" prop="placementCode">
            <Select v-model="item.placementCode">
              <Option v-for="it in enumType.placementList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="放映机分辨率" prop="projectorResolutionCode">
            <Select v-model="item.projectorResolutionCode">
              <Option v-for="it in enumType.projectorResolutionList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="8">
          <FormItem label="放映机品牌" prop="projectorBrandCode">
            <Select v-model="item.projectorBrandCode">
              <Option v-for="it in enumType.projectorBrandList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="放映机型号" prop="projectorModel">
            <Input v-model="item.projectorModel" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="放映机编号" prop="projectorNumber">
            <Input v-model="item.projectorNumber" placeholder="请输入"/>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="inner-loading flex-mid" v-if="loading">
      <TinyLoading :size="38"/>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryItem, addItem, updateItem } from '@/api/cinemaHall'
import TinyLoading from '@/components/TinyLoading.vue'
import { slice } from '@/fn/object'
import { toast } from '@/ui/modal'
import { filterItemInList, filterListByControlStatus } from '@/util/dealData'

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

const defItem = {
  id: '',
  name: '',
  typeCode: '',
  seats: 0,
  businessTypeCode: '',

  projectorTypeCode: '',
  placementCode: '',
  projectorResolutionCode: '',
  projectorBrandCode: '',
  projectorModel: '',
  projectorNumber: '',

  controlStatus: 0,
}

@Component({
  components: {
    TinyLoading
  }
})
export default class DlgEdit extends ViewBase {
  @Prop({ type: Object, default: () => {} }) value!: Value

  @Prop({ type: Number, default: 0, required: true }) cinemaId!: number

  inner: Value = this.value

  loading = false

  submitLoading = true

  item: any = {}

  enumType: KeyTextControlStatusMap = {
    typeList: [],
    businessTypeList: [],
    projectorTypeList: [],
    placementList: [],
    projectorResolutionList: [],
    projectorBrandList: [],
    controlStatusList: [],
  }

  nameError = ''

  seatsError = ''

  get rules() {
    return {
      name: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      typeCode: [
        { required: true, message: '不能为空', trigger: 'change' }
      ],
      seats: [
        { required: true, message: '不能为空', trigger: 'blur', type: 'integer', min: 1 }
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
      const res = data.id
        ? await updateItem(this.cinemaId, data)
        : await addItem(this.cinemaId, data)
      toast(data.id ? '更新成功' : '创建成功')
      this.$emit('done')
      this.inner.show = false
    } catch (ex) {
      const name = `submitError${ex.code}`
      name in this ? (this as any)[name](ex) : this.handleError(ex)
      this.resetSubmitLoading()
    }
  }

  submitError9004005(ex: any) {
    this.seatsError = this.formatError(ex)
  }

  mounted() {
    this.load()
  }

  async load() {
    const { show, id } = this.inner
    if (!show || id < 0) {
      return
    }

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
        typeCode: this.enumType.typeList,
        businessTypeCode: this.enumType.businessTypeList,
        projectorTypeCode: this.enumType.projectorTypeList,
        placementCode: this.enumType.placementList,
        projectorResolutionCode: this.enumType.projectorResolutionList,
        projectorBrandCode: this.enumType.projectorBrandList,
      }, defItem)

      // 默认选中第一个
      if (this.item.controlStatus == 0) {
        this.item.controlStatus = this.enumType.controlStatusList[0].key
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  // 关闭时清空所有错误
  resetFieldsOnClose() {
    if (!this.value.show) {
      (this.$refs.form as any).resetFields()
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

  @Watch('area')
  watchArea(val: string[]) {
    this.item.provinceId = val[0]
    this.item.cityId = val[1]
    this.item.countyId = val[2]
  }
}
</script>

<style lang="less" scoped>
.form {
  margin-top: 18px;
  padding-right: 28px;
}
.inner-loading {
  min-height: 227 + 18px;
}
</style>
