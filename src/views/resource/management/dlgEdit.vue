<template>
  <Modal 
    v-model='showDlg'
    :transfer='false'
    :width='620'
    title='选择档期'
    @on-cancel="cancel"
    >
    <Form ref="dataForm" :model="dataForm" label-position="left" :label-width="0">
      <FormItem>
        <Icon size="28" type="ios-arrow-back" @click="dataForm.years -= 1" />
          <InputNumber ref="input" style="width:80px" v-model="dataForm.years" placeholder="请输入"/>
        <Icon size="28" @click="dataForm.years += 1" type="ios-arrow-forward" />
      </FormItem>
    </Form>

    <Row v-if="dataLoading">
      <Col class="demo-spin-col" span="22">
        <Spin fix>
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </Col>
    </Row>
    <div v-else>
      <div class="no-diar" v-if="total == 0">
        暂无档期
      </div>
      <div class="diaries-height">
        <div @click="checkId(item)" :class="['diaries-date', invalue.id == item.id ? 'diaries-check' : '']" v-for="(item, index) in data" :key="index">
          <span>
            {{item.name}} <b>[</b>{{formatTime(item.beginDate)}} ~ {{formatTime(item.beginDate)}}<b>]</b>
          </span>
        </div>
      </div>
    </div>
    

    <div class="page-wrap" v-if="total > 0">
    <Page :total="total" :current="dataForm.pageIndex" :page-size="dataForm.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => dataForm.pageIndex = page"
        @on-page-size-change="pageSize => dataForm.pageSize = pageSize"/>
    </div>
    <div  slot="footer" class="dialog-footer">
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { drairesList } from '@/api/rateCard'
@Component
export default class ComponentMain extends ViewBase {
  @Prop() value!: any
  @Prop() checkName!: any
  showDlg = true
  rolads = false
  total = 0
  invalue = {...this.value}
  data: any = []
  dataLoading = true
  dataForm = {
    years: new Date().getFullYear(),
    pageIndex: 1,
    pageSize: 10,
  }

  checkId(item: any) {
    this.invalue.id = item.id
    this.$emit('input', {
      id: item.id,
      name: `${item.name} [${this.formatTime(item.beginDate)} ~ ${this.formatTime(item.beginDate)} ]  `
    })
    this.showDlg = false
  }

  init() {
    this.showDlg = true
  }

  created() {
    this.doSeach()
  }

  cancel() {
    this.showDlg = false
  }

  async doSeach() {
    this.dataLoading = true
    try {
      const query = { ...this.dataForm }
      const {
        data: {
          items,
          totalCount
        }
      } = await drairesList(query)
      this.dataLoading = false
      this.total = totalCount
      this.data = items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  formatTime(num: any) {
    num = num + ''
    if (!num) {
      return ''
    }
    const year = num.slice(0, 4)
    const month = num.slice(4, 6)
    const day = num.slice(6)
    return `${year}-${month}-${day}`
  }
  // 表单提交
  async dataFormSubmit(dataForms: any) {
     this.dataForm.years = this.dataForm.years + 1
  }

  @Watch('dataForm', {deep: true})
  watchdataForm(val: any) {
    this.doSeach()
  }

}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 15px;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  height: 250px;
  position: relative;
}
.diaries-height {
  min-height: 250px;
}
.no-diar {
  position: absolute;
  top: 200px;
  left: 270px;
  font-size: 18px;
}
.diaries-date {
  float: left;
  margin-right: 2%;
  width: 48%;
  height: 30px;
  line-height: 30px;
  background: #f2f2f2;
  cursor: pointer;
  &:hover {
    background: #09f;
    span {
      color: #fff;
    }
  }
  span {
    margin-left: 20px;
    b {
      margin-left: 5px;
      margin-right: 5px;
    }
  }
}
.diaries-check {
  background: #09f;
  span {
    color: #fff;
  }
}
</style>