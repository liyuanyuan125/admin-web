<template>
  <div>
      <div class="modal-item">
          <h2>KOL平台账号基本信息</h2>
          <p><span>账号：</span><em>xxxxxx</em></p>
          <p><span>功能介绍：</span><em>xxxxxx</em></p>
          <p><span>编辑功能介绍：</span><em>xxxxxx</em></p>
          <p>
              <span>账号分类：</span>
              <RadioGroup v-model="accountType">
                  <Radio :label="item.key" v-for="item in accountTypeList" :key="item.key">{{item.text}}</Radio>
              </RadioGroup>
          </p>
          <p><span>所在地区：</span><em>xxxxx</em></p>
          <p>
              <span>账号类型：</span>
              <RadioGroup v-model="accountItem">
                  <Radio label="1">个人</Radio>
                   <Radio label="2">企业</Radio>
              </RadioGroup>
           </p>
           <p>
               <span>是否认证：</span>
               <RadioGroup v-model="isAuth">
                  <Radio label="1">未认证</Radio>
                  <Radio label="2">已认证</Radio>
               </RadioGroup>
               <em>如果以认证 企业名称</em>
           </p>
      </div>
      <div class="modal-item">
          <h2>KOL平台账号结算信息</h2>
          <Table :columns="settlementCol" :data="settlmentDate" border stripe></Table>
      </div>
       <div class="modal-item">
          <h2>KOL平台账号定价信息</h2>
          <Table :columns="priceCol" :data="priceDate" border stripe></Table>
      </div>
      <div class="modal-item">
          <h2>操作日志</h2>
          <Table :columns="operationLogCol" :data="operationLogDate" border stripe></Table>
      </div>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Main extends ViewBase {
    id = ''
    accountType = 1
    accountItem = '1'
    isAuth = '1'
    accountTypeList = [
        {key: 1, text: '母婴育儿'},
        {key: 2, text: '美容美妆'},
        {key: 3, text: '时尚穿搭'},
    ]
    // kol平台账号结算信息
    settlementCol = [
        {title: '分类', key: 'clas', align: 'center'},
        {title: '结算价', key: 'price', align: 'center'},
        {title: '结算价有效期', key: 'times', align: 'center'}
    ]
    settlmentDate = []

    // kol 平台定价信息
    priceCol = [
        { title: '价格类型', key: 'priceType', align: 'center'},
        { title: '成本价', key: 'costPirce', align: 'center'},
        { title: '定价方式', key: 'priceType', align: 'center'},
        { title: '数值', key: 'priceType', align: 'center'},
        { title: '售价', key: 'priceType', align: 'center'},
    ]
    priceDate = []

    // 操作日志
    operationLogCol = [
        {title: '操作类型', key: 'type', align: 'center'},
        {title: '操作时间', key: 'type', align: 'center'},
        {title: '操作人', key: 'type', align: 'center'},
        {title: '字段', key: 'type', align: 'center'},
        {title: '原值', key: 'type', align: 'center'},
        {title: '新值', key: 'type', align: 'center'},
    ]
    operationLogDate = []
    mounted() {
        this.id = this.$route.params.id
    }
}

</script>
<style lang='less' scoped>
@import '../less/common.less';
</style>