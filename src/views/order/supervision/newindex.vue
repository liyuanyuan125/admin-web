<template>
    <div class="index-page" >
        <Tabs v-model="status" type="card" class="tabs">
            <TabPane v-for="it in statusList" :key="it.value" :name="it.value" :label="it.name" />
        </Tabs>
        <ListPage 
          :fetch="fetch" 
          :filters="filters" 
          :enums="enums" 
          :columns="columns" 
          ref="listPage" 
          @inspect='onInspect'>
            <template slot="acts">
                <Button type="default" class="button-audit" @click="exportData">导出</Button>
            </template>
            <!-- <template slot="acts-2">
        <Button
          v-if=' astatus == 2'
          type="primary"
          class="button-audit"
          :disabled="!(selectedIds.length > 0)"
          @click="changeAll"
          
        >批量审核</Button>
        <Button
          v-else-if=' astatus == 4'
          type="primary"
          :disabled="!(selectedIds.length > 0)"
          @click="changeAll"
        >批量恢复</Button>
        <span v-else  ></span>
      </template> -->
            <template slot="video" slot-scope="{row}">
                <a style='margin-left: 5px;' v-for='(item,index) in row.videoDetails' :key='index'>
                    <em style='font-style: normal;'  v-for='(its,index) in deliveryPositionList' :key='index' v-if='item.deliveryPosition != null && item.deliveryPosition == its.key'>【{{its.text}}】</em>
                {{item.videoName}} ({{item.videoLength}})s</a>
            </template>
            <template slot="movieName" slot-scope="{row}">
                <span v-if='row.movieId == -1'>所有影片</span>
                <span v-else >{{row.movieName}}</span>
            </template>
            <template slot="approvalStatus" slot-scope="{row}">
                <span v-for='(it,index) in statusList ' :key='index' v-if='row.approvalStatus == it.value'>{{it.name}}</span>
            </template>
            <template slot="action" slot-scope="{row , index}">
                <a v-if='row.approvalStatus == 1' @click='okups(row.id)'>允许上传图片&nbsp;&nbsp;</a>
                <router-link v-if='row.approvalStatus == 2' @click.native="localitem( row.id , row , index )" :to="{ name: 'order-supervision-detail', params: { id: row.id} }">审核</router-link>
                <!-- <a style='margin-right: 6px;' v-show='row.approvalStatus == 2' @click="change( row.id , row )">审核</a> -->
                <a style='margin-right: 6px;' v-show='row.approvalStatus == 3 || row.approvalStatus == 4' @click="resetChange( row.id )">恢复</a>
                <router-link v-if='row.approvalStatus != 2' :to="{ name: 'order-supervision-detail', params: { id: row.id} }">详情</router-link>
            </template>
        </ListPage>
        <singvideoDlg ref="addOrUpdatevideo" v-if='videoVisible' @done="dlgEditDone" />
    </div>
</template>
<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
// import { queryList, auditItem, newItem } from './data'
import moment from 'moment'
import { queryList, okpass, refuse , reset , addimg } from '@/api/supervision'
import { EditDialog, Field } from '@/components/editForm'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { warning, success, info , confirm , alert} from '@/ui/modal'
// 公司名称
import compangList from './companyList.vue'
// 广告片
import videoList from './videoList.vue'
// 影院名称
import cinemaList from './cinemaList.vue'
// 商务负责人
import People from './peopleList.vue'

import singvideoDlg from './singvideoDlg.vue'

import { getChannelList } from '@/util/types'

import { findIndex } from 'lodash'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'
const defaulttimeFormat = 'YYYYMMDD'

// 广告片位置
const deliveryPositionList: any = [
    {controlStatus: 1, text: '倒一', key: '1'},
    {controlStatus: 1, text: '倒二', key: '2'},
    {controlStatus: 1, text: '倒三', key: '3'},
    {controlStatus: 1, text: '倒四', key: '4'},
    {controlStatus: 1, text: '倒五', key: '5'}
]

const statusList: any = [
    { name: '待审核', value: '2' },
    { name: '已通过', value: '3' },
    { name: '已拒绝', value: '4' },
    { name: '未上传', value: '1' },
]
const defaultPay = statusList[0].value

@Component({
    components: {
        ListPage,
        EditDialog,
        singvideoDlg
    }
})
export default class IndexPage extends ViewBase {
    @Prop({ type: String, default: defaultPay }) pay!: string

