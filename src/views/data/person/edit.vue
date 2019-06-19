<template>
  <div>
      <Form ref="form" :model="form" :rules="rule" :label-width="105">
          <div class="base-mess">
            <h2 class="title">基础和扩展信息</h2>
            <Row>
                <Col :span="12">
                    <FormItem label="影人标签:">
                        <Input  v-model="form.tip" placeholder=""></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12">
                    <FormItem label="系统评论热词:">
                        <Input type="textarea" v-model="form.tip" placeholder="词组之间以'；'隔开，按照顺序优先显示热词，数量不足再显示抓取的"></Input>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="简介修改:">
                        <Input type="textarea" v-model="form.introduction" placeholder=""></Input>
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="擅长类型:">
                <CheckboxGroup  v-model="form.goodMovieTypes">
                    <Checkbox v-for="(it, index) in (itemList.goodMovieTypes || [])" :key="index" :label="it"></Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="主要职业:">
                <RadioGroup   v-model="form.goodMovieTypes">
                    <Radio  v-for="(it, index) in (itemList.goodMovieTypes || [])" :key="index" :label="it"></Radio >
                </RadioGroup >
            </FormItem>
            <FormItem label="其他职业:">
                <CheckboxGroup  v-model="form.goodMovieTypes">
                    <Checkbox v-for="(it, index) in (itemList.goodMovieTypes || [])" :key="index" :label="it"></Checkbox>
                </CheckboxGroup>
            </FormItem>
            <Row>
                <Col :span="4">
                    <FormItem label="系统鲸娱指数:">{{itemList.biJyIndex}}</FormItem>
                </Col>
                <Col :span="10">
                    <FormItem label="调整鲸娱指数:" class="rest-input"><Input v-model="form.jyIndex" placeholder=""></Input></FormItem>
                </Col>
                <Col :span="10">
                    <FormItem label="调整鲸鱼指数所占权重:" :label-width="160" class="rest-input"><Input v-model="form.jyIndexWeight" placeholder="数字不可超过1"></Input></FormItem>
                </Col>
            </Row>
            <FormItem label="合作品牌信息">
               <div class="brand-select">
                    <Select v-model="brandType" clearable style="width: 120px">
                        <Option v-for="item in brandSel" :key="item.key" :value="item.key">{{item.text}}</option>
                    </Select>
                    <Select v-model="brandName" clearable style="width: 120px">
                        <Option value="GUCCI">GUCCI</option>
                        <Option value="PRADA">PRADA</option>
                        <Option value="PRA">PRA</option>
                        <Option value="PRADA2">PRADA2</option>
                    </Select>
                    <Button @click="addList">添加列表</Button>
               </div>
                <Table :columns="brandColumns" :data="brandData" class="brand-table" border stripe disabled-hover>
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
                       <Input  v-model="form.id" placeholder=""></Input>
                   </FormItem>
                </Col>
                <Col :span="12">
                   <FormItem label="时光影人ID">
                       <Input  v-model="form.id" placeholder=""></Input>
                   </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12">
                   <FormItem label="淘票票影人ID">
                       <Input  v-model="form.id" placeholder=""></Input>
                   </FormItem>
                </Col>
                <Col :span="12">
                   <FormItem label="豆瓣影人ID">
                       <Input  v-model="form.id" placeholder=""></Input>
                   </FormItem>
                </Col>
            </Row>
             <Row>
                <Col :span="12">
                   <FormItem label="票神影人ID">
                       <Input  v-model="form.id" placeholder=""></Input>
                   </FormItem>
                </Col>
            </Row>
          </div>
          <div class="base-mess">
             <h2 class="title">社交平台账号</h2>
             <Row>
                <Col :span="12">
                   <FormItem label="微博">
                       <Input  v-model="form.id" placeholder=""></Input>
                   </FormItem>
                </Col>
                <Col :span="12">
                   <FormItem label="抖音">
                       <Input  v-model="form.id" placeholder=""></Input>
                   </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12">
                   <FormItem label="小红书">
                       <Input  v-model="form.id" placeholder=""></Input>
                   </FormItem>
                </Col>
                <Col :span="12">
                   <FormItem label="微信">
                       <Input  v-model="form.id" placeholder=""></Input>
                   </FormItem>
                </Col>
            </Row>
          </div>
          <div class="base-mess">
              <h2 class="title">粉丝画像信息</h2>
               <Row>
                    <Col :span="12">
                        <FormItem label="粉丝数">
                            <Input  v-model="form.fans.count" placeholder="">人</Input>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="粉丝性别占比" class="rest-input">
                            <div class="flex-box">
                                <div>男性：<Input  v-model="form.fans.male" placeholder="" style="width: 100px"></Input>%</div>
                                <div>女性：<Input  v-model="form.fans.female" placeholder="" style="width: 100px"></Input>%</div>
                            </div>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="粉丝年龄区间">
                    <Table :columns="ageColumns" :data="form.fans.age" class="brand-table rest-input" border stripe disabled-hover>
                        <template slot="v" slot-scope="{row, index}">
                            <Input v-model="row.v" @on-change="updataRow(row, index)" />
                        </template>
                    </Table>
                </FormItem>
                <FormItem label="粉丝省市分布">
                    <div class="brand-select rest-input">
                        <Select v-model="promodel" filterable clearable  style="width: 120px">
                            <Option v-for="option in proSearchList" :value="option.id" :key="option.id">{{option.nameCn}}</Option>
                        </Select>
                        <Input v-model="provinceRatio" placeholder="粉丝数占比" style="width: 120px" />
                        <Button @click="addProvinceList">添加列表</Button>
                    </div>
                    <Table :columns="provinceColumns" :data="form.fans.provinces" class="brand-table" border stripe disabled-hover>
                        <template slot="operate" slot-scope="{row, index}">
                            <span class="del-col" @click="form.fans.provinces.splice(index, 1)">删除</span>
                        </template>
                    </Table>
                </FormItem>
                 <FormItem label="粉丝城市分布">
                    <div class="brand-select rest-input">
                        <Select v-model="citymodel" filterable clearable  style="width: 120px">
                            <Option v-for="option in citySearchList" :value="option.id" :key="option.id">{{option.nameCn}}</Option>
                        </Select>
                        <Input v-model="cityRatio" placeholder="粉丝数占比" style="width: 120px"  />
                        <Button @click="addCityList">添加列表</Button>
                    </div>
                    <Table :columns="cityColumns" :data="form.fans.cities" class="brand-table" border stripe disabled-hover>
                        <template slot="operate" slot-scope="{row, index}">
                            <span class="del-col" @click="form.fans.cities.splice(index, 1)">删除</span>
                        </template>
                    </Table>
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
import {Component, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import { personDetail, queryPro, queryCtiy, editPersonal } from '@/api/person'
import AreaSelect, { areaParam } from '@/components/areaSelect'

@Component({
    components: {
        AreaSelect
    }
})
export default class Main extends ViewBase {
    ass = []
    form: any = {
        fans: {
            count: '',
            male: '',
            female: '',
            age: [
                { k: '18一下', v: 1},
                { k: '18-32岁', v: 1},
                { k: '32-45岁', v: 1},
                { k: '40以上', v: 1},
            ], // 年龄分布
            provinces: [], // 省份分布
            cities: [] // 城市分布
        }
    }
    rule = {}

    detaiId = ''
    itemList = {}

    // 合作品牌信息
    brandType: any = null
    brandName = ''
    brandSel = [
        {key: 1, text: '品牌1'},
        {key: 2, text: '品牌2'},
        {key: 3, text: '品牌3'},
    ]
    brandColumns = [
        {title: '品牌分类', key: 'type', width: 120, align: 'center'},
        {title: '品牌名称', key: 'name', width: 120, align: 'center'},
        {title: '操作', slot: 'operate', width: 120, align: 'center'},
    ]
    brandData = [
        { type: '品牌1', name: 'CUADE'},
    ]

    // 粉丝年龄区间
    ageColumns = [
        { title: '年龄区间', key: 'k', width: 180, align: 'center'},
        { title: '粉丝占比', slot: 'v', width: 180, align: 'center'},
    ]
    // ageData = []

    // 省份分布
    promodel = ''
    proSearchList = []
    provinceRatio = ''
    provinceColumns = [
        {title: '省份', key: 'name', width: 120, align: 'center'},
        {title: '粉丝数占比%', key: 'rate', width: 120, align: 'center'},
        {title: '操作', slot: 'operate', width: 120, align: 'center'},
    ]
    // provinceData: any = []

    // 城市分布
    citySearchList = []
    citymodel = ''
    cityRatio = ''
    cityColumns = [
        {title: '城市', key: 'name', width: 120, align: 'center'},
        {title: '粉丝数占比%', key: 'rate', width: 120, align: 'center'},
        {title: '操作', slot: 'operate', width: 120, align: 'center'},
    ]

    mounted() {
      this.detaiId = this.$route.params.id
      this.list()
      this.queryProvince()
      this.queryCity()
    }

    async list() {
        try {
             const { data: {
              item, genders, status, professions, imageTypes
          }} = await personDetail(this.detaiId)
          this.itemList = item || {}
        } catch (ex) {
            this.handleError(ex)
        }
    }

    async addList() {
        if (this.brandType == '' || this.brandName == '') {
            await alert('请选择信息', { title: '提示'})
        } else {
            const bType = this.brandSel.filter( item => item.key == this.brandType)
            this.brandData.push({
                type: bType[0].text,
                name: this.brandName
            })
        }
    }

    handleDelCol(id: number) {
        this.brandData.splice(id, 1)
    }

    // 省查询
    async queryProvince() {
         try {
            const { data: { items}} = await queryPro({
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
            const { data: { items}} = await queryCtiy({
                pageIndex: 1,
                pageSize: 8888888
            })
            this.citySearchList = items
        } catch (ex) {
            this.handleError(ex)
        }
    }
    async addProvinceList() {
        if (this.promodel != '' || this.provinceRatio != '') {
            let proname: string = ''
            this.proSearchList.map( (item: any) => {
                if (item.id == this.promodel) {
                    proname = item.nameCn
                }
            })
            // 省是否存在
            const ishas = this.form.fans.provinces.some( (item: any) => item.id == this.promodel)
            if (!ishas) {
                this.form.fans.provinces.push({
                    id: this.promodel,
                    name: proname,
                    rate: this.provinceRatio
                })
            } else {
                await info('请选择城市已经存在', {title: '提示'})
            }
        } else {
            await info('请选择省份或者粉丝占比', {title: '提示'})
        }
    }
    async addCityList() {
        if (this.citymodel != '' || this.cityRatio != '') {
            let proname: string = ''
            this.citySearchList.map( (item: any) => {
                if (item.id == this.citymodel) {
                    proname = item.nameCn
                }
            })
            // 城市是否存在
            const ishas = this.form.fans.cities.some( (item: any) => item.id == this.citymodel)
            if (!ishas) {
                this.form.fans.cities.push({
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
            row.v = 0
        }
        this.form.fans.age.splice(ind, 1, row)
    }

    // 提交
    async editSubmit() {
        try {
            const { data } = await editPersonal(this.detaiId, this.form)
            this.$router.push({name: 'data-person'})
        } catch (ex) {
            this.handleError(ex)
        }
    }
}

</script>
<style lang='less' scoped>
@import './less/common.less';
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