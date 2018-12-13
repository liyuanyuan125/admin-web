<template>
  <!-- <Modal v-model='showDlg' :transfer='false' :width='420'>
  </Modal> -->
  <div class="page">
    <div class="inps">
      <div class="Inps-res">
        <div class="res-num">
          <p>注册账号</p>
          <div class="res-num-item">
            <span>admin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【主账号】</span>
          </div>
        </div>
        <div class="res-num">
          <p>所属公司</p>
          <div class="res-num-item">
            <span>北京博纳国际有限公司 【广告主：直客】【资源方：影院】</span>
          </div>
        </div>
        <div class="res-num">
          <p>注册时间</p>
          <div class="res-num-item">
            <span>2018/11/01 12:22:21</span>
            <span style="margin-left:8%;" class="res-date">最后登陆时间</span>
            <span style="margin-left:2%;">2018/11/01 12:22:21</span>
          </div>
        </div>
      </div>
    </div>
      
    <div class="log">
      <div class="logs">
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
.inps {
  background: #ecf0f4;
  padding: 14px;
  padding-top: 19px;
  margin: -10px -10px 0 -10px;
}
.Inps-res {
  width: 100%;
  height: 100%;
  padding: 16px;
  background: #fff;
  font-size: 13px;
  margin-top: -5px;
}
.res-num {
  width: 100%;
  height: 60px;
  line-height: 60px;
}
.res-num p {
  display: inline-block;
  width: 4%;
  text-align: left;
}
.res-num-item {
  width: 80%;
  height: 100%;
  display: inline-block;
}
.res-num-item span {
  display: inline-block;
  margin-left: 4%;
}
.log {
  background: #ecf0f4;
  padding: 14px;
  padding-top: 19px;
  margin: -14px -10px 0 -10px;
}
.logs {
  margin-top: -4px;
  padding: 16px;
  background: #fff;
}
.logs-item {
  line-height: 30px;
}
</style>