    get listPage() {
        return this.$refs.listPage as ListPage
    }

    startTime: any = Number(new Date(this.getTime(0))) + (24 * 60 * 60 * 1000 * 3) - 8 * 60 * 60 * 1000
    endTime: any = Number(new Date(this.getTime(-6))) + (24 * 60 * 60 * 1000 * 3) + 16 * 60 * 60 * 1000 - 1
    weekDate = [new Date(this.startTime), new Date(this.endTime)]

    sd = moment(this.weekDate[0].getTime()).format(defaulttimeFormat)
    ed = moment(this.weekDate[1].getTime()).format(defaulttimeFormat)

    ad = moment(this.weekDate[0].getTime() - (24 * 60 * 60 * 1000 * 7)).format(defaulttimeFormat)
    bd = moment(this.weekDate[1].getTime() - (24 * 60 * 60 * 1000 * 7)).format(defaulttimeFormat)

    videoVisible = false

    status = this.pay

    statusList = statusList
    deliveryPositionList = deliveryPositionList

    fetch = queryList

    query: any = null
    list: any = []

    selectedIds = [] as number[]

    auditVisible = false

    defaultDate = '20190808-20190814'
    num = 6


    // 跳转数量
    jumpNum: any = 0

    get astatus() {
        return this.query && this.query.status
    }

    enums = [
        'approvalStatusList',
    ]

    getTime(n: any) {
        const now = new Date()
        let year = now.getFullYear()
        // 因为月份是从0开始的,所以获取这个月的月份数要加1才行
        let month = now.getMonth() + 1
        let date = now.getDate()
        const day = now.getDay()

        if (day !== 0 ) {
            n = n + ( day - 1 )
        } else {
            n = n + day
        }
        if ( day ) {
            // 这个判断是为了解决跨年的问题
            if (month > 1) {
                month = month
            } else {  // 这个判断是为了解决跨年的问题,月份是从0开始的
                year = year - 1
                month = 12
            }
        }

        now.setDate( now.getDate() - n )
        year = now.getFullYear()
        month = now.getMonth() + 1
        date = now.getDate()
        const s = year + '-' + ( month < 10 ? ('0' + month ) : month ) + '-' + (date < 10 ? ('0' + date ) : date )
        return s
    }

    get deDate() {
        // if (new Date().getDay() == 5 || new Date().getDay() == 6) {
        //   this.weekDate = [
        //   new Date(this.startTime + (24 * 60 * 60 * 1000 * 7)) ,
        //   new Date(this.endTime + (24 * 60 * 60 * 1000 * 7))]
        //   const a = moment(this.weekDate[0].getTime()).format(defaulttimeFormat)
        //   const b  = moment(this.weekDate[1].getTime()).format(defaulttimeFormat)
        //   return a + '-' + b
        // } else if (new Date().getDay() == 1 || new Date().getDay() == 2 || new Date().getDay() == 3 ) {
        //     return this.ad + '-' + this.bd
        // }
        // if (new Date().getDay() == 4) {
        //     return this.sd + '-' + this.ed
        // }
        // if (new Date().getDay() == 0) {
        //   this.weekDate = [
             //   new Date(this.startTime + (24 * 60 * 60 * 1000 * 1)) ,
        //   new Date(this.endTime + (24 * 60 * 60 * 1000 * 1))]
        //   const a = moment(this.weekDate[0].getTime()).format(defaulttimeFormat)
        //   const b  = moment(this.weekDate[1].getTime()).format(defaulttimeFormat)
        //   return a + '-' + b
        // }
        if (new Date().getDay() == 4 || new Date().getDay() == 5 || new Date().getDay() == 6) {
            return this.sd + '-' + this.ed
        }
        if (new Date().getDay() == 1 || new Date().getDay() == 2 ||
            new Date().getDay() == 3 || new Date().getDay() == 0 ) {
            if (new Date().getDay() == 1) {
                this.num = 7
            } else if (new Date().getDay() == 2) {
                this.num = 7
            } else if (new Date().getDay() == 3) {
                this.num = 7
            } else if (new Date().getDay() == 4) {
                this.num = 6
            }
            this.weekDate = [
            new Date(this.startTime - (24 * 60 * 60 * 1000 * this.num)) ,
            new Date(this.endTime - (24 * 60 * 60 * 1000 * this.num))]
            const a = moment(this.weekDate[0].getTime()).format(defaulttimeFormat)
            const b  = moment(this.weekDate[1].getTime()).format(defaulttimeFormat)
            // this.query.beginDate = this.ad[0] + this.ad[1] + this.ad[2]
            // this.query.endDate = this.bd[0] + this.bd[1] + this.bd[2]
            return a + '-' + b

        }
    }

