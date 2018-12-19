<template>
  <Form  :model='item' :label-width='88' :rules='rules' label-position="left" class='form page' ref='dataForms'>
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
          <FormItem label="公司地址" prop="provinceId">
            <Row>
              <Col span="8">
                <AreaSelect v-model="area"/>
              </Col>
              <Col span="10" offset="1">
                <FormItem prop="addressDetail">
                  <Input v-model="item.addressDetail" placeholder="详细地址" class="input-address"/>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
        </Row>
         <Row>
          <Col span="5">
            <FormItem label="联系人" prop="contactName">
              <Input v-model="item.contact"/>
            </FormItem>
          </Col>
          <Col span="6" offset="1">
            <FormItem label="联系电话" prop="contactPhone">
              <Input v-model="item.contactTel"/>
            </FormItem>
          </Col>
          <Col span="7" offset="1">
            <FormItem label="邮箱" prop="contactEmail">
              <Input v-model="item.email"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="5">
            <FormItem label="资质">
              <Select v-model="item.aptitudeType">
                <Option value="营业执照">营业执照</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" offset="1">
          <FormItem label="资质编号">
            <Input v-model="item.aptitudeNo" placeholder="资质编号"/>
          </FormItem>
          </Col>
        </Row>
        <Row class="upload">
          <Col span="12" style="margin-left: 88px">
            <Upload />
          </Col>
        </Row>
      </Row>

      <!-- content -->
      <Row class="cinema-content">
        <FormItem label="审核意见" prop="approveStatus" :error='nameError'>
          <Row>
            <Col span="8">
              <RadioGroup v-model="item.approveStatus">
                <Radio :label=1>
                  <span>通过</span>
                </Radio>
                <Radio :label=2>
                  <span>未通过</span>
                </Radio>
              </RadioGroup>
            </Col>
          </Row>
        </FormItem>
        <Row v-if="item.approveStatus==1">
          <Col span="8">
            <FormItem label="有效期至" prop="validityPeriodDate" :show-message="item.approveStatus==1">
              <DatePicker type="date" v-model="item.validityPeriodDate" placeholder="选择有效期" style="width: 200px"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row v-else>
          <Col span="8">
          <FormItem label="拒绝原因" prop="refusedReason" :show-message="item.approveStatus==2">
            <Input v-model="item.refusedReason" placeholder="拒绝原因"/>
          </FormItem>
          </Col>
        </Row>
       </Row>
      <!-- footer -->
      <Row class="cinema-footer">
        <Row>
          <Col span="5">
            <FormItem label="客户等级" prop="clientLevel">
              <Select v-model="item.levelList" clearable>
                {{levelList}}
                <Option v-for="it in levelList" :key="it.key"
                  :value="it.key">{{it.text}}</Option>
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
          <FormItem label="客户类型" prop="shortName">
            <Row>
              <Col v-for="it in customerTypeList" :key="it.id" span="8">
                <span class="check-select-group">
                  <Checkbox v-model="it.checked">{{it.typeName}}</Checkbox>
                  <Select v-model="it.customerTypeList" :disabled="!it.checked"
                    :required="!it.checked" class="flex-1" clearable>
                    <Option v-for="sub in it.typeCategoryList" :key="sub.typeCode"
                      :value="sub.typeCode">{{sub.typeName}}</Option>
                  </Select>
                </span>
              </Col>
            </Row>
          </FormItem>
        </Row>

        <Row>
          <FormItem label="关联影院" prop="cinemas">
            <PartBindCinema v-model="item.cinemas" :unitList="profitUnitList"
              :typeList="profitTypeList" class="part-bind-cinema"/>
          </FormItem>
        </Row>

        <div class="edit-button">
          <Button type="info" size="large" @click="edit('dataForms')">确定</Button>
          <Button size="large" @click="edit(0)">返回</Button>
        </div>
      </Row>
      
    </div>
    
  </Form>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { queryId, queryList, addSeach } from '@/api/corpReal'
