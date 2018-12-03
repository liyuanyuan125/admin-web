<template>
  <div class="page">
    <Form :model='item' :label-width='88' :rules='rules' class='form' ref='form'>
      <Row>
        <Col span="10">
          <FormItem label="公司名称" prop="name" :error='nameError'>
            <Input v-model="item.name" placeholder="请填写公司全称，与营业执照保持一致"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="简称" prop="shortName">
            <Input v-model="item.shortName"/>
          </FormItem>
        </Col>
      </Row>

      <Row class="row-single">
        <FormItem label="资质">
          <Row>
            <Col span="6">
              <Select v-model="item.aptitudeType">
                <Option v-for="it in aptitudeTypeList" :key="it.id"
                  :value="it.id">{{it.name}}</Option>
              </Select>
            </Col>
            <Col span="12">
              <Input v-model="item.aptitudeNo" placeholder="资质编号"/>
            </Col>
          </Row>
        </FormItem>
      </Row>

      <Row class="row-single">
        <FormItem label="公司地址">
          <Row>
            <Col span="6">
              <AreaSelect v-model="area"/>
            </Col>
            <Col span="12">
              <Input v-model="item.address" placeholder="详细地址" class="input-address"/>
            </Col>
          </Row>
        </FormItem>
      </Row>

      <Row>
        <Col span="5">
          <FormItem label="联系人" prop="contactName">
            <Input v-model="item.contactName"/>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="联系电话" prop="contactPhone">
            <Input v-model="item.contactPhone"/>
          </FormItem>
        </Col>
        <Col span="7">
          <FormItem label="邮箱" prop="contactEmail">
            <Input v-model="item.contactEmail"/>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="5">
          <FormItem label="客户等级" prop="clientLevel">
            <Select v-model="item.clientLevel" clearable>
              <Option v-for="it in clientLevelList" :key="it.id"
                :value="it.id">{{it.name}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="负责商务" prop="bizUserId">
            <Select v-model="item.bizUser" clearable>
              <Option v-for="it in bizUserList" :key="it.id" :value="it.id"
                :label="it.label">{{it.label}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row class="row-single">
        <FormItem label="客户类型">
          <Row>
            <Col v-for="it in typeList" :key="it.id" span="8">
              <Checkbox v-model="it.checked">{{it.name}}</Checkbox>
              <Select v-model="it.subId" :disabled="!it.checked"
                :required="!it.checked" clearable>
                <Option v-for="sub in typeListSubMap[it.id]" :key="sub.id"
                  :value="sub.id">{{sub.name}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
      </Row>
    </Form>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { queryItem } from '@/api/corp'
import AreaSelect from '@/components/AreaSelect.vue'

const defItem = {
  id: 0,
  name: '',
  shortName: '',

  aptitudeType: 0,
  aptitudeNo: '',

  provinceId: 0,
  cityId: 0,
  districtId: 0,
  address: '',

  contactName: '',
  contactPhone: '',
  contactEmail: '',

  clientLevel: 0,
  bizUserId: 0,

  type: 0,
  resType: 0,
  adType: 0,

  cinemaList: [],
  aptitudeUrl: '',
}

@Component({
  components: {
    AreaSelect
  }
})
export default class Main extends View {
  loading = false

  item: any = {}

  aptitudeTypeList = []
  clientLevelList = []
  bizUserList = []
  typeList = []
  typeListSubMap = {}
  profitUnitList = []
  profitTypeList = []

  area = [0, 0, 0]

  nameError = ''

  get rules() {
    return {
      name: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
    }
  }

  mounted() {
    this.load()
  }

  async load() {
    this.loading = true
    const query = { id: this.$route.params.id || 0 }
    try {
      const { data: {
        item,
        aptitudeTypeList,
        clientLevelList,
        bizUserList,
        typeList,
        typeListSubMap,
        profitUnitList,
        profitTypeList,
      } } = await queryItem(query)
      this.item = { ...defItem, ...item }
      this.aptitudeTypeList = aptitudeTypeList
      this.clientLevelList = clientLevelList
      this.bizUserList = bizUserList.map((it: any) => ({
        ...it,
        label: [it.name, it.group, it.title].join(' | ')
      }))
      this.typeList = typeList.map((it: any) => ({ ...it, checked: false, subId: 0 }))
      this.typeListSubMap = typeListSubMap
      this.profitUnitList = profitUnitList
      this.profitTypeList = profitTypeList

      // 优化体验
      if (aptitudeTypeList.length === 1) {
        this.item.aptitudeType = aptitudeTypeList[0].id
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  @Watch('area')
  watchArea(val: number[]) {
    this.item.provinceId = val[0]
    this.item.cityId = val[1]
    this.item.districtId = val[2]
  }
}
</script>

<style lang="less" scoped>
.form {
  margin-top: 10px;
}
.row-single {
  .ivu-col:first-child {
    padding-right: 8px;
  }
  .ivu-col:last-child {
    padding-right: 22px;
  }
}
</style>
