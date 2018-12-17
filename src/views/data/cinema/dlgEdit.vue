<template>
  <Modal v-model="inValue.showDlgEdit" :transfer="false" :width="700"
    :loading="submitLoading" @on-ok="submit">
    <Form :model="item" :label-width="78" :rules="rules" class="form" ref="form">
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
            <AreaSelect v-model="item.area"/>
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
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { queryItem, addItem, updateItem } from '@/api/cinema'
import AreaSelect from '@/components/AreaSelect.vue'
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import { slice } from '@/fn/object'
import { toast } from '@/ui/modal'
import { filterItemInList, filterListByControlStatus } from '@/util/dealData'

interface Value {
  id: string
  showDlgEdit: boolean
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
  id: '',
  shortName: '',
  code: '',
  officialName: '',
  controlStatus: 0,
  chainId: '',
  gradeCode: '',
  provinceId: '0',
  cityId: '0',
  countyId: '0',
  address: '',
  softwareCode: '',
  zipCode: '',
  status: 0,

  // 辅助字段，提交的时候，应该去掉
  area: [],
}

@Component({
  components: {
    AreaSelect,
    CinemaChainSelect,
  }
})
export default class DlgEdit extends View {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Object, default: () => {} }) value!: Value

  inValue: Value = this.value

  loading = false

  submitLoading = true

  item: any = {}

  enumType: KeyTextControlStatusMap = {
    gradeList: [],
    softwareList: [],
    statusList: [],
    controlStatusList: [],
  }

  shortNameError = ''

  get rules() {
    let areaFirstCall = true
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
        { required: true, message: '不能为空', trigger: 'change' }
      ],
      area: [
        {
          required: true,
          message: '不能为空',
          trigger: 'change',
          type: 'array',
          validator(rule: any, value: string[], callback: any) {
            if (areaFirstCall) {
              areaFirstCall = false
              return callback()
            }
            const strVal = (value || []).join('')
            strVal === '000' ? callback(new Error('不能为空')) : callback()
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
      this.inValue.showDlgEdit = false
    } catch (ex) {
      this.resetSubmitLoading()
      this.handleError(ex)
    }
  }

  mounted() {
    this.load()
  }

  async load() {
    this.loading = true
    const query = { id: this.value.id }
    try {
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

      const { provinceId = '0', cityId = '0', countyId = '0' } = this.item
      this.item.area = [provinceId, cityId, countyId]

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

  @Watch('item.area')
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
</style>
