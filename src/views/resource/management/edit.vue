<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1" style="margin-left: 8px" >
        <em v-if="!$route.params.id"> 新建刊例价</em>
        <em v-else> {{title}}</em>
      </div>
    </header>

    <Form ref="dataForm" :model="dataForm" :rules="rule" :label-width="0">
      <div class="detail-box">

        <Row class='titop'>
          <Col :span="2">刊例价</Col>
          <Col span="18" class="red">
            注：结算时根据广告计划的规格时长进行计算，规格时长只能是15的整倍数
          </Col>
        </Row>
        <Row class="detail-content">
          <Col>
            <Col :span="24">
              <Col span="2"><div>每30秒</div></Col>
              <Col span="8">
                <FormItem v-if="!$route.params.id" prop="cpm" class="mt8">
                  <InputNumber style="width: 80px" :min="1" v-model="dataForm.cpm" placeholder=""/>  元/千人次
                </FormItem>
                <div class="detail-height" v-else>
                  {{dataForm.discount}}元/千人次
                </div>
              </Col>
            </Col>
            <Col :span="24">
              <Col span="2"><div>15秒折扣</div></Col>
              <Col span="8">
                <FormItem v-if="!$route.params.id" prop="discount" class="mt8">
                  <InputNumber style="width: 80px" :max="100" :min="1" v-model="dataForm.discount" placeholder=""/>  %
                </FormItem>
                <div class="detail-height" v-else>
                  {{dataForm.cpm}}%
                </div>
              </Col>
            </Col>
          </Col>
        </Row>

        <Row class='titop'>
          <Col :span="2">有效期</Col>
          <Col span="18" class="red">
            注：指定日期与档期重合时，重合日期的有效报价为档期刊例价
          </Col>
        </Row>
        <Row v-if="!$route.params.id" class="detail-content">
          <Row>
            <Col :span="2">
              <FormItem class="mt10">
                <RadioGroup v-model="dateStaus" vertical>
                  <Radio label="1">
                    <Icon type="social-android"></Icon>
                    <span>指定日期</span>
                  </Radio>
                  <Radio class="mt30" label="2">
                    <Icon type="social-windows"></Icon>
                    <span>指定档期</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <FormItem v-if="dateStaus == 1" class="begin-left" prop="showTime">
              <DatePicker type="daterange" @on-change="dateChange" v-model="dataForm.showTime" placement="bottom-start" placeholder="指定日期"  style="width: 220px"></DatePicker>
            </FormItem>
            <div v-else class="begin-right" @click="diaresShow">
              <FormItem prop="diaries[name]">
                <Input v-model="dataForm.diaries.name" readonly placeholder="请选择档期" style="width: 220px" />
              </FormItem>
            </div>
          </Row>
        </Row>
        <Row v-else class="detail-content">
          <Col :span="24">
            <Col span="2">
              <div v-if="diaries.id">
                档期
              </div>
              <div v-else>
                日期
              </div>
            </Col>
            <Col span="8">
              <div class="detail-height" style="width: 100%">
                {{diaries.name}}
              </div>
            </Col>
          </Col>
        </Row>

        <Row class='titop'>
          <Col :span="2">有效范围</Col>
          <Col span="18" class="red">
            注：部分影院有刊例价时，有效报价为部分影院刊例价
          </Col>
        </Row>
        <Row v-if="!$route.params.id" class="detail-content">
          <Row>
            <Col :span="4">
              <FormItem class="mt10">
                <RadioGroup v-model="cinemaStatus" vertical>
                  <Radio label="1">
                    <span>按平台定价等级</span>
                  </Radio>
                  <Radio class="mt40" label="2">
                    <span>按公司设置影院</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>

            <div v-if="cinemaStatus == 1" class="cinema-left">
              <FormItem prop='platform[gradeCode]'>
                <CinemaLevel :ingradeList='gradeList' v-model="dataForm.platform.gradeCode" />
                <span class="cinema-span" v-if="dataForm.platform.gradeCode">共计( {{cinemanums}} )个影院</span>
              </FormItem>
              <FormItem prop='platform[hallTypeList]' v-if="dataForm.platform.gradeCode" style="margin-top: -20px">
                <CheckboxGroup v-model="dataForm.platform.hallTypeList">
                  <Checkbox v-for="(item, index) in hallTypeList" :key="index" :label="item.code">
                    <span>{{item.name}}</span>
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </div>
            
            <div v-else class="cinema-right">
              <FormItem prop="companyId">
                <CinemaList v-model="dataForm.companyId" @input="cinemeClean" style="width: 220px" />
              </FormItem>
            </div>
          </Row>
          <Row v-if="cinemaStatus != 1 && dataForm.companyId">
            <Col :span="14" class="cinema-add">
              <FormItem prop="company[cinemaList]" :show-message="!(dataForm.company.cinemaList.length > 0)">
                <PartBindCinema :companyId="dataForm.companyId" :inhallTypeList='hallTypeList' v-model="dataForm.company.cinemaList" class="part-bind-cinema"/>
              </FormItem>
            </Col>
          </Row>
        </Row>

        <Row v-else class="detail-content">
          <Col>
            <Col v-if="dataForm.platform.gradeCode" :span="24">
              <Col span="2"><div>平台定价等级</div></Col>
              <Col span="8">
                <div class="detail-height">
                 <span>{{dataForm.platform.gradeCode}}级</span>
                 <span style="margin-left: 8px" v-for="item in dataForm.platform.hallTypeList" :key="item.name">{{item.name}}</span>
                </div>
              </Col>
            </Col>
            <Col v-if="companyName" :span="24">
              <Col span="2"><div>公司关联影院</div></Col>
              <Col span="8">
                <div class="detail-height">{{companyName}}</div>
                  <PartBindCinema style="margin-bottom: 20px" type="detail" :companyId="dataForm.companyId" :inhallTypeList='hallTypeList' v-model="dataForm.company.cinemaList" class="part-bind-cinema"/>
              </Col>
            </Col>
          </Col>
        </Row>
      </div>
    </form>

    <div class="edit-button" v-if="!$route.params.id">
      <Button style="padding: 6px 40px" type="info" size="large" @click="edit('dataForm')">保存</Button>
    </div>
    <DlgEdit ref="diaries" v-if="diariesShow" v-model="dataForm.diaries" />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import DlgEdit from './dlgEdit.vue'
