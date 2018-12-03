<template>
  <!-- <Modal v-model='showDlg' :transfer='false' :width='420'>
  </Modal> -->
  <div class="page">
      <div class="Inps-res">
        <div class="res-num">
          <p>用户账号</p>
          <div class="res-num-item">
            <span>admin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【主账号】</span>
          </div>
        </div>
        <div class="res-num">
          <p>所属公司</p>
          <div class="res-num-item">
            <span>北京博纳国际有限公司</span>
          </div>
        </div>
        <div class="res-num">
          <p>最后登陆时间</p>
          <div class="res-num-item">
            <span>2018/11/01 12:22:21</span>
          </div>
        </div>
        <div class="res-num">
          <p>注册时间</p>
          <div class="res-num-item">
            <span>2018/11/01 12:22:21</span>
          </div>
        </div>
      </div>
    <div class="log">
        <div class="logs-item">
            <span>2018/11/23</span>
            <span>10:22:12</span>由
            <span>老麦 </span>
            将资质审核状态修改为 “已通过”
        </div>
        <div class="logs-item">
            <span>2018/11/23</span>
            <span>10:22:12</span>由
            <span>老麦 </span>
            将资质审核状态修改为 “已通过”
        </div>
        <div class="logs-item">
            <span>2018/11/23</span>
            <span>10:22:12</span>由
            <span>老麦 </span>
            将资质审核状态修改为 “已通过”
        </div>
        <div class="logs-item">
            <span>2018/11/23</span>
            <span>10:22:12</span>由
            <span>老麦 </span>
            将资质审核状态修改为 “已通过”
        </div>
        <div class="logs-item">
            <span>2018/11/23</span>
            <span>10:22:12</span>由
            <span>老麦 </span>
            将资质审核状态修改为 “已通过”
        </div>

    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import View from '@/util/View'

@Component
export default class ComponentMain extends View {
  showDlg = false
}
</script>

<style lang="less" scoped>
.Inps-res {
  width: 100%;
  height: 100%;
  padding-top: 16px;
  background: #fff;
  font-size: 13px;
  border-bottom:1px #ccc solid ;
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
.log{
  margin-top:6px;
}
.logs-item {
  line-height:30px;
}
</style>