    get filters(): Filter[] {
        const aaa: any = [{
                name: 'status',
                defaultValue: this.pay,
            },

            {
                name: 'companyId',
                defaultValue: 0,
                type: compangList,
                width: 140,
                placeholder: '资源方公司'
            },

            {
                name: 'videoId',
                defaultValue: 0,
                type: videoList,
                width: 140,
                placeholder: '广告片'
            },
            {
                name: 'cinemaId',
                defaultValue: 0,
                type: cinemaList,
                width: 140,
                placeholder: '资源方影院'
            },

            {
                name: 'code',
                defaultValue: '',
                type: 'input',
                width: 140,
                placeholder: '专资编码'
            },

            {
                name: 'movieName',
                defaultValue: '',
                type: 'input',
                width: 140,
                placeholder: '影片名称'
            },

            {
                name: 'dateRange',
                defaultValue: location.search == '' ? this.deDate : '',
                week: true,
                // type: 'dateRange',
                width: 200,
                placeholder: '投放周期',
                dealParam(value: string) {
                    const [beginDate, endDate] = value ? value.split('-') : [null, null]
                    return {
                        beginDate,
                        endDate
                    }
                }
            },

            {
                name: 'businessDirector',
                defaultValue: 0,
                type: People,
                width: 140,
                placeholder: '商务负责人'
            },
        ]
        const up: any = [
            {
                name: 'dateRange2',
                defaultValue: '',
                type: 'dateRange',
                width: 200,
                placeholder: '上传时间',
                dealParam(value: string) {
                    const [uploadBeginTime, uploadEndTime] = value ? value.split('-') : [null, null]
                    return {
                        uploadBeginTime : uploadBeginTime ? Number(new Date(String(uploadBeginTime).slice(0, 4)
                        + '-' + String(uploadBeginTime).slice(4, 6) + '-' +
                        String(uploadBeginTime).slice(6, 8)).getTime() - (8 * 60 * 60 * 1000)) : null,
                        uploadEndTime : uploadEndTime ? Number(new Date(String(uploadEndTime).slice(0, 4) + '-'
                        + String(uploadEndTime).slice(4, 6) + '-' +
                        String(uploadEndTime).slice(6, 8)).getTime() + (16 * 60 * 60 * 1000 - 1)) : null,
                    }
                }
            },
        ]
        const bbb: any = [{
                name: 'approvalUserName',
                defaultValue: '',
                type: 'input',
                width: 140,
                placeholder: '审核人'
            },

            {
                name: 'dateRang3e',
                defaultValue: '',
                type: 'dateRange',
                width: 200,
                placeholder: '审核时间',
                dealParam(value: string) {
                    const [approvalBeginTime, approvalEndTime] = value ? value.split('-') : [null, null]
                    // return {
                    //     approvalBeginTime,
                    //     approvalEndTime
                    // }
                    return {
                        approvalBeginTime : approvalBeginTime ? Number(new Date(String(approvalBeginTime).slice(0, 4)
                        + '-' + String(approvalBeginTime).slice(4, 6) + '-' +
                        String(approvalBeginTime).slice(6, 8)).getTime() - (8 * 60 * 60 * 1000)) : null,
                        approvalEndTime : approvalEndTime ? Number(new Date(String(approvalEndTime).slice(0, 4) + '-'
                        + String(approvalEndTime).slice(4, 6) + '-' +
                        String(approvalEndTime).slice(6, 8)).getTime() + (16 * 60 * 60 * 1000 - 1)) : null,
                    }
                }
            },
        ]
        const ccc: any = [{
                name: 'pageIndex',
                defaultValue: 1
            },

            {
                name: 'pageSize',
                defaultValue: 20
            }
        ]

        if (this.status == '1') {
          return [...aaa, ...ccc]
        } else if (this.status == '3' || this.status == '4') {
          return [...aaa, ...up, ...bbb, ...ccc]
        } else {
          return [...aaa, ...up, ...ccc]
        }

        // return this.status == '3' || this.status == '4' ? [...aaa, ...bbb, ...ccc] : [...aaa, ...ccc]
    }