import CinemaLevel from '@/components/priceLevel.vue'
import CinemaList from '@/components/companyList.vue'
import PartBindCinema from './partBindCinema.vue'
import moment from 'moment'
import { clean } from '@/fn/object'
import { cinemaLevel, cinemanum, addRateCard, rateCardDetail } from '@/api/rateCard'
import { toast } from '@/ui/modal.ts'

const timeFormat = 'YYYYMMDD'
@Component({
  components: {
    DlgEdit,
    CinemaLevel,
    CinemaList,
    PartBindCinema
  }
})
export default class Main extends ViewBase {
  dataForm: any = {
    cpm: 1,
    discount: 1,
    showTime: [],
    name: '',
    platform: {
      gradeCode: null,
      hallTypeList: []
    },
    company: {
      companyId: null,
      cinemaList: []
    },
    diaries: {
      id: '',
      begin: 0,
      end: 0,
      name: ''
    },
    companyId: null,
  }

  title = ''
  companyName = ''
  hallTypeList: any = []
  gradeList: any = []

  // 定价等级 影院数
  cinemanums: any = ''

  diaries: any = {
    id: '',
    name: ''
  }

  diariesShow = false
  dateStaus = '1'
  cinemaStatus = '1'

  get cinemaLev() {
    return this.dataForm.platform.gradeCode
  }

  get rule() {
    const validatorDate = (rule: any, value: any, callback: any) => {
      if (value[0] == '') {
        callback(new Error('请选择指定日期'))
      } else {
        callback()
      }
    }

    const cinemaVali = ( rules: any, value: any, callback: any) => {
      if (value.length > 0) {
        callback()
      } else {
        callback(new Error('请选择关联影院'))
      }
    }

    return {
      cpm: [
        { required: true, message: '不能为空', trigger: 'change', type: 'number' }
      ],
      discount: [
        { required: true, message: '不能为空', trigger: 'change', type: 'number' }
      ],
      showTime: [
        { validator: validatorDate, trigger: 'change', type: 'array' }
      ],
      'diaries[name]': [
        { required: true, message: '请选择档期', trigger: 'change' }
      ],
      'platform[gradeCode]': [
        { required: true, message: '请选择定价等级', trigger: 'change' }
      ],
      companyId: [
        { required: true, message: '请选择公司', trigger: 'change', type: 'number' }
      ],
      'platform[hallTypeList]': [
        { required: true, message: '请选择类型', trigger: 'change', type: 'array' }
      ],
      'company[cinemaList]': [
        { validator: cinemaVali }
      ]
    }
  }

  created() {
    this.levelList()
    this.search()
  }

