<template>
  <Form :model='item'
        :label-width='88'
        :rules='rules'
        label-position="left"
        class='form page'
        ref='dataForms'>
    <header class="header flex-box">
      <Button icon="md-return-left"
              @click="back"
              class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>{{title}}</em>
      </div>
    </header>
    <div class="edit-box"
         v-if="nono">
      <!-- header -->
      <Row class="cinema-header">
        <FormItem label="平台账号"
                  prop="name">
          <Row>
            <Col span="10">
            <Input v-model="item.name"
                   readonly
                   placeholder="平台账号" />
            </Col>
          </Row>
        </FormItem>
        <FormItem label="平台账号头像"
                  prop="name">
          <Row>
            <Col span="10">
              <Upload v-model="imageList" multiple :maxCount="1" accept="image/*"
              v-if="loadingShow"/>
            </Col>
          </Row>
        </FormItem>
        <Row>
          <FormItem label="公司地址"
                    prop="provinceId">
            <Row>
              <Col span="8">
              <AreaSelect v-model="area" />
              </Col>
            </Row>
          </FormItem>
        </Row>
      </Row>
      <!-- content -->
      <Row class="cinema-content">
        <FormItem label="审核意见"
                  prop="approveStatus">
          <Row>
            <Col span="8">
            <div>
              {{item.status}} 表单校验待处理
            </div>
            <RadioGroup v-model="item.status">
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
        <div class="124"
             v-if="item.status==1">
          <Row>
            <Col span="8">
            <FormItem label="有效期至"
                      prop="validityPeriodDate">
              <DatePicker :options="options1"
                          type="date"
                          v-model="item.validityPeriodDate"
                          placeholder="选择有效期"
                          style="width: 200px"></DatePicker>
            </FormItem>
            </Col>
          </Row>
        </div>
        <div v-else>
          <Row>
            <Col span="8">
            <FormItem label="拒绝原因"
                      prop="refusedReason">
              <Input v-model="item.refusedReason"
                     placeholder="拒绝原因" />
            </FormItem>
            </Col>
          </Row>
        </div>
      </Row>
      <!-- footer -->
      <Row class="cinema-footer">
        <div class="edit-button">
          <Button type="info"
                  size="large"
                  @click="edit('dataForms')">确定</Button>
        </div>
      </Row>

    </div>
  </Form>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { addSeach, addQuery, setQuery, directorList } from '@/api/corpReal'
import { queryId } from '@/api/kolAccount'
import AreaSelect from '@/components/areaSelect'
import Upload from '@/components/Upload.vue'
import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import moment from 'moment'
import { toast } from '@/ui/modal'

const timeFormat = 'YYYY-MM-DD'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const defItem = {
  name: '',
  typeCategoryCode0: '',
  typeCategoryCode1: '',

  provinceId: 0,
  cityId: 0,
  countyId: 0,

  contact: '',


  images: [],

  refusedReason: '',
  levelCode: '',
  businessDirector: '',
  cinemas: [],
  approveStatus: 1,
  validityPeriodDate: ''
}

@Component({
  components: {
    AreaSelect,
    Upload
  }
})
export default class Main extends ViewBase {
  nono = true
  title = ''
  loading = false
  loadingShow = false
  item: any = { ...defItem }
  shows = true
  show0 = true
  levelList = []
  customerTypeList = []
  bizUserList = []
  typeList = []
  qualificationTypeList = []
  typeListSubMap = {}
  profitUnitList = []
  profitTypeList = []
  area: number[] = []
  businessDirector = []
  imageList: any[] = []
  options1 = {
    disabledDate(date: any) {
      return date && date.valueOf() < Date.now() - 86400000
    }
  }

