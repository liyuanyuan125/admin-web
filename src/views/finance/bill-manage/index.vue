<template>
  <div>
     <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      selectable
      @table-on-sort-change="sortChange"
      :selectedIds.sync = "selectedIds"
      ref="listPage">

      <template slot="year" slot-scope="{row: {year, month}}">
        <span>{{year}}-{{month && String(month).length == 1 ? `0${month}` : month}}</span>
      </template>

      <template slot="operate" slot-scope="{row: {billStatus, id}}">
        <div class="operate-btn">
          <span @click="$router.push({name: 'finance-billmanage-detail', params: {id}})">详情</span><br />
          
          <span v-if="billStatus == 1"
           @click="$router.push({name: 'finance-billmanage-confirmbill', params: {id}})">运营确定账单</span>

           <span v-if="billStatus == 3"
           @click="$router.push({name: 'finance-billmanage-detail', params: {id, audit: 2}})">运营审核账单</span>

           <span v-if="billStatus == 2" @click="changInit(id)">初始化状态</span>
        </div>
      </template>

      <template slot="acts">
        <Button type="info" >
          <a :href= 'href' download>
            <span class="bill-export">导出</span>
          </a>
        </Button>
      </template>

      <template slot="acts-2">
        <Button type="info" @click="handleBatch" >批量确定账单</Button>
      </template>
    </ListPage>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import { clean } from '@/fn/object'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import {list, billInit, changeBills} from '@/api/financeBill'
import CinemaSelect from '@/components/cinemaSelect'
import remoteSelect from '../payroll/data/index.vue'
import company from '../payroll/data/company.vue'

@Component({
  components: {
    ListPage,
    CinemaSelect
  }
})
export default class Main extends ViewBase {
  ajaxBase = VAR.ajaxBaseUrl
  query: any = null

  sortList: any = [
    {text: 'normal', key: 0},
    {text: 'asc', key: 1},
    {text: 'desc', key: 2},
  ]

  selectedIds = []

  fetch = list

  filters: Filter[] = [
    {
      name: 'cinemaId',
      defaultValue: 0,
      component: CinemaSelect,
      width: 108,
      placeholder: '影城名称'
    },
    {
      name: 'code',
      defaultValue: '',
      input: true,
      width: 100,
      placeholder: '影城专资码'
    },

    {
      name: 'resourceId',
      defaultValue: 0,
      component: company,
      width: 100,
      placeholder: '资源方公司名称'
    },

    {
      name: 'resourceBillNo',
      defaultValue: '',
      input: true,
      width: 100,
      placeholder: '账单编号',
    },
    {
      name: 'billStatus',
      defaultValue: 0,
      select: true,
      width: 100,
      placeholder: '账单状态',
    },

    {
      name: 'invoiceStatus',
      defaultValue: 0,
      select: true,
      width: 100,
      placeholder: '发票状态'
    },
    {
      name: 'yearMonth',
      defaultValue: 0,
      date: {
        type: 'month'
      },
      width: 108,
      placeholder: '账单月份'
    },
    {
      name: 'payStatus',
      defaultValue: 0,
      select: true,
      width: 100,
      placeholder: '付款状态',
    },
    {
      name: 'advertType',
      defaultValue: '',
      select: {
        enumKey: 'advertTypeCodeList'
      },
      width: 100,
      placeholder: '广告片类型'
    },
    {
      name: 'showCountSort',
      defaultValue: 0
    },
    {
      name: 'personCountSort',
      defaultValue: 0
    },
    {
      name: 'pageIndex',
      defaultValue: 1
    },

    {
      name: 'pageSize',
      defaultValue: 20
    }
  ]

  columns = [
    { title: '账单编号', key: 'resourceBillNo', minWidth: 65 },
    { title: '影城名称', key: 'cinemaName', minWidth: 100 },
    { title: '影城专资码', key: 'code', minWidth: 80 },
    { title: '资源方名称', key: 'resourceName', minWidth: 80 },
    { title: '合同编号', key: 'contractNo', minWidth: 100 },
    { title: '账单月份', slot: 'year', minWidth: 60 },
    { title: '账单生成时间', key: 'createTime', minWidth: 100, dateTime: true},
    { title: '曝光场次', key: 'showCount', minWidth: 100, sortable: 'custom', sortType: 'normal'},
    { title: '曝光人次/人次', key: 'personCount', minWidth: 130, sortable: 'custom', sortType: 'normal'},
    { title: '广告片类型', key: 'advertType', minWidth: 100, enum: 'advertTypeCodeList'},
    { title: '账单金额', key: 'amount', minWidth: 100 },
    { title: '账单状态', key: 'billStatus', minWidth: 100, enum: true},
    { title: '发票状态', key: 'invoiceStatus', minWidth: 60, enum: true},
    { title: '付款状态', key: 'payStatus', minWidth: 60, enum: true},
    { title: '操作', slot: 'operate', minWidth: 110 },
  ]

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  get href() {
    this.$nextTick(() => {
       this.query = this.listPage
    })
    if (this.query) {
      let str = ''
      /* tslint:disable */
      for (let i in clean(this.query.query)) {
        str += `${i}=${this.query.query[i] || ''}&`
      }
      return `${this.ajaxBase}/xadvert/resource-bills/export?${str.slice(0, -1)}`
    }
    return `${this.ajaxBase}/xadvert/resource-bills/export`
  }


  sortChange(column: any) {
    // 列表查询条件query
    const queryObj = (this.$refs.listPage as any).query
    const keys = column.key // showCount, personCount
    const obj: any = {
      showCount: 'showCountSort',
      personCount: 'personCountSort'
    }

    const sortKey = this.sortList.filter((it: any) => it.text == column.order)[0].key
    queryObj[obj[keys]] = sortKey // 修改query自动触发update方法更新
    this.columns.map((item: any) => {
      if (item.key == keys) {
        return item.sortType = column.order
      }
    })
  }

  mounted() {
    this.sortPerson()
  }

  sortPerson() {
    // 账单审核提交保留筛选条件
    const {personCountSort, showCountSort} = this.$route.query
    if (showCountSort) {
      const showSort = Number(showCountSort)
      this.columns[7].sortType = this.sortList[showSort].text
    }
    if (personCountSort) {
      const personSort = Number(personCountSort)
      this.columns[8].sortType = this.sortList[personSort].text
    }
  }

  async changInit(id: number) {
    try {
      const { data } = await billInit({id})
      ; (this.$refs.listPage as any).update()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async handleBatch() {
    if (this.selectedIds.length == 0) {
      await info('请选择账单数据', {title: '提示'})
      return
    }
    const ids = this.selectedIds
    await confirm(`您选择了${ids.length}条账单进行审核`, {
      title: '批量审核'
    })
    try {
      const { data } = await changeBills({ids})
      ; (this.$refs.listPage as any).update()
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>
<style lang='less' scoped>
.operate-btn {
  span {
    cursor: pointer;
    color: #2d8cf0;
    margin: 4px 6px;
  }
}
.bill-export {
  color: #fff;
}
</style>