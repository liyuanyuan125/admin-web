<template>
  <Form :model='item' :label-width='88' :rules='rules' label-position="left" class='form page' ref='form'>
    <div class="edit-box">

      <!-- header -->
      <Row class="cinema-header">
        <FormItem label="公司名称" prop="name" :error='nameError'>
          <Row>
            <Col span="10">
              <Input v-model="item.name" placeholder="请填写公司全称，与营业执照保持一致"/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="简称" prop="shortName">
          <Row>
            <Col span="8">
              <Input v-model="item.shortName"/>
            </Col>
          </Row>
        </FormItem>
        <Row>
          <FormItem label="客户类型">
            <Row>
              <Col span="8">
                <AreaSelect v-model="area"/>
              </Col>
              <Col span="10" offset="1">
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
          <Col span="6" offset="1">
            <FormItem label="联系电话" prop="contactPhone">
              <Input v-model="item.contactPhone"/>
            </FormItem>
          </Col>
          <Col span="7" offset="1">
            <FormItem label="邮箱" prop="contactEmail">
              <Input v-model="item.contactEmail"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="5">
            <FormItem label="资质">
              <Select v-model="item.aptitudeType">
                <Option v-for="it in aptitudeTypeList" :key="it.id"
                  :value="it.id">{{it.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" offset="1">
          <FormItem label="资质编号">
            <Input v-model="item.aptitudeNo" placeholder="资质编号"/>
          </FormItem>
          </Col>
        </Row>
      </Row>

      <!-- content -->
      <Row class="cinema-content">
        <FormItem label="审核意见" prop="name" :error='nameError'>
          <Row>
            <Col span="8">
              <RadioGroup v-model="phone">
                <Radio label="apple">
                  <span>通过</span>
                </Radio>
                <Radio label="android">
                  <span>未通过</span>
                </Radio>
              </RadioGroup>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="有效期至" prop="shortName">
          <Row>
            <Col span="8">
              <DatePicker type="date" placeholder="Select date" style="width: 200px"></DatePicker>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <!-- footer -->
      <Row class="cinema-footer">
        <Row>
          <Col span="5">
            <FormItem label="客户等级" prop="clientLevel">
              <Select v-model="item.clientLevel" clearable>
                <Option v-for="it in clientLevelList" :key="it.id"
                  :value="it.id">{{it.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8" offset="1">
            <FormItem label="负责商务" prop="bizUserId">
              <Select v-model="item.bizUserId" clearable>
                <Option v-for="it in bizUserList" :key="it.id" :value="it.id"
                  :label="it.label">{{it.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <FormItem label="客户类型">
            <Row>
              <Col v-for="it in typeList" :key="it.id" span="8">
                <span class="check-select-group">
                  <Checkbox v-model="it.checked">{{it.name}}</Checkbox>
                  <Select v-model="it.subId" :disabled="!it.checked"
                    :required="!it.checked" class="flex-1" clearable>
                    <Option v-for="sub in typeListSubMap[it.id]" :key="sub.id"
                      :value="sub.id">{{sub.name}}</Option>
                  </Select>
                </span>
              </Col>
            </Row>
          </FormItem>
        </Row>

        <Row>
          <FormItem label="关联影院">
            <PartBindCinema v-model="item.cinemaList" :unitList="profitUnitList"
              :typeList="profitTypeList" class="part-bind-cinema"/>
          </FormItem>
        </Row>

        <div class="edit-button">
          <Button type="info" size="large" @click="edit(0)">确定</Button>
          <Button type="" size="large" @click="edit(0)">返回</Button>
        </div>
      </Row>
      
    </div>
    
  </Form>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { queryItem } from '@/api/corp'
import AreaSelect from '@/components/AreaSelect.vue'
import PartBindCinema from './partBindCinema.vue'

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
  subTypeIdList: [],

  cinemaList: [],
  aptitudeUrl: '',
}

@Component({
  components: {
    AreaSelect,
    PartBindCinema,
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

  area: number[] = []

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

      const { typeIdList = [], subTypeIdList = [] } = this.item

      this.typeList = typeList.map((it: any, i: number) => ({
        ...it,
        checked: typeIdList[i] > 0,
        subId: subTypeIdList[i] || 0
      }))
      this.typeListSubMap = typeListSubMap

      this.profitUnitList = profitUnitList
      this.profitTypeList = profitTypeList

      const { provinceId = 0, cityId = 0, districtId = 0 } = this.item
      this.area = [provinceId, cityId, districtId]

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

  @Watch('typeList', { deep: true })
  watchTypeList(val: any[]) {
    this.item.typeIdList = val.map(it => it.checked ? it.id : 0)
    this.item.subTypeIdList = val.map(it => it.checked ? it.subId || 0 : 0)
  }
}
</script>

<style lang="less" scoped>
.page {
  margin: -10px -10px;
  background: #ecf0f4;
}
.edit-box {
  padding: 10px 0;
}
.edit-button {
  text-align: center;
  margin-bottom: 20px;
  button {
    margin-right: 20px;
  }
}

.cinema-header, .cinema-content, .cinema-footer {
  margin-left: 14px;
  margin-right: 14px;
  background: #fff;
  padding: 20px 0 0 20px;
  margin-bottom: 14px;
}
.check-select-group {
  display: inline-flex;
  width: 90%;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  padding-left: 8px;
  overflow: hidden;
  /deep/ .ivu-select {
    .ivu-select-placeholder,
    .ivu-select-selected-value {
      position: relative;
      top: 1px;
    }
    .ivu-select-selection {
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }
  }
}
.part-bind-cinema {
  width: 660px;
}
</style>
