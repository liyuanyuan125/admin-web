<template>
  <div>
     <div class="base-mess">
       <h2 class="title">投放信息</h2>
       <ListPage
        :fetch="fetch"
        :filters="filters"
        :enums="enums"
        :columns="columns"
        ref="listPage">

        <template slot="status" slot-scope="{row, index}">
          <Select v-model="row.status" size="small" @on-change="handleSelect(row, index)" style="width:90px">
            <Option :value="2" :key="2" >是</Option>
            <Option :value="1" :key="1" >否</Option>
          </Select>
        </template>

        <template slot="remark" slot-scope="{row}">
          <Input v-model="row.remark" style="width: 90px" />
        </template>

      </ListPage>
     </div>

     <div class="footer">
       <Button type="primary" @click="handleBill" class="btn">提交</Button>
       <Button @click="$router.push({name: 'finance-billmanage'})">取消</Button>
     </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { resourceBillDetail, operateConfirm} from '@/api/financeBill'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import {intDate, toThousands} from '@/util/dealData'
import { formatNumber } from '@/util/validateRules'
import { uniqBy, reject, pick, intersectionBy, map, cloneDeep, findIndex } from 'lodash'

@Component({
  components: {
    ListPage
  }
})


export default class Main extends ViewBase {
  @Prop({ type: Number}) id!: number

  statusList = []
  dataList: any[] = []

  billDetails: any[] = []

  filters: Filter[] = [
    {
      name: 'id',
      defaultValue: 0,
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

  enums = [
    'statusList',
    'movieCustomList',
    'playMonitorStatusList'
  ]

  columns = [
    { title: '广告片名称', key: 'videoName', minWidth: 90 },
    { title: '影片名称', key: 'movieName', minWidth: 90 },
    { title: '投放时长', key: 'specification', minWidth: 90 },
    { title: '执行开始时间', key: 'beginDate', minWidth: 90 },
    { title: '执行完成时间', key: 'endDate', minWidth: 90 },
    { title: '曝光场次', key: 'showCount', minWidth: 90 },
    { title: '曝光人次/人次', key: 'personCount', minWidth: 90 },
    { title: '单价/元/人次', key: 'unitPrice', minWidth: 90 },
    { title: '金额', key: 'amount', minWidth: 90 },
    { title: '监播文件', key: 'playMonitorStatus', minWidth: 90, editor: 'enum' },
    { title: '是否需要结算', slot: 'status', minWidth: 90, },
    { title: '备注', slot: 'remark', minWidth: 90 },
  ]

  handleSelect(val: any, index: number) {
    // 修改状态往dataList数组push， 如果ids已经存在则修改status的状态
    const ind = findIndex(this.dataList, (it: any) => it.id == val.id)
    if (ind >= 0) {
      this.dataList[ind] = val
    } else {
      this.dataList.push(val)
    }
  }

  async handleBill() {
    const items = (this.dataList || []).filter((it: any) => it.status == 1)
    const billDetails = items.map((it: any) => {
      return {
        id: it.id,
        status: it.status,
        remark: it.remark
      }
    })

    try {
      const { data } = await operateConfirm({
        id: this.id,
        billDetails
      })
      this.$router.push({name: 'finance-billmanage'})
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async fetch(query: any) {
    const {data } = await resourceBillDetail(query)
    this.statusList = data.statusList

    // this.dataList 里面的数据和当前页 data.items 数据做比较
    const items = (this.dataList || []).filter((it: any) => it.status == 1)
    const intersection = intersectionBy(items, data.items, 'id')
    const ids = map(intersection, 'id')

    // 如果ids存在则表示修改
    const item = (data.items || []).map((it: any) => {
       return {
        ...it,
        beginDate: intDate(it.beginDate),
        endDate: intDate(it.endDate),
        personCount: toThousands(it.personCount),
        amount: formatNumber(it.amount),
        status: ids.includes(it.id) ? 1 : it.status,
      }
    })

    return {
      ...data,
      items: item
    }
  }

}
</script>
<style lang='less' scoped>
@import '~@/views/data/person/less/common.less';
.footer {
  text-align: center;
  .btn {
    margin-right: 30px;
  }
}
/deep/ .ivu-table-wrapper {
  overflow: inherit;
}
.list-page {
  margin-bottom: 0;
  min-height: auto;
  /deep/ .btn-reset {
    display: none;
  }
}
</style>