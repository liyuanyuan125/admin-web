<template>
  <div>
      <Tabs v-model="tab" type="card">
        <TabPane v-for="item in tabList" :key="item.key" :label="item.text" ></TabPane>
     </Tabs>
      <Form v-if="tab == 0" ref="form" :model="form" :rules="rule" :label-width="105">
          <div class="base-mess">
            <h2 class="title">基础和扩展信息</h2>
            <Row>
                <Col :span="12">
                    <FormItem label="影人标签:">
                        <Input  v-model="form.tip" placeholder=""></Input>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="系统评论热词:">
                        <Input type="textarea" v-model="form.tags" placeholder="关键词中文‘，’隔开，按照顺序优先显示热词，数量不足再显示抓取的"></Input>
                        <p>关键词‘，’隔开，按照顺序优先显示热词，数量不足再显示抓取的</p>
                    </FormItem>
                </Col>
            </Row>

            <Row> 
                <Col :span="24">
                    <FormItem label="简介修改:">
                        <Input type="textarea" class="info-textarea" :rows="6" v-model="form.introduction" placeholder=""></Input>
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col :span="22">
                  <FormItem label="擅长类型:">
                        <RadioGroup  v-model="form.goodMovieTypes">
                            <Radio v-for="it in movieTypes" :key="it.key" :label="it.key">{{it.value}}</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="主要职业:">
                        <RadioGroup   v-model="form.primaryPro">
                            <Radio  v-for="it in occupationType" :key="it.key" :label="it.key">{{it.value}}</Radio >
                        </RadioGroup >
                    </FormItem>
                    <FormItem label="其他职业:">
                        <CheckboxGroup  v-model="form.restPro">
                            <Checkbox v-for="(it, index) in occupationType" :key="it.key" :label="it.key">{{it.value}}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col :span="5">
                <FormItem label="上传大图:"> 
                     <Upload v-model="form.imageList" :maxCount="1" accept="image/*" />
                     <p>点击上传大图</p>
                </FormItem>
                </Col>
            </Row>
            
            <Row>
                <Col :span="4">
                    <FormItem label="系统鲸娱指数:">{{form.biJyIndex}}</FormItem>
                </Col>
                <Col :span="7">
                    <FormItem label="调整鲸娱指数:" class="rest-input">
                        <Input v-model="form.jyIndex" placeholder="" style="width: 150px"></Input>
                    </FormItem>
                </Col>
                <Col :span="7">
                    <FormItem label="调整鲸娱指数所占权重" :label-width="180" class="rest-input" >
                        <Input v-model="form.jyIndexWeight" style="width: 150px" placeholder="数字不可超过1"/>%
                    </FormItem>
                </Col>
            </Row>

            <FormItem label="合作品牌信息">
               <div class="brand-select">
                    <Select v-model="brandType" clearable style="width: 150px" placeholder="品牌分类">
                        <Option v-for="item in tradeCodeList" :key="item.key" :value="item.key">{{item.text}}</option>
                    </Select>
                    <Select v-model="brandNameId" style="width: 150px" placeholder="品牌名称" ref="refBrandName"
                     clearable  filterable remote :remote-method="remoteMethod">
                        <Option v-for="it in brandNames" :key="it.id" :value="it.id">{{it.name}}</option>
                    </Select>
                    <Button :disabled="isBrandDisabled" @click="addList">添加列表</Button>
               </div>
                <Table :columns="brandColumns" :data="brandData" class="brand-table" border stripe disabled-hover>
                    <template slot="tradeCode" slot-scope="{row: {tradeCode}}">
                        <span v-for="it in tradeCodeList" :key="it.key" v-if="it.key == tradeCode">{{it.text}}</span>
                    </template>
                    <template slot="operate" slot-scope="{row, index}">
                        <span class="del-col" @click="handleDelCol(index)">删除</span>
                    </template>
                </Table>
            </FormItem>

          </div>

          <div class="base-mess">
            <h2 class="title">其他电影平台相关id</h2>
            <Row>
                <Col :span="12">
                   <FormItem label="猫眼影人ID">
                       <Input  v-model="formId.maoyan" placeholder=""></Input>
                   </FormItem>
                </Col>
                <Col :span="12">
                   <FormItem label="时光影人ID">
                       <Input  v-model="formId.mtime" placeholder=""></Input>
                   </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12">
                   <FormItem label="淘票票影人ID">
                       <Input  v-model="formId.taopiaopiao" placeholder=""></Input>
                   </FormItem>
                </Col>
                <Col :span="12">
                   <FormItem label="豆瓣影人ID">
                       <Input  v-model="formId.douban" placeholder=""></Input>
                   </FormItem>
                </Col>
            </Row>
             <Row>
                <Col :span="12">
                   <FormItem label="票神影人ID">
                       <Input  v-model="formId.piaoshen" placeholder=""></Input>
                   </FormItem>
                </Col>
            </Row>
          </div>
          <div class="base-mess">
             <h2 class="title">社交平台账号</h2>
             <Row>
                <Col :span="12">
                   <FormItem label="微博">
                       <Input  v-model="formId.weibo" placeholder=""></Input>
                   </FormItem>
                </Col>
                <Col :span="12">
                   <FormItem label="抖音">
                       <Input  v-model="formId.douyin" placeholder=""></Input>
                   </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12">
                   <FormItem label="小红书">
                       <Input  v-model="formId.xiaohongshu" placeholder=""></Input>
                   </FormItem>
                </Col>
                <Col :span="12">
                   <FormItem label="微信">
                       <Input  v-model="formId.wechat" placeholder=""></Input>
                   </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12">
                   <FormItem label="快手">
                       <Input  v-model="formId.kuaishou" placeholder=""></Input>
                   </FormItem>
                </Col>
            </Row>
          </div>
          <div class="base-mess">
              <h2 class="title">粉丝画像信息</h2>
               <Row>
                    <!-- <Col :span="12">
                        <FormItem label="粉丝数(人)">
                            <Input v-model="formFans.count" placeholder=""/>
                        </FormItem>
                    </Col> -->
                    <Col :span="12">
                        <FormItem label="粉丝性别占比" class="rest-input">
                            <div class="flex-box">
                                <div>男性：<InputNumber :max="100" :min="0" style="width: 120px"  v-model="form.male" ></InputNumber>%</div>
                                <div>女性：<InputNumber :max="100" :min="0" style="width: 120px" v-model="form.female" ></InputNumber>%</div>
                            </div>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="粉丝年龄区间">
                    <Table :columns="ageColumns" :data="(form.ages || [])" class="brand-table rest-input" border stripe disabled-hover>
                        <template slot="v" slot-scope="{row, index}">
                            <InputNumber :max="100" :min="0" 
                            v-model="row.v"
                            @on-change="updataRow(row, index)" />
                        </template>
                    </Table>
                </FormItem>
                <FormItem label="粉丝省市分布">
                    <div class="brand-select rest-input">
                        <Select v-model="promodel" filterable clearable  style="width: 120px" 
                        :label-in-value="true" @on-change="(val) => provinceObject = val">
                            <Option v-for="option in proSearchList" :value="option.id" :key="option.id" :label="option.nameCn">{{option.nameCn}}</Option>
                        </Select>
                        <InputNumber  :max="100" :min="0"  v-model="provinceRatio" placeholder="粉丝数占比" style="width: 120px"  />
                        <Button class="add-list" :disabled="isDisble" @click="addProvinceList">添加列表</Button>
                    </div>
                    <Table :columns="provinceColumns" :data="(itemList.fansProvinces || [])" class="brand-table" border stripe disabled-hover>
                        <template slot="operate" slot-scope="{row, index}">
                            <span class="del-col" @click="itemList.fansProvinces.splice(index, 1)">删除</span>
                        </template>
                    </Table>
                </FormItem>
                 <FormItem label="粉丝城市分布">
                    <div class="brand-select rest-input">
                        <Select v-model="citymodel" filterable clearable  style="width: 120px"
                        :label-in-value="true" @on-change="(val) => cityObject = val">
                            <Option v-for="option in citySearchList" :value="option.id" :key="option.id">{{option.nameCn}}</Option>
                        </Select>
                        <InputNumber  :max="100" :min="0"  v-model="cityRatio" placeholder="粉丝数占比" style="width: 120px"  />
                        <Button class="add-list" :disabled="isCityDisble" @click="addCityList">添加列表</Button>
                    </div>
                    <Table :columns="cityColumns" :data="(itemList.fansCities || [])" class="brand-table" border stripe disabled-hover>
                        <template slot="operate" slot-scope="{row, index}">
                            <span class="del-col" @click="itemList.fansCities.splice(index, 1)">删除</span>
                        </template>
                    </Table>
                </FormItem>
          </div>
          <div class="footer-btn">
              <Button type="primary" :to="{name: 'data-person'}" class="btn">返回</Button>
              <Button type="primary" @click="editSubmit">保存</Button>
          </div>
      </Form>
      <div v-if="tab == 1">
           <personMovies :id ="id" @selectIds = "selectIds" v-show="tab == 1"></personMovies>
            <div class="footer-btn">
              <Button type="primary" @click="handleMaterMoive" class="btn">添加设置作品</Button>
          </div>
      </div>
  </div>