import AreaSelect from '@/components/AreaSelect.vue'
import PartBindCinema from './partBindCinema.vue'
import Upload from './upload.vue'
import { toMap } from '@/fn/array'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const defItem = {
  id: 0,
  name: '',
  shortName: '',

  aptitudeType: 0,
  aptitudeNo: '',

  provinceId: 0,
  cityId: 0,
  districtId: 0,
  addressDetail: '',

  contact: '',
  contactTel: '',
  contactEmail: '',

  clientLevel: 0,
  email: 0,

  type: 0,
  subTypeIdList: [],

  cinemas: [],
  aptitudeUrl: '',

  approveStatus: 1,
  validityPeriodDate: ''
}

@Component({
  components: {
    AreaSelect,
    PartBindCinema,
    Upload
  }
})

export default class Main extends View {

  loading = false

  item: any = {...defItem}

  levelList = []
  customerTypeList = []
  bizUserList = []
  typeList = []
  typeListSubMap = {}
  profitUnitList = []
  profitTypeList = []

  area: number[] = []

  nameError = ''

  get rules() {
    let rule: any = {
      name: [
        { required: true, message: '请填写公司名称', trigger: 'blur' }
      ],
      shortName: [
        { required: true, message: '请填写公司简称', trigger: 'blur' }
      ],
      provinceId: [
        { required: true, pattern: /^(?!0\d)[1-9]\d+/, message: '请选择公司地址', trigger: 'change' }
      ],
      addressDetail: [
        { required: true, message: '请填写公司详细地址', trigger: 'blur' }
      ],
      approveStatus: [
        { required: true, message: '请选择审核状态', trigger: 'blur', type: 'number' }
      ],
      cinemas: [
        { required: true, message: '请选择关联影院', trigger: 'change'}
      ]
    }
    if (this.item.approveStatus == 1) {
      rule = {
        ...rule,
        validityPeriodDate: [
          { required: true, message: '请填写用户的资质到期日期', trigger: 'change', type: 'date'}
        ]
      }
    } else {
       rule = {
        ...rule,
        refusedReason: [
         { required: true, message: '请填写拒绝原因', trigger: 'blur'}
        ]
      }
    }
    return rule
  }

  mounted() {
    this.load()
  }

  get cachedMap() {
    return {
      levelList: makeMap(this.levelList),
    }
  }

  get formatArr() {
    const cachedMap = this.cachedMap
    return {
      levelText: cachedMap.levelList[this.item.levelCode],
    }
  }
  async load() {
    this.loading = true
    const query = { id: this.$route.params.id || 0 }
    try {
      if ( !!query ) {
        const {
          data: {
            levelList,
            customerTypeList
          }
        } = await addSeach()
        this.levelList = levelList
        this.customerTypeList = customerTypeList
      } else {
      }
      // const { data: {
      //   item,
      //   aptitudeTypeList,
      //   clientLevelList,
      //   bizUserList,
      //   typeList,
      //   typeListSubMap,
      //   profitUnitList,
      //   profitTypeList,
      // } } = await queryId(query)
      // this.item = { ...defItem, ...item }
      // this.aptitudeTypeList = aptitudeTypeList
      // this.clientLevelList = clientLevelList
      // this.bizUserList = bizUserList.map((it: any) => ({
      //   ...it,
      //   label: [it.name, it.group, it.title].join(' | ')
      // }))

      // const { typeIdList = [], subTypeIdList = [] } = this.item

      // this.typeList = typeList.map((it: any, i: number) => ({
      //   ...it,
      //   checked: typeIdList[i] > 0,
      //   subId: subTypeIdList[i] || 0
      // }))
      // this.typeListSubMap = typeListSubMap

      // this.profitUnitList = profitUnitList
      // this.profitTypeList = profitTypeList

      // const { provinceId = 0, cityId = 0, districtId = 0 } = this.item
      // this.area = [provinceId, cityId, districtId]

      // // 优化体验
      // if (aptitudeTypeList.length === 1) {
      //   this.item.aptitudeType = aptitudeTypeList[0].id
      // }
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }
  edit(dataForms: string) {
     (this.$refs[dataForms] as any).validate(async ( valid: any ) => {
      if (valid) {

      }
     })
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
.upload {
  margin-bottom: 20px;
}
.part-bind-cinema {
  width: 660px;
}
</style>
