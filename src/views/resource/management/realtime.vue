<template>
  <div class="page">
    <section class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <CinemaChainSelect v-model="query.chainId"/>

        <AreaSelect v-model="query.area" noSelf/>

        <Select v-model="query.cinemaId" filterable :loading="cinemaLoading" placeholder="请选择影院">
          <Option v-for="it in cinemaList" :key="it.id" :value="it.id">{{it.shortName}}</Option>
        </Select>

        <Select v-model="query.hallId" filterable :loading="hallLoading"
          placeholder="请选择影厅" class="select-hall" :disabled="!query.cinemaId">
          <Option v-for="it in hallList" :key="it.id" :value="it.id">{{it.name}}</Option>
        </Select>

        <Button type="default" class="btn-reset" @click="reset">清空</Button>
      </form>
      <div class="acts">
        <Button type="success" :to="{ name: 'resource-management-edit' }">新建刊例价</Button>
      </div>
    </section>

    <section class="calendar-wrap" v-if="list.length > 0">
      <div class="calendar-bar flex-box">
        <Cascader v-model="query.date" :data="yearMonthData" size="small"
          :render-format="labels => labels.join('')" :clearable="false"/>
        <div class="flex-1"></div>
        <ButtonGroup size="small">
          <Button icon="ios-arrow-back"></Button>
          <Button>今天</Button>
          <Button icon="ios-arrow-forward"></Button>
        </ButtonGroup>
      </div>
      <table class="calendar-table">
        <thead>
          <th v-for="(it, i) in weekNames" :key="i">{{it}}</th>
        </thead>
        <tbody>
          <tr v-for="(list, i) in calendarData" :key="i">
            <td v-for="it in list" :key="it.key">
              <div class="date-item" :class="{
                'date-item-in-month': it.inMonth,
                'date-item-today': it.isToday }">
                <em class="date-label">{{it.label}}</em>
                <div :class="`date-data date-data-${it.data.rangeType}`" v-if="it.data"
                  @click="showReport(it)">
                  <p class="date-cpm">{{it.data.cpm|centToYuan}}</p>
                  <p class="date-discount">{{it.data.discount}}%</p>
                </div>
                <div v-if="it.data && it.data.calendarId > 0"
                  class="date-dangqi">{{it.data.calendarName}}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <div class="calendar-empty" v-if="query.hallId == 0">请选择影院、影厅</div>

    <DlgReport v-model="dlgReportData" :companyTypes="companyTypes"/>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import AreaSelect from '@/components/AreaSelect.vue'
import { queryList as queryCinemaList } from '@/api/cinema'
import { queryList as queryHallList } from '@/api/cinemaHall'
import { queryLowestList } from '@/api/cpms'
import { range, chunk } from 'lodash'
import moment, { Moment } from 'moment'
import { parse, toMap } from '@/fn/array'
import { centToYuan } from '@/util/filters'
import DlgReport, { CompanyType } from './dlgReport.vue'

