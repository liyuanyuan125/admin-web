<template>
    <div class="index-page">
        <Tabs v-model="status" type="card" class="tabs">
            <TabPane v-for="it in statusList" :key="it.value" :name="it.value" :label="it.name" />
        </Tabs>
        <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage">
            <template slot="depositAmount" slot-scope="{ row: { depositAmount   } }">
                <div class="row-acts">
                    {{depositAmount == null ? '-' : formatNumber(depositAmount)}}
                </div>
            </template>
            <template slot="targetCount" slot-scope="{row}">
                <span>{{row.acceptCinemaCount}} / {{row.cinemaCount}}</span>
            </template>
            <template slot="needPayAmount" slot-scope="{ row: { needPayAmount   } }">
                <div class="row-acts">
                    {{needPayAmount == null ? '-' : formatNumber(needPayAmount)}}
                </div>
            </template>
            <template slot="action" slot-scope="{ row: { id , status , discount , depositAmount } }">
                <div class="row-acts">
                    <router-link :to="{ name: 'order-beforeplan-detail', params: { id , status, ifs: '0' } }">详情</router-link>
                    <!-- 核对操作 -->
                    <router-link v-if='status == 9' :to="{ name: 'order-beforeplan-detail', params: { id , status, ifs: '1' } }">核对</router-link>
                    <!-- 补单操作 -->
                    <router-link v-if='status == 6' :to="{ name: 'order-beforeplan-detail', params: { id , status, ifs: '1' } }">补单</router-link>
                    <router-link v-if='status == 7' :to="{ name: 'order-beforeplan-detail', params: { id , status, ifs: '1' } }">补单</router-link>
                    <!-- 待支付操作 -->
                    <router-link v-if='status == 3' :to="{ name: 'order-beforeplan-detail', params: { id , status, ifs: '1' } }">修改</router-link>
                    <a v-if='status == 3' href="javascript:;" @click='view(id , discount , depositAmount)'>设置定金</a>
                </div>
            </template>
        </ListPage>
        <DlgEdit ref="addOrUpdate" v-if="addOrUpdateVisible" @done="done" />
    </div>
</template>
<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import {
    queryList
} from '@/api/beforeplan'
// 广告主公司名称列表
import CompanyList from './files/adscompany.vue'
// 广告片名称列表
import videoList from './files/videoList.vue'

import EditDialog, { Field } from '@/components/editDialog'
import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'
import { formatNumber } from '@/util/validateRules'
// 设置定金
import DlgEdit from './dlgEdit.vue'

// 广告计划状态列表
const statusList: any = [
    { name: '待支付', value: '3' },
    { name: '草稿', value: '1' },
    { name: '核对中', value: '9' },
    { name: '其他', value: '50' },
]
const defaultPay: any = statusList[0].value

@Component({
    components: {
        ListPage,
        EditDialog,
        DlgEdit
    }
})
export default class IndexPage extends ViewBase {
    @Prop({ type: String, default: defaultPay }) pay!: string

    get listPage() {
        return this.$refs.listPage as ListPage
    }

    addOrUpdateVisible = false


    status = this.pay

    statusList = statusList


    fetch = queryList


    get filters(): Filter[] {
        const firstN = [{
                name: 'status',
                defaultValue: this.pay,
            },

            {
                name: 'id',
                defaultValue: '',
                type: 'input',
                width: 140,
                placeholder: '计划ID'
            },

            {
                name: 'companyName',
                defaultValue: 0,
                type: CompanyList,
                width: 140,
                placeholder: '广告主公司名称'
            },

            {
                name: 'name',
                defaultValue: '',
                type: 'input',
                width: 140,
                placeholder: '广告计划名称'
            },

            {
                name: 'videoName',
                defaultValue: '',
                type: videoList,
                width: 140,
                placeholder: '广告片名称'
            },

            {
                name: 'dateRange',
                defaultValue: '',
                type: 'dateRange',
                width: 200,
                placeholder: '选择时间',
                dealParam(value: string) {
                    const [beginDate, endDate] = value ? value.split('-') : [null, null]
                    return {
                        beginDate,
                        endDate
                    }
                }
            },

            {
                name: 'advertTypeCode',
                defaultValue: null,
                type: 'select',
                width: 100,
                placeholder: '广告类型',
                enumKey: 'advertTypeList'
            },

            {
                name: 'channelCode',
                defaultValue: null,
                type: 'select',
                width: 100,
                placeholder: '渠道',
                enumKey: 'channelList'
            },

            {
                name: 'applyDate',
                defaultValue: '',
                type: 'date',
                width: 140,
                placeholder: '提交时间'
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

        const two: any = [{
            name: 'status',
            defaultValue: null,
            type: 'select',
            width: 100,
            placeholder: '订单状态',
            enumKey: 'statusList'
        }]


        return this.status != '50' ? [...firstN] : [...firstN, ...two]
    }

    enums = [
        'statusList',
        'advertTypeList',
        'channelList',
        'payTypeList',
        'deliveryPositionList',
        'auditStatusList',
    ]

    get formatNumber() {
        return formatNumber
    }

    get columns() {
        const firstN: any = [
            { title: '计划id', key: 'id', width: 60 },
            { title: '计划名称', key: 'name' },
            { title: '广告主公司名称', key: 'companyName' },
            { title: '广告片', key: 'videoName' },
            { title: '广告类型', key: 'advertTypeCode', editor: 'enum', width: 60 },
            { title: '渠道', key: 'channelCode', editor: 'enum', width: 60 },
            {
                title: '投放周期',
                key: 'beginDate',
                align: 'center',
                render: (hh: any, { row: { beginDate, endDate } }: any) => {
                    /* tslint:disable */
                    const h = jsxReactToVue(hh)
                    const start = String(beginDate).slice(0, 4) + '-' + String(beginDate).slice(4, 6) + '-' + String(beginDate).slice(6, 8)
                    const end = String(endDate).slice(0, 4) + '-' + String(endDate).slice(4, 6) + '-' + String(endDate).slice(6, 8)
                    return <span> {start} ~ {end}</span>
                    /* tslint:enable */
                }
            },
            { title: '接单影院/派单影院', slot: 'targetCount' },
            { title: '折扣', key: 'discount', width: 60 },
            { title: '定金', slot: 'depositAmount', width: 60 },
            { title: '应结金额', slot: 'needPayAmount' },
            { title: '提交时间', key: 'applyTime', editor: 'dateTime' },
            { title: '订单状态', key: 'status', editor: 'enum', width: 60 },
        ]
        const aaa = [
            { title: '审批状态', key: 'auditStatus', editor: 'enum', width: 60 },
        ]

        const bbb = [
            { title: '操作', slot: 'action' },
        ]

        return this.status == '4' ? [...firstN, ...aaa, ...bbb] : [...firstN, ...bbb] as ColumnExtra[]
    }

    done() {
        this.refresh()
    }

    refresh() {
        this.listPage.update()
    }

    // 设置定金
    view(id: any, discount: any , depositAmount: any) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
            const myThis: any = this
            myThis.$refs.addOrUpdate.init(id, discount , depositAmount)
        })
    }

    @Watch('status')
    watchstatus(pay: any) {
        this.$router.push({
            name: 'order-beforeplan',
            params: pay == defaultPay ? {} : { pay }
        })
    }

    @Watch('pay')
    watchPay(pay: any) {
        if (pay == '50') {
            this.listPage.query.status = ''
        } else {
            this.listPage.query.status = pay
        }
    }
}
</script>
<style lang="less" scoped>
.settlement-price-list {
  text-align: left;
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