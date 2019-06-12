<template>
  <div>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
    </header>
    <Row>
      <Col :span='2' class='title'>区域</Col>
      <Col :span='2' class='title'>省份</Col>
      <Col :span='20' class='title'>城市</Col>
    </Row>
    <Row>
      <Row class='items'  v-for='(it,index) in areaMapList' :key='index'>
        <Col :span='2'>
          <Row>{{it.text}}</Row>
        </Col>
        <Col :span='22'>
          <Row  v-for='(itpro,key,index) in areaCodeAndProvince' :key='index' v-if='key == it.key'>
            <Row v-for='(its,index) in itpro' :key='index'>
              <Col :span='2'>{{its.name}}</Col>
              <Col :span='20'  v-for='(itcity,key,index) in provinceIdAndCitys' :key='index' v-if='key == its.id'>
                <Col :span='2' v-for='(its,index) in itcity' :key='index'>{{its.name}}</Col>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </Row>
    
    



  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import moment from 'moment'
import { viewcity } from '@/api/beforeplan'
import EditDialog, { Field } from '@/components/editDialog'
import {confirm , warning , success, toast , info } from '@/ui/modal'
import { toMap } from '@/fn/array'


@Component({
  components: {
  }
})
export default class Main extends ViewBase {


  areaMapList: any = []
  areaCodeAndProvince: any = {}
  provinceIdAndCitys: any = {}
  item: any = []

  mounted() {
    this.seach()
  }

  // 返回上一页 && 接单取消按钮
  back() {
    this.$router.go(-1)
  }

  async seach() {
    // this.areaCodeAndProvince = []
    // this.provinceIdAndCitys = []
    try {
      const { data } = await viewcity(this.$route.params.id)
      this.areaMapList = data.areaMapList

      // this.areaCodeAndProvince.push(data.areaCodeAndProvince)
      // this.provinceIdAndCitys.push(data.provinceIdAndCitys)
      this.areaCodeAndProvince = data.areaCodeAndProvince
      this.provinceIdAndCitys = data.provinceIdAndCitys
    } catch (ex) {
      this.handleError(ex)
    } finally {
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
  em, i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}
.title {
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  background: #eee;
  padding-left: 15px;
}
.items {
  line-height: 40px;
  padding-left: 15px;
}
</style>