  get rules() {
    const cinemaVali = (rules: any, value: any, callback: any) => {
      if (value.length > 0) {
        callback()
      } else {
        callback(new Error('请选择关联影院'))
      }
    }
    const rule: any = {
      name: [{ required: true, message: '请填写公司名称', trigger: 'blur' }],
      // shortName: [
      //   { required: true, message: '请填写公司简称', trigger: 'blur' }
      // ],
      provinceId: [
        {
          required: true,
          pattern: /^[1-9][0-9]*$/,
          message: '请选择公司地址',
          trigger: 'change'
        }
      ],
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
    // this.business()
  }

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

  // get cinematype() {
  //   if (this.item.types[1].typeCategoryCode == 'cinema') {
  //     return 1
  //   } else {
  //     return 0
  //   }
  // }

  // get cinemas() {
  //   if (this.item.cinemasList.length > 0) {
  //     const cinemas = this.item.cinemasList.map((val: any) => {
  //       return val.id * 1
  //     })
  //     return cinemas
  //   } else {
  //     return []
  //   }
  // }

  // get cachedMap() {
  //   return {
  //     levelList: makeMap(this.levelList),
  //     qualificationTypeList: makeMap(this.qualificationTypeList)
  //   }
  // }

  // get formatArr() {
  //   const cachedMap = this.cachedMap
  //   return {
  //     qualificationType: cachedMap.qualificationTypeList[this.item.qualificationType],
  //     levelText: cachedMap.levelList[this.item.levelCode],
  //   }
  // }
  get currentQuery() {
    const { channelCode, id } = this.$route.params
    const currentQuery = { channelCode, id }
    return currentQuery
  }
  mounted() {
    this.load()
  }

  async load() {
    this.loading = true
    ; (this.$Spin as any).show()
    const query = this.currentQuery
    try {
      const {
        data: {
          accountCategoryList,
          publishCategoryList,
          ageList,
          item,
          item: {
            name,
            aptitudeType,
            aptitudeNo,
            provinceId,
            cityId,
            countyId,
            addressDetail,
            contact,
            contactTel,
            email,
            qualificationType,
            qualificationCode,
            images,
            types,
            refusedReason,
            levelCode,
            businessDirector,
            cinemas,
            approveStatus,
            validityPeriodDate,
            status,
            photo,
            photoUrl
          }
        }
      } = await queryId(query)
      const imageList = [{
        fileId: photo,
        url: photoUrl
      }]
      this.area = [provinceId || 0, cityId || 0, countyId || 0]
      this.item = item
      this.item.validityPeriodDate = validityPeriodDate
        ? new Date(this.formatValid(validityPeriodDate))
        : ''
      this.imageList = imageList || []
      this.loadingShow = true
      item.status == 1 ? this.title = '审核' : this.title = '编辑'
      ; (this.$Spin as any).hide()
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
        // if (this.cinematype == 1 && this.cinemas.length > 1) {
        //   this.showError('因资源方类型为影院，因此仅能关联一家影院')
        //   return
        // }
        // const route: any = this.$route.params.id || 0
        // let times: any = ''
        // const timesfomat = moment(this.item.validityPeriodDate)
        //   .format(timeFormat)
        //   .split('-')
        // times = Number(timesfomat[0] + timesfomat[1] + timesfomat[2])
        // !this.item.validityPeriodDate ? (times = '') : times
        // const oldQuery = {
        //   ...this.item,
        //   validityPeriodDate: times,
        //   provinceId: Number(this.item.provinceId),
        //   cityId: Number(this.item.cityId),
        //   countyId: Number(this.item.countyId)
        // }
        // const query = clean(oldQuery)
        // const array = Object.keys(query).slice(2)
        // const newqQuery = slice(query, array)
        // const types: any = []
        // this.item.types.forEach((it: any) => {
        //   it.typeCode &&
        //     types.push({
        //       ...it,
        //       typeCategoryCode: it.typeCategoryCode ? it.typeCategoryCode : ''
        //     })
        // })
        // try {
          // let data: any = {}
          // route == 0
          //   ? (data = await addQuery({
          //       ...newqQuery,
          //       cinemas: this.item.typearr[1] ? this.cinemas : [],
          //       types
          //     }))
          //   : (data = await setQuery(route, {
          //       ...newqQuery,
          //       cinemas: this.item.typearr[1] ? this.cinemas : [],
          //       types
          //     }))
          // toast(data.msg)
          // this.$router.go(-1)
        // } catch (ex) {
        //   this.handleError(ex)
        // }
      }
    })
  }

  // @Watch('area')
  // watchArea(val: number[]) {
  //   this.item.provinceId = val[0]
  //   this.item.cityId = val[1]
  //   this.item.countyId = val[2]
  // }

  @Watch('imageList', { deep: true })
  watchImageList(val: any[]) {
    this.item.images = val.map(it => it.fileId)
  }

  // @Watch('typeList', { deep: true })
  // watchTypeList(val: any[]) {
  //   this.item.typeIdList = val.map(it => it.checked ? it.id : 0)
  //   this.item.subTypeIdList = val.map(it => it.checked ? it.subId || 0 : 0)
  // }

  // @Watch('item', { deep: true })
  // watchitem(val: any) {
  //   const form = 'dataForms'
  //   if (val.approveStatus == 3) {
  //     (this.$refs[form] as any).fields.forEach((e: any) => {
  //       if (e.prop == 'validityPeriodDate') {
  //         e.resetField()
  //       }
  //     })
  //   } else if (val.approveStatus == 1) {
  //     (this.$refs[form] as any).fields.forEach((e: any) => {
  //       if (e.prop == 'refusedReason') {
  //         e.resetField()
  //       }
  //     })
  //   }
  //   if (val.typeCategoryCode0) {
  //     this.item.types[0].typeCategoryCode = val.typeCategoryCode0
  //   } else {
  //     this.item.types[0].typeCategoryCode = ''
  //   }
  //   if (val.typeCategoryCode1) {
  //     this.item.types[1].typeCategoryCode = val.typeCategoryCode1
  //   } else {
  //     this.item.types[1].typeCategoryCode = ''
  //   }
  //   if (val.typearr[0]) {
  //     this.item.types[0].typeCode = (this.customerTypeList[0] as any).typeCode
  //   } else {
  //     this.item.types[0].typeCode = ''
  //   }
  //   if (val.typearr[1]) {
  //     this.item.types[1].typeCode = (this.customerTypeList[1] as any).typeCode
  //   } else {
  //     this.item.types[1].typeCode = ''
  //   }
  // }
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
