<template>
  <div>
    <Form ref="form" :model="form" :rules="rule" :label-width="115">
      <div class="base-mess">
        <h2 class="title">基础和扩展信息</h2>
        <Row>
          <Col :span="10">
            <FormItem label="品牌中文名称:" prop="name">
              <Input v-model="form.name" placeholder></Input>
            </FormItem>
          </Col>
          <Col :offset="2" :span="10">
            <FormItem label="品牌外文名称:" prop="enName">
              <Input v-model="form.enName" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="10">
            <FormItem :show-message="form.logo.length == 0" label="品牌logo:" prop="logo">
              <Upload v-model="form.logo" :maxCount="1" accept="image/*" />
            </FormItem>
          </Col>
          <Col :offset="2"  :span="6">
            <FormItem label="品牌大图:" prop="headImgBig">
              <Upload v-model="form.headImgBig" :maxCount="1" accept="image/*" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="10">
            <FormItem label="所属行业:" prop="tradeCode">
              <Select v-model="form.tradeCode" filterable clearable>
                <Option
                  v-for="(item, index) in tradeCodeList"
                  :value="item.key"
                  :key="index"
                >{{ item.text }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :offset="2"  :span="10">
            <FormItem label="所属国家:">
              <Select v-model="form.countryCode" filterable clearable>
                <Option
                  v-for="(item, index) in countryCodeList"
                  :value="item.key"
                  :key="index"
                >{{ item.text }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="10" >
            <FormItem label="创始人:">
              <Input v-model="form.founder" placeholder></Input>
            </FormItem>
          </Col>
          <Col :span="10" :offset="2" >
            <FormItem label="创立时间:">
              <DatePicker type="date" v-model="form.foundDate" placeholder="请选择创立时间"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <FormItem label="品牌口号:">
              <Input
                type="textarea"
                v-model="form.companySlogan"
                placeholder="词组之间以'；'隔开，按照顺序优先显示热词，数量不足再显示抓取的"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <FormItem label="简介修改:" prop="description">
              <Input type="textarea" v-model="form.description" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="10" >
            <FormItem label="搜索关键字:">
              <Input v-model="form.keyWords" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
      </div>

      <div class="base-mess">
        <h2 class="title">粉丝画像信息</h2>
        <Row>
          <Col :span="6">
            <FormItem label="粉丝性别占比" prop="malePercent" class="rest-input">
              <div>
                男性：
                <Input v-model="form.malePercent" placeholder style="width: 100px"></Input>%
              </div>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label prop="femalePercent" :labelWidth="0" class="rest-input">
              <div>
                女性：
                <Input v-model="form.femalePercent" placeholder style="width: 100px"></Input>%
              </div>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="粉丝年龄区间">
          <Table
            :columns="ageColumns"
            :data="ageCodeList"
            class="brand-table rest-input"
            border
            stripe
            disabled-hover
          >
            <template slot="v" slot-scope="{row, index}">
              <Input style="width:100px" v-model="row.v" @on-change="updataRow(row, index)" /><span>%</span>
            </template>
          </Table>
        </FormItem>
        <FormItem label="粉丝省市分布">
          <div class="brand-select rest-input">
            <Select v-model="promodel" filterable clearable style="width: 120px">
              <Option
                v-for="option in proSearchList"
                :value="option.id"
                :key="option.id"
              >{{option.nameCn}}</Option>
            </Select>
            <Input v-model="provinceRatio" placeholder="粉丝数占比" style="width: 120px" />
            <Button @click="addProvinceList">添加列表</Button>
          </div>
          <Table
            :columns="provinceColumns"
            :data="fans.provinces"
            class="brand-table"
            border
            stripe
            disabled-hover
          >
            <template slot="operate" slot-scope="{row, index}">
              <span class="del-col" @click="fans.provinces.splice(index, 1)">删除</span>
            </template>
          </Table>
        </FormItem>
        <FormItem label="粉丝城市分布">
          <div class="brand-select rest-input">
            <Select v-model="citymodel" filterable clearable style="width: 120px">
              <Option
                v-for="option in citySearchList"
                :value="option.id"
                :key="option.id"
              >{{option.nameCn}}</Option>
            </Select>
            <Input v-model="cityRatio" placeholder="粉丝数占比" style="width: 120px" />
            <Button @click="addCityList">添加列表</Button>
          </div>
          <Table
            :columns="cityColumns"
            :data="fans.citys"
            class="brand-table"
            border
            stripe
            disabled-hover
          >
            <template slot="operate" slot-scope="{row, index}">
              <span class="del-col" @click="fans.citys.splice(index, 1)">删除</span>
            </template>
          </Table>
        </FormItem>
      </div>

      <div class="base-mess">
        <h2 class="title">推荐信息</h2>
        <FormItem label="推荐的KOL列表:">
          <kol :channelCodeList="channelCodeList" v-model="kollist"></kol>
        </FormItem>
        <FormItem label="推荐的影片列表:">
          <Film v-model="filmlist"></Film>
        </FormItem>
      </div>
      <div class="footer-btn">
        <Button type="primary" class="btn">浏览</Button>
        <Button type="primary" @click="editSubmit">保存</Button>
      </div>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import { personDetail, queryPro, queryCtiy, editPersonal } from '@/api/person'
import { brandbefore, editbrand, addbrand, brandDetail } from '@/api/brand'
import moment from 'moment'
import AreaSelect, { areaParam } from '@/components/areaSelect'
import Upload from '@/components/Upload.vue'
import kol from './kol/kolist.vue'
import Film from './kol/film.vue'
import { clean } from '@/fn/object'
import { toMap } from '@/fn/array'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormat = 'YYYYMMDD'
@Component({
  components: {
    AreaSelect,
    Upload,
    kol,
    Film
  }
})
export default class Main extends ViewBase {
  ass = []
  form: any = {
    name: '',
    keyWords: '',
    enName: '',
    logo: [],
    foundDate: '',
    countryCode: '',
    tradeCode: '',
    founder: '',
    companySlogan: '',
    description: '',
    femalePercent: '',
    malePercent: '',
    headImgBig: [],
  }

  fans: any = {
    provinces: [], // 省份分布
    citys: [] // 城市分布
  }

  kollist: any = []
  filmlist: any = []
  ageCodeList: any = []
  channelCodeList: any = []
  countryCodeList: any = []
  tradeCodeList: any = []
  detaiId = ''
  itemList = {}

  options: any = {
    disabledDate(date: any) {
      return date && date.valueOf() > Date.now()
    }
  }
  get rule() {
    const jinyu = (rule: any, value: any, callback: any) => {
      const jinyurg: any = /^[0-9]+(.[0-9]{2})?$/
      if (value == '') {
        return callback()
      }
      if (!jinyurg.test((value + ''))) {
        return callback(new Error('格式不对'))
      } else {
        if (value > 100) {
          return callback(new Error('数字不能大于100'))
        } else {
          return callback()
        }
      }
    }
    return {
      name: [
        { required: true, message: '品牌中文名称', trigger: 'blur' }
      ],
      logo: [{
        required: true, type: 'array', len: 1, message: '请上传图片', trigger: 'change'}
      ],
      tradeCode: [
        { required: true, message: '请选择行业', trigger: 'change' }
      ],
      description: [
        { required: true, message: '请输入描述', trigger: 'blur' }
      ],
      malePercent: [
        { validator: jinyu, trigger: 'change' }
      ],
      femalePercent: [
        { validator: jinyu, trigger: 'change' }
      ],
    }
  }

  // 粉丝年龄区间
  ageColumns = [
    { title: '年龄区间', key: 'text', width: 180, align: 'center' },
    { title: '粉丝占比', slot: 'v', width: 180, align: 'center' }
  ]
  // ageData = []

  // 省份分布
  promodel = ''
  proSearchList = []
  provinceRatio = ''
  provinceColumns = [
    { title: '省份', key: 'name', width: 120, align: 'center' },
    { title: '粉丝数占比%', key: 'rate', width: 120, align: 'center' },
    { title: '操作', slot: 'operate', width: 120, align: 'center' }
  ]
  // provinceData: any = []

  // 城市分布
  citySearchList = []
  citymodel = ''
  cityRatio: any = ''
  cityColumns = [
    { title: '城市', key: 'name', width: 120, align: 'center' },
    { title: '粉丝数占比%', key: 'rate', width: 120, align: 'center' },
    { title: '操作', slot: 'operate', width: 120, align: 'center' }
  ]

  logo(val: any) {
  }

  bigimage(val: any) {}

  mounted() {
    this.detaiId = this.$route.params.id
    this.queryProvince()
    this.queryCity()
    this.init()
  }

  created() {
    this.brandbeforelist()
  }

  async init() {
    try {
      if (!this.$route.params.id) {
        return
      }
      const {
        data: { item }
      } = await brandDetail(this.$route.params.id)
        this.form.name = item.name
        this.form.enName = item.enName
        this.form.logo = item.logo ? [
          {
            url: item.logoUrl,
            fileId: item.logo
          }
        ] : []
        this.form.foundDate = item.foundDate ? moment(this.formatDate(item.foundDate)).toDate() : ''
        this.form.countryCode = item.countryCode
        this.form.tradeCode = item.tradeCode
        this.form.founder = item.founder
        this.form.companySlogan = (item.companySlogan || '')
        this.form.description = item.description
        this.form.femalePercent = item.femalePercent ? item.femalePercent / 100 : ''
        this.form.malePercent = item.malePercent ? item.malePercent / 100 : ''
        this.ageCodeList = item.ages ? (this.ageCodeList || []).map((it: any, index: number) => {
          return {
            ...it,
            v: item.ages[index].v,
            k: item.ages[index].v
          }
        }) : []
        this.fans.provinces = item.provinces || []
        this.fans.citys = item.citys || []
        this.form.keyWords = (item.keyWords || []).join(';')
        this.filmlist = item.movies || []
        this.form.headImgBig = item.headImgBig ? [
          {
            url: item.headImgBigUrl,
            fileId: item.headImgBig
          }
        ] : []
        const kols = makeMap(this.channelCodeList)
        this.kollist = (item.kols || []).map((it: any) => {
          return {
            ...it,
            name: kols[it.channelCode],
            rate: it.channelName
          }
        })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  formatDate(data: any) {
    return data ? `${(data + '').slice(0, 4)}-${(data + '').substr(4, 2)}-${(data + '').substr(6, 2)}` : '暂无'
  }

  async brandbeforelist() {
    try {
      const {
        data: { ageCodeList, channelCodeList, countryCodeList, tradeCodeList }
      } = await brandbefore()
      this.ageCodeList = (ageCodeList || []).map((it: any) => {
        return {
          ...it,
          k: it.key,
          v: it.key,
        }
      })
      this.channelCodeList = channelCodeList
      this.countryCodeList = countryCodeList
      this.tradeCodeList = tradeCodeList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 省查询
  async queryProvince() {
    try {
      const {
        data: { items }
      } = await queryPro({
        parentIds: 0,
        pageIndex: 1,
        pageSize: 8888888
      })
      this.proSearchList = items
    } catch (ex) {
      this.handleError(ex)
    }
  }
  // 市查询
  async queryCity() {
    try {
      const {
        data: { items }
      } = await queryCtiy({
        pageIndex: 1,
        pageSize: 8888888
      })
      this.citySearchList = items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async addProvinceList() {
    if (this.promodel != '' && this.provinceRatio != '') {
      const jinyu: any = /^[0-9]{0,2}(.[0-9]{2})?$/
      if (!jinyu.test((this.provinceRatio + ''))) {
        info('粉丝占比应该为不大于100的数字')
        return
      }
      let proname: string = ''
      this.proSearchList.map((item: any) => {
        if (item.id == this.promodel) {
          proname = item.nameCn
        }
      })
      // 省是否存在
      const ishas = this.fans.provinces.some(
        (item: any) => item.id == this.promodel
      )
      if (!ishas) {
        this.fans.provinces.push({
          id: this.promodel,
          name: proname,
          rate: this.provinceRatio
        })
      } else {
        await info('请选择城市已经存在', { title: '提示' })
      }
    } else {
      await info('请选择省份或者粉丝占比', { title: '提示' })
    }
  }

  async addCityList() {
    if (this.citymodel != '' && this.cityRatio != '') {
      const jinyu: any = /^[0-9]{0,2}(.[0-9]{2})?$/
      if (!jinyu.test((this.cityRatio + '')) && this.cityRatio > 100) {
        info('粉丝占比应该为不大于100的数字')
        return
      }
      let proname: string = ''
      this.citySearchList.map((item: any) => {
        if (item.id == this.citymodel) {
          proname = item.nameCn
        }
      })
      // 城市是否存在
      const ishas = this.fans.citys.some((item: any) => item.id == this.citymodel)
      if (!ishas) {
        this.fans.citys.push({
          id: this.citymodel,
          name: proname,
          rate: this.cityRatio
        })
      } else {
        await info('请选择城市已经存在', {
          title: '提示'
        })
      }
    } else {
      await info('请选择城市或者粉丝占比', {
        title: '提示'
      })
    }
  }

  updataRow(row: any, ind: number) {
    if (row.v == '') {
      row.v = null
    }
    this.ageCodeList.splice(ind, 1, row)
  }

  // 提交
  async editSubmit() {
    try {
      const valid = await (this.$refs.form as any).validate()
      if (!valid) {
        return
      }
      const agetable = this.ageCodeList.map((it: any) => {
        return {
          k: it.key,
          v: it.k
        }
      })
      const kols = this.kollist.map((it: any) => {
        return {
          channelCode: it.channelCode,
          channelDataId: it.channelDataId,
          channelName: it.rate
        }
      })
      const keyWords = (this.form.keyWords || '').split(';')
      const query = clean({
        id: this.$route.params.id,
        ...this.form,
        ...this.fans,
        keyWords,
        headImgBig: this.form.headImgBig.map((it: any) => it.fileId).join(''),
        logo: this.form.logo.map((it: any) => it.fileId).join(''),
        ages: agetable,
        kols,
        foundDate: this.form.foundDate[0] ? moment(this.form.foundDate).format(timeFormat) : '',
        movies: this.filmlist,
        malePercent: this.form.malePercent ? this.form.malePercent * 100 : '',
        femalePercent: this.form.femalePercent ? ~~(this.form.femalePercent * 100) : '',
      })
      if (this.$route.params.id) {
        await editbrand(query)
      } else {
        await addbrand(query)
      }
      this.$router.push({ name: 'data-brand' })
      // this.$router.push({ name: 'data-person' })
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>
<style lang='less' scoped>
.base-mess {
  font-size: 14px;
  border: solid 1px #ededed;
  padding: 10px 15px;
  margin-bottom: 15px;
  background: #fff;
  .title {
    font-size: 14px;
    padding-bottom: 20px;
  }
  .ivu-col {
    p {
      padding-bottom: 15px;
      display: flex;
      label {
        display: block;
        width: 90px;
      }
    }
  }
  .hot-word {
    display: -webkit-box;
  }
}
/deep/ .ivu-form {
  .ivu-form-item-label {
    font-size: 14px;
  }
}
.brand-table {
  width: 362px;
  margin-top: 15px;
  /deep/ .ivu-table {
    background: none;
    &::before {
      background-color: none;
    }
  }
  .del-col {
    cursor: pointer;
    color: #2d8cf0;
  }
}
.brand-select {
  /deep/ .ivu-select {
    margin-right: 10px;
  }
}
.footer-btn {
  text-align: center;
  .btn {
    margin-right: 15px;
  }
}
</style>
