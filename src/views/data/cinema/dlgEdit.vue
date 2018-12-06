<template>
  <Modal v-model="inValue.showDlgEdit" :transfer="false" :width="680"
    :loading="submitLoading" @on-ok="submit">
    <Form :model="item" :label-width="88" :rules="rules" class="form" ref="form">
      <Row>
        <Col span="15">
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
        <Col span="15">
          <FormItem label="官方名称" prop="officalName">
            <Input v-model="item.officalName" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="控制状态" prop="controlStatus">
            <Select v-model="item.controlStatus">
              <Option v-for="it in controlStatusList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="15">
          <FormItem label="院线" prop="chainId">
            <CinemaChainSelect v-model="item.chainId"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="影院等级" prop="grade">
            <Select v-model="item.grade">
              <Option v-for="it in gradeList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row class="row-address">
        <Col span="10">
          <FormItem label="公司地址" required>
            <AreaSelect v-model="area"/>
          </FormItem>
        </Col>
        <Col span="13">
          <FormItem class="form-item-address">
            <Input v-model="item.address" placeholder="详细地址"/>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="10">
          <FormItem label="售票系统" prop="softwareId">
            <Select v-model="item.softwareId">
              <Option v-for="it in softwareList" :key="it.key"
                :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem label="邮编" prop="zipCode" :label-width="58">
            <Input v-model="item.zipCode" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="营业状态" prop="status">
            <Select v-model="item.status">
              <Option v-for="it in statusList" :key="it.key"
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
  shortName: '',
  code: '',
  officalName: '',
  controlStatus: 0,
  chainId: '',
  grade: '',
  provinceId: 0,
  cityId: 0,
  countyId: 0,
  address: '',
  softwareId: '',
  zipCode: '',
  status: 0,
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

  gradeList: Enum[] = []

  softwareList: Enum[] = []

  statusList: Enum[] = []

  controlStatusList: Enum[] = []

  area: string[] = []

  shortNameError = ''

  get rules() {
    return {
      shortName: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      officalName: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      chainId: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
    }
  }

  async submit() {
    const valid = await (this.$refs.form as any).validate()
    if (!valid) {
      this.submitLoading = false
      this.$nextTick(() => this.submitLoading = true)
      return
    }
    try {
      const data = { ...this.item }
      const res = data.id ? await updateItem(data) : await addItem(data)
      toast(data.id ? '更新成功' : '创建成功')
      setTimeout(() => {
        this.$emit('done')
        this.inValue.showDlgEdit = false
      }, 1888)
    } catch (ex) {
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
      const { data: {
        item = {},
        gradeList = [],
        softwareList = [],
        statusList = [],
        cstatusList = [],
      } } = await queryItem(query)
      this.item = { ...defItem, ...slice(item, Object.keys(defItem)) }
      this.gradeList = gradeList
      this.softwareList = softwareList
      this.statusList = statusList
      this.controlStatusList = cstatusList

      const { provinceId = '0', cityId = '0', countyId = '0' } = this.item
      this.area = [provinceId, cityId, countyId]

      // 默认选中第一个
      if (this.item.status == 0) {
        this.item.status = statusList[0].key
      }
      if (this.item.controlStatus == 0) {
        this.item.controlStatus = cstatusList[0].key
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
  margin-top: 12px;
  padding-right: 8px;
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