    get columns() {
        const aaa: any = [
            { title: '资源方公司名称', key: 'resourceName', align: 'center' },
            { title: '专资编码', key: 'cinemaCode', align: 'center' },
            { title: '影院名称', key: 'cinemaName', align: 'center' },
            { title: '影片名称', slot: 'movieName', align: 'center' },
            { title: '广告片', slot: 'video', align: 'center', width: '220px' },
            {
                title: '投放周期',
                key: 'beginDate',
                width: 150,
                align: 'center',
                render: (hh: any, { row: { beginDate, endDate } }: any) => {
                    /* tslint:disable */
                    const h = jsxReactToVue(hh)
                    const a = String(beginDate)
                    const start = a.slice(0, 4) + '-' + a.slice(4, 6) + '-' + a.slice(6, 8)
                    const b = String(endDate)
                    const end = b.slice(0, 4) + '-' + b.slice(4, 6) + '-' + b.slice(6, 8)
                    return <span> {start} ~ {end}</span>
                    /* tslint:enable */
                }
            },
            { title: '商务负责人', key: 'businessDirectorName', align: 'center' },
            { title: '上传人', key: 'uploadName', align: 'center' },
            // { title: '上传时间', key: 'uploadTime', align: 'center', editor: 'dateTime' },
        ]
        const up: any = [
          { title: '上传时间', key: 'uploadTime', align: 'center', editor: 'dateTime' },
        ]
        const ccc: any = [
            { title: '审核人', key: 'approvalName', align: 'center' },
            { title: '审核时间', key: 'approvalTime', align: 'center', editor: 'dateTime' },
        ]
        const ddd: any = [
            { title: '状态', slot: 'approvalStatus', width: 100 },
            { title: '操作', slot: 'action', maxWidth: 100 }
        ]

        if (this.status == '1') {
          return [...aaa, ...ddd] as ColumnExtra[]
        } else if (this.status == '3' || this.status == '4') {
          return [...aaa, ...up, ...ccc, ...ddd] as ColumnExtra[]
        } else {
          return [...aaa, ...up, ...ddd] as ColumnExtra[]
        }

        // return this.status == '3' || this.status == '4' ? [...aaa, ...ccc, ...ddd]
        // : [...aaa, ...ddd] as ColumnExtra[]
    }

    get columnsData() {
        const aaa: any = [
            { title: '资源方公司名称', key: 'resourceName', align: 'center' },
            { title: '专资编码', key: 'cinemaCode', align: 'center' },
            { title: '影院名称', key: 'cinemaName', align: 'center' },
            { title: '影片名称', key: 'movieName', align: 'center' },
            { title: '投放周期', key: 'scrollDate', align: 'center' },
            { title: '商务负责人', key: 'businessDirectorName', align: 'center' },
            { title: '上传人', key: 'uploadName', align: 'center' },
            // { title: '上传时间', key: 'uploadTime', align: 'center' },
        ]
        const up: any = [
          { title: '上传时间', key: 'uploadTime', align: 'center' },
        ]
        const ccc: any = [
            { title: '审核人', key: 'approvalName', align: 'center' },
            { title: '审核时间', key: 'approvalTime', align: 'center', },
        ]
        const ddd: any = [
            { title: '状态', key: 'status', editor: 'enum' },
            { title: '广告片', key: 'videoDetails', align: 'center' },
        ]
        if (this.status == '1') {
          return [...aaa, ...ddd] as ColumnExtra[]
        } else if (this.status == '3' || this.status == '4') {
          return [...aaa, ...up, ...ccc, ...ddd] as ColumnExtra[]
        } else {
          return [...aaa, ...up, ...ddd] as ColumnExtra[]
        }
        // return this.status == '3' || this.status == '4' ?
        // [...aaa, ...ccc, ...ddd] : [...aaa, ...ddd] as ColumnExtra[]
    }

    changeAll() {
        this.videoVisible = true
        this.$nextTick(() => {
            const myThis: any = this
            myThis.$refs.addOrUpdatevideo.init(this.selectedIds)
        })
    }
    dlgEditDone(id: any) {
        this.selectedIds = []
        this.refresh()
    }

