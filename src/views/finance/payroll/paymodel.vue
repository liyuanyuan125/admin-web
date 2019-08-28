<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='1220'
    title="申请付款"
    @on-cancel="cancel('dataForm')"
    >

    <Table :columns="columns" :data="tableData"
      border stripe disabled-hover size="small" class="table">
      <template slot="month" slot-scope="{ row: { year, month } }">
        <div class="row-acts">
          {{year}}-{{month}}
        </div>
      </template>
      <template slot="action" slot-scope="{row}" >
        <div style="display: flex;">￥<InputNumber :min="1" v-model="tablemoney[row.id]"></InputNumber></div>
      </template>
    </Table>

    <div style="display: flex; margin: 30px 0">
      <span style="width: 50px">描述：</span>
      <Input v-model="descript" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="" />
    </div>
    <div slot="footer" class="dialog-footer">
      <Button type="primary" @click="dataFormSubmit">确定</Button>
      <Button @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { clean } from '@/fn/object'
import { billslist, addAudit } from '@/api/payroll'
import { commoncolums } from './before'
import { toMap } from '@/fn/array'
import moment from 'moment'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
@Component
export default class ComponentMain extends ViewBase {
  showDlg = false
  id: any = []
  tablemoney: any = {}
  items: any = []
  invoiceContentList: any = []
  invoiceTypeList: any = []
  descript = ''
  init(id: any) {
    this.showDlg = true
    this.id = id
    this.detail()
  }

  get columns() {
    return commoncolums
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
        invoiceContentCode: cachedMap.invoiceContentList[it.invoiceContentCode],
        invoiceType: cachedMap.invoiceTypeList[it.invoiceType],
        approvalTime: it.approvalTime ? moment(it.approvalTime).format('YYYY/MM/DD HH:mm:ss') : ''
      }
    })
    return list
  }

  async detail() {
    try {
      const { data: {
        items,
        invoiceContentList,
        invoiceTypeList
      }} = await billslist(this.id.join(','))
      this.invoiceTypeList = invoiceTypeList
      this.invoiceContentList = invoiceContentList
      this.items = items || []
      this.items.forEach((it: any) => {
        this.$set(this.tablemoney, it.id, it.mayApplyAmount)
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  cancel() {
    this.showDlg = false
    this.descript = ''
  }

  // 表单提交
  async dataFormSubmit() {
    try {
      await addAudit({
        applyBills: this.tableData.map((it: any) => {
          return {
            orderId: it.id,
            applyAmount: this.tablemoney[it.id] ? this.tablemoney[it.id] : ''
          }
        }),
        remark: this.descript
      })
      this.cancel()
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 15px;
}
.next-city {
  position: absolute;
  top: 14px;
  left: 120px;
  font-size: 14px;
  color: #17233d;
  font-weight: 700;
}
.hiht {
  margin-left: 15px;
  color: #6b6b6b;
}
/deep/ span:only-child:empty {
  &::before {
    content: '-';
  }
}
</style>