@Component({
  components: {
    CinemaChainSelect,
    AreaSelect,
    DlgReport,
  },
  filters: {
    centToYuan
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery: any = {
    chainId: 0,
    area: [ 0, 0, 0 ],
    cinemaId: 0,
    hallId: 0,
    date: [ 0, 0 ],
  }

  query: any = {}

  cinemaLoading = false
  cinemaList: any[] = []

  hallLoading = false
  hallList: any[] = []

  yearList = range(2018, 2029)
  monthLlist = range(1, 13)

  get yearMonthData() {
    const monthData = this.monthLlist.map(month => ({ value: month, label: `${month}月` }))
    const data = this.yearList.map(year => ({
      value: year,
      label: `${year}年`,
      children: monthData
    }))
    return data
  }

  loading = false

  list: any[] = []

  dlgReportData = {
    showDlg: false,
    list: []
  }

  companyTypes: CompanyType[] = []

  get weekNames() {
    const weekNames = moment.localeData().weekdaysShort()
    return weekNames
  }

  // 计算时间列表
  get dateList() {
    const [ year, month ] = this.query.date
    const firstDate = moment([ year, month - 1, 1 ])
    const lastDate = firstDate.clone().endOf('month')
    const startDate = firstDate.clone().startOf('week')
    const endDate = lastDate.clone().endOf('week')

    const today = new Date

    const firstDateBefore = firstDate.clone().subtract(1, 'hour')

    const list = []
    for (const date = startDate.clone(); date.isSameOrBefore(endDate, 'day'); date.add(1, 'day')) {
      const key = date.format('YYYYMMDD')
      const label = date.format(date.get('date') == 1 ? 'M月D日' : 'D日')
      const inMonth = date.isBetween(firstDateBefore, lastDate)
      const isToday = date.isSame(today, 'day')
      list.push({ key, label, inMonth, isToday })
    }

    return list
  }

  get calendarData() {
    const map = toMap(this.list, 'date')
    const list = this.dateList.map(it => {
      const data = map[it.key]
      return {
        ...it,
        data,
        isCompany: data && data.rangeType == 'company',
      }
    })

    return chunk(list, 7)
  }

  showReport(it: any) {
    if (it.isCompany) {
      this.dlgReportData.showDlg = true
      this.dlgReportData.list = it.data.items
    }
  }

  resetToday() {
    const today = new Date
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    this.defQuery.date = this.query.date = [ year, month ]
  }

  mounted() {
    this.updateQueryByParam()
    this.query.area = parse(this.query.area).map(it => +it || 0)
    this.query.date = parse(this.query.date).map(it => +it || 0)
    this.query.date.join('') == '00' && this.resetToday()
  }

  search() {
  }

  reset() {
    this.resetQuery()
  }

  async fetchList() {
    const { cinemaId, hallId } = this.query
    if (!(cinemaId > 0 && hallId > 0)) {
      this.list = []
      return
    }

    const dateList = this.dateList
    const beginDate = dateList[0].key
    const endDate = dateList.slice(-1)[0].key

    this.loading = true
    this.list = []
    try {
      const query = { cinemaId, hallId, beginDate, endDate }
      const { data: { items, companyTypes } } = await queryLowestList(query)
      this.list = items
      this.companyTypes = companyTypes
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  async fetchCinemaList() {
    this.cinemaLoading = true
    this.cinemaList = []
    try {
      const { chainId, area: [ provinceId, cityId, countyId ] } = this.query
      const query = { chainId, provinceId, cityId, countyId, pageSize: 88888888 }
      const { data: { items } } = await queryCinemaList(query)
      this.cinemaList = items

      // 若现有列表中，没有找到已选择的影院，则清空
      const foundItem = items.find((it: any) => it.id == this.query.cinemaId)
      if (foundItem == null) {
        this.query.cinemaId = 0
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.cinemaLoading = false
    }
  }

  async fetchHallList() {
    const cinemaId = this.query.cinemaId
    if (!(cinemaId > 0)) {
      this.query.hallId = 0
      this.hallList = []
      return
    }

    this.hallLoading = true
    this.hallList = []
    try {
      const query = { pageSize: 88888888 }
      const { data: { items } } = await queryHallList(cinemaId, query)
      this.hallList = items

      // 若现有列表中，没有找到已选择的影院，则清空
      const foundItem = items.find((it: any) => it.id == this.query.hallId)
      if (foundItem == null) {
        this.query.hallId = 0
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.hallLoading = false
    }
  }

  @Watch('query.chainId')
  @Watch('query.area', { deep: true })
  watchChainIdAndArea() {
    this.fetchCinemaList()
  }

  @Watch('query.cinemaId')
  watchCinemaId() {
    this.fetchHallList()
  }

  @Watch('query.hallId')
  watchHallId() {
    this.fetchList()
  }

  @Watch('query', { deep: true })
  watchQuery() {
    this.updateUrl()
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.page {
  min-height: 600px;
}
.act-bar {
  max-width: 928px;
}

.form {
  .input,
  /deep/ .ivu-select,
  .area-select {
    width: 188px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
  }
  .area-select {
    width: 218px;
  }
  .select-hall {
    width: 128px;
  }
}

.btn-reset {
  margin-left: 8px;
}

.calendar-wrap {
  margin-top: 10px;
  max-width: 928px;
}
.calendar-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  th, td {
    border: 1px solid #eee;
    padding: 8px;
  }
  td {
    padding: 0;
  }
  .date-item {
    position: relative;
    padding: 16px;
    color: #bbb;
    min-height: 96px;
  }

  .date-item-today {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 13px;
      height: 15px;
      background: url(./assets/today.png) no-repeat;
    }
  }
  .date-label {
    position: absolute;
    top: 10px;
    right: 16px;
    font-style: normal;
  }
  .date-data {
    margin-top: 12px;
    text-align: center;
  }
  .date-dangqi {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 3px 0;
    color: #fff;
    text-align: center;
    background-color: fade(#e20, 50);
  }

  .date-item-in-month {
    color: #333;
    .date-dangqi {
      background-color: fade(#e20, 90);
    }
  }
  .date-data-company {
    color: @c-base;
    text-decoration: underline;
    cursor: pointer;
  }
}
.calendar-empty {
  color: #e20;
  text-align: center;
  margin-top: 80px;
  margin-left: -200px;
}
</style>