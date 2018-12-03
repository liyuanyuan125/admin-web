<template>
  <Modal v-model='showDlg' :transfer='false' :width='420'>
  </Modal>
  <!-- <div class="info">
      <div class="info-ver">账户审核<Icon class="info-Icon" type="md-close"   @click="examinefalse" size="22"/></div>
      <div class="info-ver">账户审核</div>
      <div class="info-type">
          <div class="info-type-t">
              <div>注册账号<span>adadadadada</span></div>
              <div>账号类型<span>主账号</span></div>
          </div>
          <div class="info-type-t">审核意见
              <RadioGroup>
                  <Radio label="通过"></Radio>
                  <Radio label="拒绝"></Radio>
              </RadioGroup>
          </div>
          <div class="info-type-t info-type-inp">
              所属公司<LazyInput  placeholder="公司名称" class="input"/><Icon type="ios-alert" color="#FF9900" size="24"/><span  @click="saveCompany(0)">保存为新公司</span>
          </div>
            <Button type="primary" @click="primary">确认</Button>
            <Button @click="goback">返回</Button>
      </div>
    </div> -->
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import View from '@/util/View'
import { queryList } from '@/api/account'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { clean } from '@/fn/object'

@Component
export default class ComponentMain extends View {
  showDlg = false
  primary() {
    alert('OK')
  }
  saveCompany(id: number) {
    const params: any = id > 0 ? { id } : {}
    this.$router.push({ name: 'client-corp-edit', params })
  }
  goback() {
  const mymessage = confirm ('确定要退出此次编辑吗?' )
    if (mymessage == true) {
      this.$router.push({ name: 'client-account' })
    } else {

    }
  }
}
</script>

<style lang="less" scoped>
// .input,
// /deep/ .ivu-select {
//   width: 200px;
//   margin-left: 8px;
//   &:first-child {
//     margin-left: 5.5%;
//   }
// }
// .info {
//   width: 100%;
//   background: #fff;
//   font-size: 14px;
//   z-index: 10;
// }
// .info-ver {
//   width: 100%;
//   height: 43px;
//   line-height: 43px;
//   padding-left: 3%;
//   border-bottom: 1px solid #ccc;
// }
// .info-ver .info-Icon {
//   float: right;
//   margin-right: 3%;
//   font-weight: bold;
//   margin-top: 10px;
// }
// .info-type {
//   padding: 17px;
// }
// .info-type-t {
//   width: 100%;
//   line-height: 50px;
// }
// .info-type-t div span {
//   margin-left: 5.5%;
// }
// .info-type-t .ivu-radio-group {
//   margin-left: 5%;
// }
// .info-inp {
//   margin-left: 5%;
// }
// .info-type-inp span {
//   margin-left: 1%;
//   color: #53A1F3;
//   cursor: pointer;
//   text-decoration: underline;
// }
// .info-type Button {
//   margin-top: 2%;
//   margin-left: 4%;
// }
</style>
