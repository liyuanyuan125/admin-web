<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1" style="margin-left: 8px" >
        <em v-if="!$route.params.id"> 新建刊例价</em>
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
                <FormItem prop="cpm" class="mt8">
                  <InputNumber style="width: 80px" :min="1" v-model="dataForm.cpm" placeholder=""/>  元/千人次
                </FormItem>
              </Col>
            </Col>
            <Col :span="24">
              <Col span="2"><div>15秒折扣</div></Col>
              <Col span="8">
                <FormItem prop="discount" class="mt8">
                  <InputNumber style="width: 80px" :max="100" :min="1" v-model="dataForm.discount" placeholder=""/>  %
                </FormItem>
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
        <Row class="detail-content">
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

        <Row class='titop'>
          <Col :span="2">有效范围</Col>
          <Col span="18" class="red">
            注：部分影院有刊例价时，有效报价为部分影院刊例价
          </Col>
        </Row>
        <Row class="detail-content">
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
              <FormItem prop='cinemaLevel'>
                <CinemaLevel :ingradeList='gradeList' v-model="dataForm.cinemaLevel" />
                <span class="cinema-span" v-if="dataForm.cinemaLevel">共计( {{cinemanums}} )个影院</span>
              </FormItem>
              <FormItem v-if="dataForm.cinemaLevel" style="margin-top: -20px">
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
              <FormItem>
                <PartBindCinema :companyId="dataForm.companyId" :inhallTypeList='hallTypeList' v-model="dataForm.company.cinemaList" class="part-bind-cinema"/>
              </FormItem>
            </Col>
          </Row>
        </Row>
      </div>
    </form>

    <div class="edit-button" v-if="$route.params.id">
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
import { clean } from '@/fn/object'
import { cinemaLevel, cinemanum, addRateCard, rateCardDetail } from '@/api/rateCard'

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
      gradeCode: '',
      hallTypeList: []
    },
    company: {
      companyId: null,
      cinemaList: []
    },
    diaries: {
      id: '',
      name: ''
    },
    cinemaLevel: '',
    companyId: null,
  }

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
    return this.dataForm.cinemaLevel
  }

  get rule() {
    const validatorDate = (rule: any, value: any, callback: any) => {
      if (value[0] == '') {
        callback(new Error('请选择指定日期'))
      } else {
        callback()
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
      cinemaLevel: [
        { required: true, message: '请选择定价等级', trigger: 'change' }
      ],
      companyId: [
        { required: true, message: '请选择公司', trigger: 'change', type: 'number' }
      ]
    }
  }

  created() {
    this.levelList()
    this.search()
  }

  async search() {
    const id = this.$route.params.id || 0
    if (!id) {
      return
    }
    try {
      await rateCardDetail(id)
    } catch (ex) {

    }
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
    if (volid) {
      return
    }
    const dataForms = this.dataForm
    const oldquery = {
      cpm: dataForms.cpm,
      discount: dataForms.discount,
      calendarId: dataForms.diaries.id,
      beginDate: dataForms.showTime[0] ? new Date(dataForms.showTime[0]).getTime() : '',
      endDate: dataForms.showTime[0] ? new Date(dataForms.showTime[0]).getTime() : '',
    }
    let platform: any = {}
    let company: any = {}
    if (dataForms.companyId) {
      company = {
        companyId: dataForms.companyId
      }
    } else {
      platform = dataForms.platform
    }
    const query = dataForms.companyId ? {
      ...oldquery,
      company
    } : {
      ...oldquery,
      platform
    }
    try {
      await addRateCard(clean(query))
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
  color: red;
}
.titop {
  line-height: 28px;
  color: rgb(61, 156, 235);
  font-size: 16px;
}
.detail-content {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  padding-top: 6px;
  padding-left: 14px;
  /deep/ .ivu-col-span-2 {
    div {
      line-height: 50px;
      width: 88px;
    }
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
  margin-bottom: 30px;
  text-align: center;
}
.part-bind-cinema {
  width: 660px;
}
</style>