  async search() {
    const id = this.$route.params.id || 0
    const dataForm = this.dataForm
    if (!id) {
      return
    }
    (this.$Spin as any).show()
    try {
      const {
        data
      } = await rateCardDetail(id)
      dataForm.cpm = data.cpm
      dataForm.discount = data.discount
      const beginDate = this.autoTime(data.beginDate + '')
      const endDate = this.autoTime(data.endDate + '')
      if (data.calendarId != null) {
        this.diaries.id = data.calendarId
        this.diaries.name = `${data.calendarName}${beginDate}~${endDate}`
      } else {
        this.diaries.name = `${beginDate}~${endDate}`
      }
      if (data.platform) {
        dataForm.platform.gradeCode = data.platform.gradeDesc
        dataForm.platform.hallTypeList = data.platform.hallTypeList || []
        this.title = '平台刊例价'
      }
      if (data.company) {
        this.title = '公司刊例价'
        this.companyName = data.company.companyName
        this.dataForm.company.cinemaList = data.company.cinemaList.map((it: any) => {
          const hallName = it.hallList.map((itmes: any) => {
            return itmes.name
          })
          return {
            id: it.id,
            cinemaName: it.name,
            hallName
          }
        })
      }
      (this.$Spin as any).hide()
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    }
  }

  autoTime(num: any) {
    if (!num) {
      return ''
    }
    const year = num.slice(0, 4)
    const month = num.slice(4, 6)
    const day = num.slice(6)
    return `${year}-${month}-${day}`
  }

  async levelList() {
    try {
      const {
        data: {
          gradeList,
          hallTypeList
        }
      } = await cinemaLevel()
      this.gradeList = gradeList
      this.hallTypeList = hallTypeList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  dateChange() {

  }

  cinemeClean() {
    this.dataForm.company.cinemaList = []
  }

  diaresShow() {
    this.diariesShow = true
    this.$nextTick(() => {
      (this.$refs.diaries as any).init()
    })
  }

  async edit(dataForm: any) {
    const volid = await (this.$refs[dataForm] as any).validate()
    if (!volid) {
      return
    }
    const dataForms = this.dataForm
    const oldquery = {
      cpm: dataForms.cpm,
      discount: dataForms.discount,
      calendarId: this.dateStaus == '1' ? '' : dataForms.diaries.id,
      beginDate: this.dateStaus == '1' ?
        Number(moment(dataForms.showTime[0]).format(timeFormat)) : dataForms.diaries.begin,
      endDate: this.dateStaus == '1' ?
        Number(moment(dataForms.showTime[1]).format(timeFormat)) : dataForms.diaries.end,
    }
    const cinemaList = dataForms.company.cinemaList ? dataForms.company.cinemaList.map((it: any) => {
      const id = it.hallList.map((its: any) => {
        return {id: its}
      })
      return {
        id: it.id,
        hallList: id
      }
    }) : []
    let platform: any = {}
    let company: any = {}
    if (this.cinemaStatus != '1') {
      company = {
        companyId: dataForms.companyId,
        cinemaList
      }
    } else {
      const hallTypeList = dataForms.platform.hallTypeList.map((it: any) => {
        return {
          code: it
        }
      })
      platform = {
        gradeCode: dataForms.platform.gradeCode,
        hallTypeList
      }
    }
    const query = this.cinemaStatus != '1' ? {
      ...oldquery,
      company
    } : {
      ...oldquery,
      platform
    }
    try {
      await addRateCard(clean(query))
      toast('添加成功')
      this.$router.go(-1)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  back() {
    this.$router.go(-1)
  }

  async cinemacount(val: string) {
    if (!val) {
      return
    }
    try {
      const res = await cinemanum(val)
      this.cinemanums = res.data.cinemaCount || 0
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('cinemaLev')

  watchcinemaLev(val: any) {
    this.cinemacount(val)
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

.site-content {
  height: 665px;
}

.header {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;
  em, i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}
.red {
  font-size: 14px;
  color: red;
}
.titop {
  line-height: 28px;
  color: rgb(61, 156, 235);
  font-size: 16px;
}
.detail-content {
  margin-bottom: 20px;
  border: 1px solid #dcdee2;
  padding-top: 6px;
  padding-left: 14px;
  /deep/ .ivu-col-span-2 {
    div {
      line-height: 50px;
    }
  }
  /deep/ .detail-height {
    height: 50px;
    line-height: 50px;
  }
  .begin-left {
    position: absolute;
    left: calc(100% / 24 * 2);
    top: 8px;
  }
  .begin-right {
    position: absolute;
    left: calc(100% / 24 * 2);
    bottom: 0;
  }
  .cinema-left {
    position: absolute;
    left: calc(100% / 24 * 3);
    top: 8px;
  }
  .cinema-span {
    position: absolute;
    width: 300px;
    left: 230px;
    top: 3px;
  }
  .cinema-right {
    position: absolute;
    left: calc(100% / 24 * 3);
    bottom: 0;
  }
  .cinema-add {
    margin-left: calc(100% / 24 * 3);
  }
  .mt8 {
    margin-top: 8px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .mt20 {
    margin-top: 20px;
  }
  .mt30 {
    margin-top: 30px;
  }
  .mt40 {
    margin-top: 40px;
  }
}
.edit-button {
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
}
.part-bind-cinema {
  width: 660px;
}
</style>