    // 恢复
    async resetChange(id: any) {
      try {
          await confirm('您确定恢复当前数据吗？')
          await reset(id)
          this.$Message.success({
            content: `恢复成功`,
          })
          this.refresh()
        } catch (ex) {
          this.handleError(ex)
        }
    }

    async okups(id: any) {
        try {
        await confirm('您确定允许上传图片吗')
        await addimg(id)
        this.$Message.success({
            content: `操作成功`,
        })
        this.refresh()
        } catch (ex) {
        this.handleError(ex)
        }
    }

    refresh() {
        this.listPage.update()
    }

    onInspect({ query, list }: any) {
        this.query = query
        this.list = list
    }

    async created() {
        if (location.search == '') {
            this.$router.push({
                name: this.$route.name,
                query: {
                    dateRange: this.deDate as string
                }
            })
        }
        // this.$router.push({ name: '', pa })
        // this.listPage.query.status = 2
    }

    // 下载
    exportData() {
        // 导出状态值
        const getName = (value: any, list: any[]) => {
            const i: any = findIndex(list, (it: any) => {
                return value == it.value
            })
            const res: any = (!list[i].name || list[i].name == '') ? '-' : list[i].name
            return res
        }
        this.listPage.exportCsv({
            filename: '映前广告监播列表',
            columns: this.columnsData,
            data: (this.list || []).map((it: any) => {
                return {
                    ...it,
                    scrollDate: it.beginDate + '~' + it.endDate,
                    uploadTime: it.uploadTime == 0 ? '' : moment(it.uploadTime).format(timeFormat),
                    approvalTime: it.approvalTime == 0 ? '' : moment(it.approvalTime).format(timeFormat),
                    status: getName(it.approvalStatus, this.statusList),
                    movieName: it.movieId == -1 ? '所有影片' : it.movieName,
                    // uploadName: " " + String(it.uploadName),
                    videoDetails: (it.videoDetails || []).map((its: any) => {
                        return its.videoName + '(' + its.videoLength + 's)'
                    })
                }
            })
        })
    }

    localitem(id: number, row: any, index: any) {
        // 列表点击清空本地存储值
        sessionStorage.clear()
        if (this.query.pageIndex == 1) {
            this.jumpNum = index
        } else {
            this.jumpNum = ((this.query.pageIndex) * this.query.pageSize) + index
        }
        const infos: any = {
            index,
            pageidx: this.query.pageIndex,
            pagese: this.query.pageSize,
            companyId: (this.query.companyId) == 0 ? null : this.query.companyId,
            movieName: (this.query.movieName),
            businessDirector: (this.query.companyId) == 0 ? null : this.query.companyId,
            approvalUserName: (this.query.approvalUserName),
            cinemaId: (this.query.cinemaId) == 0 ? null : this.query.cinemaId,
            videoId: (this.query.videoId) == 0 ? null : this.query.videoId,
            dateRange: this.query.dateRange,
            beginDate: this.query.beginDate,
            endDate: this.query.endDate,
            dateRang3e: this.query.dateRang3e,
            approvalBeginTime: this.query.approvalBeginTime,
            approvalEndTime: this.query.approvalEndTime,
            status: this.query.status,
            skip: this.jumpNum, // 跳过的记录数
            maxSize: 800, // 最大返回数据量
            code: this.query.code,
            dateRange2: this.query.dateRange2,
            uploadBeginTime: this.query.uploadBeginTime,
            uploadEndTime: this.query.uploadEndTime,
        }
        sessionStorage.setItem('supinfo', JSON.stringify(infos))
    }

    @Watch('status')
    watchstatus(pay: string) {
        this.$router.push({
            name: 'order-supervision',
            params: pay == defaultPay ? {} : { pay }
        })
    }

    @Watch('pay')
    watchPay(pay: string) {
        this.listPage.query.status = pay
    }
}
</script>
<style lang="less" scoped>
.button-crawl {
  margin-left: 12px;
}

.price-table {
  margin: 4px 0;

  /deep/ th,
  /deep/ td {
    height: 24px;
    background-color: #fff !important;
  }
}
/deep/ .ivu-input {
  margin-bottom: 15px;
}
/deep/ .ivu-select {
  margin-bottom: 15px;
}
/deep/ .ivu-btn {
  margin-bottom: 15px;
}
/deep/ .ivu-page .ivu-select {
  margin-bottom: 0;
}
</style>
