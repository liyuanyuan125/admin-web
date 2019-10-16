<template>
  <Form
    :model="item"
    :label-width="88"
    :rules="rules"
    label-position="left"
    class="form page"
    ref="dataForms"
  >
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>{{title}}</em>
      </div>
    </header>

    <div class="edit-box">
      <!-- header -->
      <Row class="cinema-header">
        <!-- 公司 -->
        <Row class="client-type-row" >
          <Col :style="index==0 ? 'margin-right: 33%; float: right' : ''"
           v-for="(it, index) in customerTypeList" :key="index" span="8">
            <FormItem
              v-if="it.typeCode != 'agent' || it.typeCode != 'film'"
              :label="index == 1 ? '客户类型' : ''"
              :prop="'typearr['+ index + ']'"
              :show-message="index == 0 ? show0 : true"
            >
              <span class="check-select-group">
                <div>
                  <Checkbox :disabled='index == 1 && item.typearr[index]' v-model="item.typearr[index]" :label="it.typeName">{{it.typeName}}</Checkbox>
                </div>
                <Select
                  v-if="index == 0"
                  v-model="item.typeCategoryCode0"
                  :disabled="!item.typearr[index]"
                  class="flex-1"
                  clearable
                >
                  <Option
                    v-if="sub.controlStatus == 1"
                    v-for="sub in it.typeCategoryList"
                    :key="sub.typeCode"
                    :value="sub.typeCode"
                  >{{sub.typeName}}</Option>
                </Select>
                <Select
                  v-else
                  v-model="item.typeCategoryCode1"
                  :disabled="!item.typearr[index]"
                  class="flex-1"
                  clearable
                >
                  <Option
                    v-if="sub.controlStatus == 1"
                    v-for="sub in it.typeCategoryList"
                    :key="sub.typeCode"
                    :value="sub.typeCode"
                  >{{sub.typeName}}</Option>
                </Select>
              </span>
            </FormItem>
          </Col>
        </Row>
        <div>
          <FormItem label="公司名称" prop="name">
            <Row>
              <Col span="8">
                <Input v-model="item.name" placeholder="请填写公司全称，与营业执照保持一致" />
              </Col>
            </Row>
          </FormItem>
          <FormItem label="简称">
            <Row>
              <Col span="8">
                <Input v-model="item.shortName" />
              </Col>
            </Row>
          </FormItem>

          <FormItem v-if='item.typearr[0]' label="所属行业" prop="businessParentCode">
            <Row>
              <Col span="8">
                <Industry v-model='item.businessParentCode' :businessParentTypeList='businessParentTypeList' />
              </Col>
            </Row>
          </FormItem>

          <CitySelectDialog
            v-model="visible"
            :cityIds.sync="item.coverCityIdList"
            @ok="onCitySelectOk"
          />
          <FormItem v-if='item.typearr[0]' label="覆盖区域">
            <Row>
              <Col span="8">
                <a @click="visible = true">设置覆盖区域</a>
                <span> 已选城市 {{item.coverCityIdList.length}}个</span>
              </Col>
            </Row>
          </FormItem>

          <Row>
            <FormItem label="公司地址" prop="provinceId">
              <Row>
                <Col span="8">
                  <AreaSelect v-model="area" />
                </Col>
                <Col span="10" offset="1">
                  <FormItem prop="addressDetail">
                    <Input v-model="item.addressDetail" placeholder="详细地址" class="input-address" />
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
          </Row>
          <Row>
            <Col span="5">
              <FormItem label="联系人">
                <Input v-model="item.contact" />
              </FormItem>
            </Col>
            <Col span="6" offset="1">
              <FormItem label="联系电话" prop="contactPhone">
                <Input v-model="item.contactTel" />
              </FormItem>
            </Col>
            <Col span="7" offset="1">
              <FormItem label="邮箱" prop="email">
                <Input v-model="item.email" />
              </FormItem>
            </Col>
          </Row>
        </div>

        <Row v-if='item.typearr[0]'>
          <Col span="5">
            <FormItem label="推荐人电话">
              <Input v-model="item.recommendMobile" />
            </FormItem>
          </Col>
          <Col span="6" offset="1">
            <FormItem label="推荐人姓名" prop="recommendUserName">
              <Input v-model="item.recommendUserName" />
            </FormItem>
          </Col>
        </Row>

        <Row>
           <Col span="5">
            <FormItem label="资质" prop="qualificationType">
              <Select v-model="item.qualificationType" clearable>
                <Option
                  v-for="it in qualificationTypeList"
                  :key="it.key"
                  :value="it.key"
                >{{it.text}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5" offset='1'>
            <FormItem label="资质编号" prop="qualificationCode">
              <Input v-model="item.qualificationCode" placeholder="资质编号" />
            </FormItem>
          </Col>
        </Row>

        <!-- <Row v-if='item.companyType == 1'>
            <FormItem
                style='width: 50%;'
                v-for="(item, it) in item.qualificationArray"
                v-if="item.status"
                :key="it"
                label="资质编号"
                :prop="'qualificationArray.' + it + '.value'"
                :rules="{required: true, message: '请填写资质编号', trigger: 'blur'}">
                  <div style='display: flex'>
                      <Input type="text" v-model="item.value" placeholder="请填写资质编号"></Input>
                      <Button v-if='it == 0' @click="handleAdd">追加</Button>
                      <Button v-if='it != 0' @click="handleRemove(it)">删除</Button>
                  </div>
            </FormItem>
        </Row> -->

        <!-- 上传图片 -->
        <Row class="upload">
          <Col span="12" style="margin-left: 88px">
            <Upload v-model="imageList" multiple :maxCount="3" accept="image/*" v-if="loadingShow" />
          </Col>
        </Row>
      </Row>

      <!-- content -->
      <Row class="cinema-content">
        <FormItem label="审核意见" prop="approveStatus">
          <Row>
            <Col span="8">
              <RadioGroup v-model="item.approveStatus">
                <Radio :label="2">
                  <span>通过</span>
                </Radio>
                <Radio :label="3">
                  <span>未通过</span>
                </Radio>
              </RadioGroup>
            </Col>
          </Row>
        </FormItem>

        <div class="124" v-if="item.approveStatus==2">
          <Row>
            <Col span="8">
              <FormItem label="有效期至" prop="validityPeriodDate">
                <DatePicker
                  :options="options1"
                  type="date"
                  v-model="item.validityPeriodDate"
                  placeholder="选择有效期"
                  style="width: 200px"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </div>
        <div class="123" v-else>
          <Row>
            <Col span="8">
              <FormItem label="拒绝原因" prop="refusedReason">
                <Input v-model="item.refusedReason" placeholder="拒绝原因" />
              </FormItem>
            </Col>
          </Row>
        </div>
      </Row>

      <!-- footer -->
      <Row class="cinema-footer">
        <Row>
          <Col span="5">
            <FormItem label="客户等级" prop="levelCode">
              <Select v-model="item.levelCode" clearable>
                <Option
                  v-if="it.controlStatus == 1"
                  v-for="it in levelList"
                  :key="it.key"
                  :value="it.key"
                >{{it.text}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8" offset="1">
            <FormItem label="负责商务" prop="businessDirector">
              <Select v-model="item.businessDirector" filterable clearable>
                <Option
                  v-if="it.status!=2"
                  v-for="it in businessDirector"
                  :key="it.id"
                  :value="it.id"
                  :label="it.email+'['+it.userName+']'"
                >
                  {{ it.email}}
                  <b style="margin-left:5px">[{{it.userName}}]</b>
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row v-if="item.typearr[0]">
          <FormItem label="关联品牌">
            <BrandPane
              v-model="brandIds"
              :bindList="item.brandList"
            />
          </FormItem>
        </Row>

        <Row v-if="item.typearr[1]">
          <FormItem label="关联影院" prop="cinemasList" :show-message="!(item.cinemasList.length>0)">
            <PartBindCinema
              v-if="loadingShow"
              v-model="item.cinemasList"
              :unitList="profitUnitList"
              :incinematype="item.types[1].typeCategoryCode == 'cinema' ? 1 : 0"
              class="part-bind-cinema"
            />
          </FormItem>
        </Row>

        <div class="edit-button">
          <Button type="info" size="large" @click="edit('dataForms')">确定</Button>
          <Button type="info" size="large" @click="back">取消</Button>
        </div>
      </Row>
    </div>
  </Form>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryId, addSeach, addQuery, setQuery, directorList } from '@/api/corpReal'
import AreaSelect from '@/components/areaSelect'
import Upload from '@/components/Upload.vue'
import PartBindCinema from '../corp/partBindCinema.vue'
import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import moment from 'moment'
import { toast } from '@/ui/modal'
import BrandPane from '../corp/brandPane'
import Industry from './industry.vue'
import CitySelectDialog from '@/components/citySelectDialog'

const timeFormat = 'YYYY-MM-DD'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const defItem = {
  typearr: [false, false],
  cinemasList: [],
  name: '',
  shortName: '',
  businessParentCode: [],
  coverCityIdList: [],

  typeCategoryCode0: '',
  typeCategoryCode1: '',
  aptitudeNo: '',
  recommendMobile: '',
  recommendUserName: '',
  provinceId: 0,
  cityId: 0,
  countyId: 0,
  addressDetail: '',
  contact: '',
  contactTel: '',

  email: '',

  qualificationType: 'BL',
  qualificationCode: '',
  images: [],

  types: [
    {
      typeCode: '',
      typeCategoryCode: ''
    },
    {
      typeCode: '',
      typeCategoryCode: ''
    }
  ],
  refusedReason: '',
  levelCode: '',
  businessDirector: '',
  cinemas: [],
  approveStatus: 2,
  validityPeriodDate: '',

  singcontact: '',
  singcontactTel: '',
  singemail: ''
}

@Component({
  components: {
    AreaSelect,
    PartBindCinema,
    Industry,
    Upload,
    BrandPane,
    CitySelectDialog
  }
})
export default class Main extends ViewBase {
  title = ''
  loading = false
  loadingShow = false
  item: any = { ...defItem }
  singbrandIds: any = []
  shows = true
  show0 = true
  visible = false
  cityIds: any = []
  b: any = {}
  levelList = []
  singtype: any = [{typeCode: '', typeCategoryCode: ''}]
  customerTypeList: any = [] // 区代理
  bizUserList = []
  businessParentTypeList = [] // 一级行业
  typeList = []
  qualificationTypeList = []
  typeListSubMap = {}
  profitUnitList = []
  profitTypeList = []
  area: number[] = []
  businessDirector = []
  imageList = []

  index = 1 // 资质编号长度

  options1 = {
    disabledDate(date: any) {
      return date && date.valueOf() < Date.now() - 86400000
    }
  }

  brandIds: number[] = []

  get rules() {
    const validateType1 = (rule1: any, value: any, callback: any) => {
      if (this.item.typearr[1]) {
        callback()
      } else {
        if (value == false) {
          callback(new Error('请选择一种客户类型'))
        } else {
          if (!this.item.typeCategoryCode0) {
            callback(new Error('请选择二级类型'))
          } else {
            callback()
          }
        }
      }
    }

    const validateType2 = (rules: any, value: any, callback: any) => {
      if (value == false) {
        this.show0 = true
        callback()
      } else {
        this.show0 = false
        if (!this.item.typeCategoryCode1) {
          callback(new Error('请选择二级类型'))
        } else {
          callback()
        }
      }
    }

    const cinemaVali = (rules: any, value: any, callback: any) => {
      if (value.length > 0) {
        callback()
      } else {
        callback(new Error('请选择关联影院'))
      }
    }

    const rule: any = {
      name: [{ required: true, message: '请填写公司名称', trigger: 'blur' }],
      sing: [{ required: true, message: '请填写公司名称', trigger: 'blur' }],
      singcontact: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
      singcontactTel: [{ required: true, message: '请填写手机号', trigger: 'blur' }],
      singemail: [{ required: true, message: '请填写邮箱', trigger: 'blur' }],
      provinceId: [
        {
          required: true,
          pattern: /^[1-9][0-9]*$/,
          message: '请选择公司地址',
          trigger: 'change'
        }
      ],
      businessParentCode: [{
        required: true,
        type: 'array',
        message: '请选择所属行业',
        trigger: 'change',
        fields: {
          0: {type: 'string', required: true},
        }
      }],
      addressDetail: [
        { required: true, message: '请填写公司详细地址', trigger: 'blur' }
      ],
      approveStatus: [
        { required: true, message: '请选择审核状态', trigger: 'blur', type: 'number' }
      ],
      cinemasList: [{ validator: cinemaVali }],
      levelCode: [{ required: true, message: '请选择客户等级', trigger: 'change' }],
      validityPeriodDate: [
        {
          required: true,
          message: '请填写用户的资质到期日期',
          trigger: 'change',
          type: 'date'
        }
      ],
      refusedReason: [
        { required: true, message: '请填写拒绝原因', trigger: 'blur' },
        { max: 30, message: '拒绝原因不得超过30个字', trigger: 'change' }
      ],
      email: [
        {
          pattern: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/,
          message: '邮箱格式错误',
          trigger: 'blur'
        }
      ],
      'typearr[0]': [{ validator: validateType1 }],
      'typearr[1]': [{ validator: validateType2 }],
      qualificationType: [{ required: true, message: '请选择资质', trigger: 'change' }],
      qualificationCode: [
        { required: true, message: '请输入资质编号', trigger: 'blur' }
      ],
      businessDirector: [
        { required: true, message: '请选择负责商务', trigger: 'change', type: 'number' }
      ]
    }
    return rule
  }

  created() {
    if (this.$route.params) {
      this.item.typearr = [false, false]
      this.item.types = this.item.types.map((val: any) => {
        return {
          typeCode: '',
          typeCategoryCode: ''
        }
      })
    }
    this.business()
  }

  // // 删除资质编号
  // handleRemove(index: number) {
  //   this.item.qualificationArray[index].status = 0
  // }

  // // 添加资质编号
  // handleAdd() {
  //   this.index++
  //   this.item.qualificationArray.push({
  //       value: '',
  //       index: this.index,
  //       status: 1
  //   })
  // }

  async business() {
    try {
      const res = await directorList()
      this.businessDirector = res.data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  typeCode(val: any, index: any) {
    if (!this.item.typearr[index]) {
      this.item.types[index].typeCode = val
    } else {
      this.item.types[index].typeCode = ''
      this.item.types[index].typeCategoryCode = ''
    }
  }

  get cinemas() {
    if (this.item.cinemasList.length > 0) {
      const cinemas = this.item.cinemasList.map((val: any) => {
        return val.id * 1
      })
      return cinemas
    } else {
      return []
    }
  }

  get cachedMap() {
    return {
      levelList: makeMap(this.levelList),
      qualificationTypeList: makeMap(this.qualificationTypeList)
    }
  }

  get formatArr() {
    const cachedMap = this.cachedMap
    return {
      qualificationType: cachedMap.qualificationTypeList[this.item.qualificationType],
      levelText: cachedMap.levelList[this.item.levelCode]
    }
  }

  mounted() {
    this.load()
  }

  onCitySelectOk() {

  }

  async load() {
    this.loading = true
    ; (this.$Spin as any).show()
    const query = { id: this.$route.params.id || 0 }
    try {
      if (!query.id) {
        const {
          data: { levelList, customerTypeList, qualificationTypeList, businessParentTypeList }
        } = await addSeach()
        this.loadingShow = true
        this.levelList = levelList
        this.qualificationTypeList = qualificationTypeList
        this.customerTypeList = customerTypeList.slice(2)
        this.businessParentTypeList = businessParentTypeList.map((it: any) => {
          return {
            value: it.key,
            label: it.text,
            children: [],
            loading: false
          }
        })
        this.item.types[1] = {
          typeCode: 'resource',
          typeCategoryCode: 'cinema'
        }
        this.item.typeCategoryCode1 = 'cinema'
        this.item.typearr[1] = true
        this.title = '新建资源方'
        ; (this.$Spin as any).hide()
      } else {
        const {
          data: {
            customerTypeList,
            levelList,
            name,
            shortName,
            aptitudeType,
            aptitudeNo,
            provinceId,
            cityId,
            businessParentTypeList,
            countyId,
            addressDetail,
            contact,
            contactTel,
            email,
            qualificationType,
            qualificationCode,
            coverCityIdList,
            images,
            types,
            refusedReason,
            levelCode,
            businessDirector,
            cinemas,
            approveStatus,
            validityPeriodDate,
            qualificationTypeList,
            status,
            imageList,
            businessParentCode,
            businessChildCode,
            cinemaList,
            brandList,
          }
        } = await queryId(query)
        this.item.name = name
        this.businessParentTypeList = businessParentTypeList.map((it: any) => {
          return {
            value: it.key,
            label: it.text,
            children: [],
            loading: false
          }
        })
        this.item.businessParentCode = [
          businessParentCode,
          (businessChildCode || '0')
        ]
        this.item.contact = contact
        this.item.contactTel = contactTel
        this.item.email = email
        this.area = [provinceId || 0, cityId || 0, countyId || 0]
        this.item.shortName = shortName
        this.item.brandList = (brandList as any[] || []).map(it => ({
          id: it.brandId,
          name: it.brandName,
        }))
        this.item.addressDetail = addressDetail
        this.item.coverCityIdList = coverCityIdList || []
        this.customerTypeList = customerTypeList.slice(2)
        if (types.length == 1) {

          if (this.customerTypeList[0].typeCode == types[0].typeCode) {
            this.item.types[0] = types[0]
            this.item.typeCategoryCode0 = types[0].typeCategoryCode
            this.item.typearr[0] = true
          } else {
            this.item.types[1] = types[0]
            this.item.typeCategoryCode1 = types[0].typeCategoryCode
            this.item.typearr[1] = true
          }
        } else {
          this.item.types = types.sort((a: any, b: any) => {
            return a.typeCode > b.typeCode ? 1 : -1
          })
          this.item.typeCategoryCode0 = this.item.types[0].typeCategoryCode
          this.item.typeCategoryCode1 = this.item.types[1].typeCategoryCode
          this.item.typearr = [true, true]
        }
        this.item.aptitudeType = aptitudeType
        this.item.aptitudeNo = aptitudeNo
        this.item.qualificationCode = qualificationCode
        this.item.levelCode = levelCode
        this.qualificationTypeList = qualificationTypeList
        this.item.qualificationType = qualificationType
        this.item.images = images || []
        this.item.cinemasList = cinemaList || []
        this.item.refusedReason = refusedReason
        this.item.businessDirector = businessDirector
        this.item.cinemas = cinemas || []
        this.imageList = imageList || []
        this.item.approveStatus = Number(approveStatus)
        this.item.validityPeriodDate = validityPeriodDate
          ? new Date(this.formatValid(validityPeriodDate))
          : ''
        this.levelList = levelList
        this.loadingShow = true
        approveStatus == 1 ? (this.title = '编辑资源方') : (this.title = '编辑资源方')
        ; (this.$Spin as any).hide()
      }
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  formatValid(data: any) {
    const datas = (data + '').split(',')
    const a = datas[0].slice(0, 4)
    const b = datas[0].slice(4, 6)
    const c = datas[0].slice(6)
    return `${a}/${b}/${c}`
  }

  back() {
    this.$router.go(-1)
  }

  edit(dataForms: string) {
    (this.$refs[dataForms] as any).validate(async (valid: any) => {
      if (valid) {
        if (this.item.types[1].typeCategoryCode == 'cinema' && this.cinemas.length > 1) {
          this.showError('因资源方类型为影院，因此仅能关联一家影院')
          return
        }
        const route: any = this.$route.params.id || 0
        let times: any = ''
        const timesfomat = moment(this.item.validityPeriodDate)
          .format(timeFormat)
          .split('-')
        times = Number(timesfomat[0] + timesfomat[1] + timesfomat[2])
        !this.item.validityPeriodDate ? (times = '') : times
        const oldQuery = {
          ...this.item,
          validityPeriodDate: times,
          provinceId: Number(this.item.provinceId),
          cityId: Number(this.item.cityId),
          countyId: Number(this.item.countyId)
        }
        const query = clean(oldQuery)
        const array = Object.keys(query).slice(2)
        const newqQuery = slice(query, array)
        const types: any = []
        this.item.types.forEach((it: any) => {
          it.typeCode &&
            types.push({
              ...it,
              typeCategoryCode: it.typeCategoryCode ? it.typeCategoryCode : ''
            })
        })
        const business = this.item.businessParentCode.length > 0 ? {
          businessParentCode: this.item.businessParentCode[0],
          businessChildCode: this.item.businessParentCode[1] == '0' ? '' : this.item.businessParentCode[1],
        } : {}
        let formData: any = {
          ...newqQuery,
          ...business,
          companyType: 1,
          types: (types as any[] || []).filter(it => it.typeCode != ''),
          cinemas: this.cinemas,
          brandIds: (this.item.typearr[0] ? this.brandIds : []),
          email: this.item.email,
          contactTel: this.item.contactTel,
          contact: this.item.contact,
        }

        // 删除某些多余的字段
        if (!this.item.typearr[0]) {
          formData = {
            ...formData,
            coverCityIdList: [],
            businessParentCode: '',
            businessChildCode: '',
          }
          // delete formData.coverCityIdList
          // delete formData.businessParentCode
          // delete formData.businessParentCode
          // delete formData.cinemas
          // delete formData.provinceId
          // delete formData.cityId
          // delete formData.countyId
          // delete formData.typeCategoryCode0
          // delete formData.addressDetail
          // delete formData.name
          // delete formData.shortName
        }
        delete formData.brandList
        try {
          const data: any = route == 0
            ? await addQuery(formData)
            : await setQuery(route, formData)
          toast(data.msg)
          this.$router.go(-1)
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }

  @Watch('area')
  watchArea(val: number[]) {
    this.item.provinceId = val[0]
    this.item.cityId = val[1]
    this.item.countyId = val[2]
  }

  @Watch('imageList', { deep: true })
  watchImageList(val: any[]) {
    this.item.images = val.map(it => it.fileId)
  }

  @Watch('typeList', { deep: true })
  watchTypeList(val: any[]) {
    this.item.typeIdList = val.map(it => (it.checked ? it.id : 0))
    this.item.subTypeIdList = val.map(it => (it.checked ? it.subId || 0 : 0))
  }

  @Watch('item', { deep: true })
  watchitem(val: any) {
    const form = 'dataForms'
    if (val.approveStatus == 3) {
      (this.$refs[form] as any).fields.forEach((e: any) => {
        if (e.prop == 'validityPeriodDate') {
          e.resetField()
        }
      })
    } else if (val.approveStatus == 1) {
      (this.$refs[form] as any).fields.forEach((e: any) => {
        if (e.prop == 'refusedReason') {
          e.resetField()
        }
      })
    }
    if (val.typeCategoryCode0) {
      this.item.types[0].typeCategoryCode = val.typeCategoryCode0
    } else {
      this.item.types[0].typeCategoryCode = ''
    }
    if (val.typeCategoryCode1) {
      this.item.types[1].typeCategoryCode = val.typeCategoryCode1
    } else {
      this.item.types[1].typeCategoryCode = ''
    }
    if (val.typearr[0]) {
      this.item.types[0].typeCode = (this.customerTypeList[0] as any).typeCode
    } else {
      this.item.types[0].typeCode = ''
    }
    if (val.typearr[1]) {
      this.item.types[1].typeCode = (this.customerTypeList[1] as any).typeCode
    } else {
      this.item.types[1].typeCode = ''
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

.header {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;
  em,
  i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}

.btn-back {
  margin-right: 10px;
}

.edit-button {
  text-align: center;
  margin-bottom: 20px;
  button {
    margin-right: 20px;
  }
}

.cinema-header,
.cinema-content,
.cinema-footer {
  border: 1px solid #dcdee2;
  background: #fff;
  padding: 18px 0 0 18px;
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
