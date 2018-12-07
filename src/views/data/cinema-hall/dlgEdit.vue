<template>
  <Modal v-model="inValue.showDlgEdit" :transfer="false" :width="700"
    :loading="submitLoading" @on-ok="submit">
    <Form :model="item" :label-width="98" :rules="rules" class="form" ref="form">
      <Row>
        <Col span="16">
          <FormItem label="影厅名称" prop="name" :error="nameError">
            <Input v-model="item.name" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="控制状态" prop="controlStatus">
            <Select v-model="item.controlStatus">
              <Option v-for="it in enumType.cstatusList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="8">
          <FormItem label="影厅类型" prop="type">
            <Select v-model="item.type">
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
          <FormItem label="影厅业务类型" prop="businessType" clearable>
            <Select v-model="item.businessType">
              <Option v-for="it in enumType.businessTypeList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="8">
          <FormItem label="放映机类型" prop="projectorType">
            <Select v-model="item.projectorType">
              <Option v-for="it in enumType.projectorTypeList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="机位" prop="placement">
            <Select v-model="item.placement">
              <Option v-for="it in enumType.placementList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="放映机分辨率" prop="projectorResolution">
            <Select v-model="item.projectorResolution">
              <Option v-for="it in enumType.projectorResolutionList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="8">
          <FormItem label="放映机品牌" prop="projectorBrand">
            <Select v-model="item.projectorBrand">
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
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { queryItem, addItem, updateItem } from '@/api/cinemaHall'
import { slice } from '@/fn/object'
import { toast } from '@/ui/modal'

interface Value {
  id: string
  showDlgEdit: boolean
}

interface Enum {
  key: number
  text: string
}

const defItem = {
  id: '',
  name: '',
  type: '',
  seats: 0,
  businessType: '',

  projectorType: '',
  placement: '',
  projectorResolution: '',
  projectorBrand: '',
  projectorModel: '',
  projectorNumber: '',

  controlStatus: 0,
}

@Component
export default class DlgEdit extends View {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Object, default: () => {} }) value!: Value

  /**
   * 影院 ID
   */
  @Prop({ type: String, default: '', required: true }) cinemaId!: string

  inValue: Value = this.value

  loading = false

  submitLoading = true

  item: any = {}

  enumType: any = {
    typeList: [],
    businessTypeList: [],
    projectorTypeList: [],
    placementList: [],
    projectorResolutionList: [],
    projectorBrandList: [],
    cstatusList: [],
  }

  nameError = ''

  seatsError = ''

  get rules() {
    return {
      name: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      seats: [
        { required: true, message: '不能为空', trigger: 'blur', type: 'integer' }
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
      setTimeout(() => {
        this.$emit('done')
        this.inValue.showDlgEdit = false
      }, 588)
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
    this.loading = true
    const query = { id: this.value.id }
    try {
      const { data } = await queryItem(query)

      this.item = { ...defItem, ...slice(data.item, Object.keys(defItem)) }

      this.enumType = {
        ...this.enumType,
        ...slice(data, Object.keys(this.enumType))
      }

      // 默认选中第一个
      if (this.item.controlStatus == 0) {
        this.item.controlStatus = this.enumType.cstatusList[0].key
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  @Watch('value')
  watchValue(val: Value) {
    this.inValue = val
  }

  @Watch('inValue', { deep: true })
  watchInValue(val: Value) {
    this.$emit('input', val)
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
</style>