</template>

<script lang='ts'>
import {Component, Watch, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import {
    personDetail,
    queryPro,
    queryCtiy,
    editPersonal,
    tradeCode,
    dicItems,
    masterMovies
    } from '@/api/person'
import AreaSelect, { areaParam } from '@/components/areaSelect'
import Upload from '@/components/Upload.vue'
import personMovies from './editMovies.vue'
@Component({
    components: {
        AreaSelect,
        Upload,
        personMovies
    }
})
export default class Main extends ViewBase {
    @Prop({type: Number, default: 0}) id!: number // 375284
    tab = 0
    tabList = [
        {key: 0, text: '基本信息'},
        {key: 1, text: '相关影片'}
    ]
    // ass = []
    form: any = {}
    formId: any = {}
    rule = {}
    // 擅长类型， 职业
    movieTypes: any[] = []
    occupationType: any[] = []

    itemList: any = {}

    // 上传图片
    // imageList: any[] = []
    exts: any[] = []

    // 合作品牌信息
    isBrandDisabled = true
    tradeCodeList: any[] = []
    brandType: any = null
    brandNameId: any = null
    brandNames: any[] = []
    brandTradeCode = null
    brandColumns = [
        {title: '品牌分类', slot: 'tradeCode', width: 120, align: 'center'},
        {title: '品牌名称', key: 'name', width: 120, align: 'center'},
        {title: '操作', slot: 'operate', width: 120, align: 'center'},
    ]
    brandData: any[] = []

    // 粉丝年龄区间
    ageColumns = [
        { title: '年龄区间', key: 'k', width: 180, align: 'center'},
        { title: '粉丝占比%', slot: 'v', width: 180, align: 'center'},
    ]

    // 省份分布
    isDisble = true
    promodel =  null
    provinceObject: any = null
    proSearchList = []
    provinceRatio = null
    provinceColumns = [
        {title: '省份', key: 'name', width: 120, align: 'center'},
        {title: '粉丝数占比%', key: 'rate', width: 120, align: 'center'},
        {title: '操作', slot: 'operate', width: 120, align: 'center'},
    ]

    // 城市分布
    isCityDisble = true
    cityObject: any = null
    citySearchList = []
    citymodel = null
    cityRatio = null
    cityColumns = [
        {title: '城市', key: 'name', width: 120, align: 'center'},
        {title: '粉丝数占比%', key: 'rate', width: 120, align: 'center'},
        {title: '操作', slot: 'operate', width: 120, align: 'center'},
    ]

    // 影人代表作品
    movieIds: any[] = []

    mounted() {
      this.goodTypes()
      this.handleOccupation()
      this.list()
      this.queryProvince()
      this.queryCity()
    }

    async list() {
        try {
          const {  item, genders, status, professions, imageTypes, brandTrades} = await personDetail(this.id)
          this.itemList = item || {}
          this.brandData = item.brands || []
          this.formId = item.formId || {}
          this.tradeCodeList = brandTrades

        // 处理粉丝展示
        const intro =  item.introduction ?
                       item.introduction.replace(/&nbsp;/g, ' ').replace(/\<br\/>/g, '\r\n') : item.introduction
        this.form = {
            tip: item.tip || null,
            tags: item.tags ? item.tags.join() : null,
            introduction: intro,
            imageList: item.setImageList,
            biJyIndex: item.biJyIndex,
            jyIndex: item.jyIndex,
            jyIndexWeight: item.jyIndexWeight,
            goodMovieTypes: item.goodMovieTypes ? item.goodMovieTypes[0] : null, // 擅长类型只有一个
            primaryPro: item.primaryPro[0] || null, // 主要职业
            restPro: item.restPro, // 其他职业
            male: Number(item.fansMale),
            female: Number(item.fansFemale),
            ages: item.fansAges,

        }
        } catch (ex) {
            this.handleError(ex)
        }
    }

    // 提交
    async editSubmit() {
        const obj = {
            formId: this.formId,
            items: this.itemList,
            form: this.form,
            brands: this.brandData,
        }
        try {
            const { data } = await editPersonal(obj)
            this.$router.push({name: 'data-person'})
        } catch (ex) {
            this.handleError(ex)
        }
    }

    updataRow(row: any, ind: number) {
        if (row.v == '') {
            row.v = null
        }
        this.itemList.fansAges.splice(ind, 1, row)
    }

    async addList() {
        // 品牌id是唯一的，不能重复追加
        const isHasBrand = this.brandData.some((item: any) => item.id == this.brandNameId)
        if (isHasBrand) {
            await info('你选择的品牌已存在', { title: '提示'})
            this.brandType = ''
            this.brandNameId = ''
            this.brandNames = []
            return
        }
        const bName = this.brandNames.find((item: any) => item.id == this.brandNameId)
        this.brandData.push({
            id: this.brandNameId,
            name: bName.name,
            tradeCode: this.brandType || this.brandTradeCode // 模糊查询筛选出的品牌分类
        })
        this.brandType = ''
        this.brandNameId = ''
        this.brandNames = []
    }

    handleDelCol(id: number) {
        this.brandData.splice(id, 1)
    }
    // 擅长类型
    async goodTypes() {
        try {
            const { data } = await dicItems('MOVIE_TYPE')
            this.movieTypes = data || []
        } catch (ex) {
            this.handleError(ex)
        }
    }
    // 职业
    async handleOccupation() {
        try {
            const { data } = await dicItems('MOVIE_OCCUPATION_TYPE')
            this.occupationType = data
        } catch (ex) {
            this.handleError(ex)
        }
    }

    // 省查询
    async queryProvince() {
        this.proSearchList = await queryPro()
    }
    // 市查询
    async queryCity() {
        this.citySearchList = await queryCtiy()
    }

    async addProvinceList() {
        // 省是否存在
        const ishas = this.itemList.fansProvinces.some( (item: any) => item.id == this.promodel)
        if (!ishas) {
            this.itemList.fansProvinces.push({
                id: this.promodel,
                name: this.provinceObject.label,
                rate: this.provinceRatio
            })
            this.promodel = null
            this.provinceRatio = null
        } else {
            await info('请选择城市已经存在', {title: '提示'})
        }
    }
    async addCityList() {
        // 城市是否存在
        const ishas = this.itemList.fansCities.some( (item: any) => item.id == this.citymodel)
        if (!ishas) {
            this.itemList.fansCities.push({
                id: this.citymodel,
                name: this.cityObject.label,
                rate: this.cityRatio
            })
            this.citymodel = null
            this.cityRatio = null
        } else {
            await info('请选择城市已经存在', {
                title: '提示'
            })
        }
    }
    // 模糊查询筛选出品牌名称
    async remoteMethod(query: any) {
        if (query) {
            const { data: {items} } = await tradeCode({
                tradeCode: this.brandType,
                name: query, // 模糊查询
                pageIndex: 1
            })
            this.brandNames = items || []
            this.brandTradeCode = items[0].tradeCode
        }
    }
    // 根据品牌分类筛选出品牌名称
    async tradeCode() {
        const { data: {items} } = await tradeCode({
            tradeCode: this.brandType,
            pageIndex: 1
        })
        this.brandNames = items || []
    }

    selectIds(val: any) {
      this.movieIds = val
    }
    // 添加作品
    async handleMaterMoive() {
        try {
            const { data } = await masterMovies({
                personId: this.id,
                movieIds: this.movieIds
            })
            this.$router.push({name: 'data-person'})
        } catch (ex) {
            this.handleError(ex)
        }
    }

    // 监听品牌类型选择
    @Watch('brandType')
    handleBrandType(type: string) {
        if (type) {
            this.tradeCode()
        }
    }
    // 监听品牌名称id
    @Watch('brandNameId')
    handleBrandID() {
        this.isBrandDisabled =  this.brandNameId ? false : true
    }

    // 监听粉丝省市分布and 粉丝比例
    @Watch('promodel')
    watchPromodel(val: any) {
        this.isDisble = this.promodel && this.provinceRatio ? false : true
    }
    @Watch('provinceRatio')
    watchRatio(val: any) {
        this.isDisble = this.promodel && this.provinceRatio ? false : true
    }

    // 监听粉丝城市and 粉丝比例
    @Watch('citymodel')
    watchCitymodel() {
        this.isCityDisble = this.citymodel && this.cityRatio ? false : true
    }
    @Watch('cityRatio')
    watchCityRatio() {
        this.isCityDisble = this.citymodel && this.cityRatio ? false : true
    }
}
</script>
<style lang='less' scoped>
@import './less/common.less';
.upload-box {
  background: none;
}

.flex-box {
  display: flex;
}
.rest-input {
  /deep/ .ivu-input {
    width: 100%;
    margin-right: 15px;
  }
}
.footer-btn {
  text-align: center;
  .btn {
    margin-right: 15px;
  }
}
</style>