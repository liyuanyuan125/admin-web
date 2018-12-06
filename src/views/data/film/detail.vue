<template>
  <div class="page">
    {{detil}}
    <div class="Inp-Group-res">
      <div class="Inps-res">
        <div class="res-num">
          <p>电影名称：</p>
          <div class="res-num-item change-item">
            <span>{{detil.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="Inp-Group-res">
      <div class="Inps-res">
        <div class="res-num">
          <p>英文名称</p>
          <div class="res-num-item change-item">
            <span>{{detil.name}}</span>
          </div>
        </div>
      </div>
      <div class="Inps-res">
        <div class="res-num">
          <p>电影名称：</p>
          <div class="res-num-item change-item">
            <span>{{detil.name}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component } from 'vue-property-decorator'
import View from '@/util/View'

@Component
export default class Main extends View {
  detil: any = null
  created() {
    if (!sessionStorage.getItem('film-detil')) {
      sessionStorage.setItem('film-detil', JSON.stringify(this.$route.params))
    }
    const deatls: any = sessionStorage.getItem('film-detil')
    this.detil = JSON.parse(deatls)
  }
}
</script>

<style lang="less" scoped>
.sec {
  width: 254px;
  margin-left: 9%;
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.Inp-Group-res,
.res-Group {
  background: #eee;
  padding: 10px;
  margin: -10px -10px 0 -10px;
}
.res-Group {
  margin-top: -5px;
}
.Inps-res,
.res-Inps {
  width: 100%;
  height: 100%;
  padding-top: 16px;
  background: #fff;
  font-size: 13px;
}
.res-num {
  width: 100%;
  height: 60px;
  line-height: 60px;
}
.res-num p {
  display: inline-block;
  width: 9%;
  text-align: left;
  margin-left: 2%;
}
.res-num-item {
  width: 80%;
  height: 100%;
  display: inline-block;
}
.res-num-item span {
  margin-left: 4%;
}
.blu1,
.blu2 {
  color: #53a1f3;
  cursor: pointer;
}
.new-number {
  background: #eee;
  padding: 10px;
  margin: -10px -10px 0 -10px;
}
.new-num {
  width: 100%;
  height: 100%;
  padding: 8px;
  background: #fff;
  font-size: 13px;
}
.info {
  width: 33%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  top: 20%;
  left: 20%;
  font-size: 14px;
}
.info-ver {
  width: 100%;
  height: 43px;
  line-height: 43px;
  padding-left: 3%;
  border-bottom: 1px solid #ccc;
}
.info-ver .info-Icon {
  float: right;
  margin-right: 3%;
  font-weight: bold;
  margin-top: 10px;
}
.info-type {
  padding: 17px;
  line-height: 40px;
  font-size: 14px;
}
.info-type-inp span {
  margin-left: 1%;
  color: #53a1f3;
  cursor: pointer;
  text-decoration: underline;
}
.info-type div span {
  margin-left: 10%;
  color: #aaa;
}
.info-type div select {
  margin-left: 10%;
  width: 200px;
  height: 30px;
  line-height: 30px;
  color: #999;
}
.info-type .ivu-radio-group {
  margin-left: 5%;
}
.info-inp {
  margin-left: 5%;
}
.info-type button {
  margin-top: 2%;
  margin-left: 22%;
}
.info-type .info-red {
  width: 255px;
  color: red;
  font-weight: normal;
  font-size: 12px;
  line-height: 13px;
  margin-left: 24%;
  margin-top: 1%;
}
  </style>
