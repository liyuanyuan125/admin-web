<template>
  <Form ref="form" :label-width="40">
    <div class="base-mess">
      <!-- <h2 class="title">请款单详情</h2>
      <Row>
        <Col :span="24">
          <Table :columns="columns" :data="tableData"
            border stripe disabled-hover size="small" class="table">
            <template slot="audit" slot-scope="{row}" >
              <span>{{row.applyAmount}}</span>
            </template>
          </Table>
        </Col>
      </Row> -->

       <Row>
          <Col :span="12">
            <FormItem label="备注:" prop="name">
              <span>{{submitRemark}}</span>
            </FormItem>
          </Col>
        </Row>
      <h2 class="title">操作日志</h2>
      <Row>
        <Col v-for='(it, index) in operateLogList' :key='index'>
         <span>【{{it.createUserName}}】于</span>
         <span>{{time(it.createTime)}}</span>
         <span>{{it.description}}</span>
        </Col>
      </Row>
    </div>
  </Form>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import { auditdetail } from '@/api/payroll'
import { commoncolums } from './before'
import { toMap } from '@/fn/array'
import moment from 'moment'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
@Component
export default class Main extends ViewBase {
  datalist: any = []
  items: any = []
  operateLogList: any = []
  invoiceTypeList: any = []
  invoiceContentList: any = []
  submitRemark: string = ''
  created() {
    this.detail()
  }

  get cacheMap() {
     return {
      invoiceContentList: makeMap(this.invoiceContentList),
      invoiceTypeList: makeMap(this.invoiceTypeList),
    }
  }

  get tableData() {
    const cachedMap = this.cacheMap
    const list = (this.items || []).map((it: any) => {
      return {
        ...it,
        invoiceContentList: cachedMap.invoiceContentList[it.invoiceContentCode],
        invoiceTypeList: cachedMap.invoiceTypeList[it.invoiceType],
        approvalTime: it.approvalTime ? moment(it.approvalTime).format('YYYY/MM/DD') : ''
      }
    })
    return list
  }

  time(time: any) {
    return time ? moment(time).format('YYYY-MM-DD hh:ss') : '-'
  }

  async detail() {
    try {
      const { data: {
          items,
          operateLogList,
          invoiceTypeList,
          invoiceContentList,
          submitRemark
        }
      } = await auditdetail(this.$route.params.id)
      this.items = items
      this.submitRemark = submitRemark
      this.operateLogList = operateLogList
      this.invoiceTypeList = invoiceTypeList
      this.invoiceContentList = invoiceContentList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  get columns() {
    return commoncolums.map((it: any) => {
      if (it.title == '操作') {
        return { title: '申请付款金额', align: 'center', slot: 'audit',  minWidth: 120 }
      }
      return it
    })
  }

  back() {
    this.$router.go(-1)
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';
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
</style>
