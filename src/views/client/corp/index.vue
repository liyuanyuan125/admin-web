<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.companyId" placeholder="公司ID" class="input input-id"/>
        <LazyInput v-model="query.shortName" placeholder="公司名称" class="input"/>
        <Select v-model="query.typeCode" placeholder="客户类型" clearable>
          <Option v-for="it in customerTypeList" :key="it.typeCode" :value="it.typeCode"
            :label="it.typeName">{{it.typeName}}</Option>
        </Select>
        <!-- <Cascader style="width:150px" class="type-select" :data="customerTypeList" v-model="query.type" placeholder="客户类型"></Cascader> -->
        <Select v-model="query.status" placeholder="状态" clearable>
          <Option v-for="it in statusList" :key="it.key" :value="it.key"
            :label="it.text">{{it.text}}</Option>
        </Select>
        <Select v-model="query.businessDirector" placeholder="关联商务" style="width:200px" filterable clearable>
          <Option v-if="it.status!=2" v-for="it in businessDirector" :key="it.id" :value="it.id"
            :label="it.email+'  ['+it.userName+']'">{{ it.email}}<b style="margin-left:5px">[{{it.userName}}]</b></Option>
        </Select>
        <Select v-model="query.approveStatus" placeholder="审核状态" clearable>
          <Option v-for="it in aptitudeStatusList"  :key="it.key" :value="it.key"
            :label="it.text">{{it.text}}</Option>
        </Select>
        <!-- <Button type="primary" @click="search" icon="md-search" class="btn-search">查询</Button> -->
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </form>
      <div class="acts">
        <Button type="success" @click="edit(0)">创建</Button>
      </div>
    </div>

    <Table :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table"></Table>

    <div class="page-wrap" v-if="total > 0">
      <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { queryList, statusId, directorList } from '@/api/corpReal'
import { confirm } from '@/ui/modal'
import { numberify, numberKeys } from '@/fn/typeCast'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const conMap = (list: any[]) => toMap(list, 'key', 'controlStatus')
const timeFormat = 'YYYY/MM/DD HH:mm:ss'
const typeMap = (list: any[]) => toMap(list, 'typeCode', 'controlStatus')

@Component
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    companyId: '',
    shortName: '',
    typeCode: '',
    status: 0,
    businessDirector: null,
    approveStatus: 0,
    pageIndex: 1,
    pageSize: 20,
  }
  query: any = {}

  oldQuery: any = {}
  defaulitState: any = null
  loading = false
  list = []
  total = 0
  // 业务类型列表
  customerTypeList = []
  // 启用状态列表
  resTypeList = []
  // 资质审核状态列表
  statusList = []
  levelList = []
  aptitudeStatusList = []
  // 关联商务
  businessDirector = []
  columns = [
    { title: '公司ID', key: 'id', width: 80, align: 'center' },
    { title: '公司名称', key: 'name', align: 'center' },
    { title: '客户类型',
      key: 'customerTypeList',
      width: 140,
      align: 'center',
      render: (hh: any, { row: { types, userType } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const customerString: any = this.typeListFormt(types)
        return !!customerString ? (customerString.map((val: any) => {
          if (!!val.twoText) {
            const red = (userType as any)[val.two] == 1 ? 1 : 2
            return red == 1
            ? <div>{val.oneText}<span class={`status-${red}`}>({val.twoText})</span></div>
            : <tooltip content="已下架" placement="top">
              <div>{val.oneText}<span class={`status-${red}`}>({val.twoText})</span></div>
            </tooltip>
          } else {
            return <div v-html={val.oneText}></div>
          }
        })) : ''
        /* tslint:enable */
      }
    },
    { title: '客户等级',
      key: 'levelCode',
      width: 70,
      align: 'center',
      render: (hh: any, { row: { levelStaus, status, statusText, levelCode, levelText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return levelStaus == 1
            ? <span class={`status-${levelStaus}`}>{levelText}</span>
            : <tooltip content="已下架" placement="top">
              <span class={`status-${levelStaus}`}>{levelText}</span>
            </tooltip>
        /* tslint:enable */
      }
    },
    { title: '关联商务', key: 'businessDirectorName', align: 'center',
      render: (hh: any, { row: { businessDirectorEmail, businessDirectorName } }: any) => {
        /* tslint:disable */
        const name = businessDirectorName ? `[${businessDirectorName}]`: ''
        const h = jsxReactToVue(hh)
        return <span class='datetime'>{businessDirectorEmail}<p style="font-weight:bold">{name}</p></span>
        /* tslint:enable */
      }
    },
    {
      title: '创建时间',
      key: 'createTimeTemp',
      align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = createTime ? moment(createTime).format(timeFormat) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '更新时间',
      key: 'modifyTimeTemp',
      align: 'center',
      render: (hh: any, { row: { modifyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = modifyTime ? moment(modifyTime).format(timeFormat) : ''
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '状态',
      key: 'statusString',
      width: 80,
      align: 'center',
      render: (hh: any, { row: { status, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`status-${status}`}>{statusText}</span>
        /* tslint:enable */
      }
    },
    {
      title: '审核状态',
      key: 'approveStatusString',
      width: 80,
      align: 'center',
      render: (hh: any, { row: { approveStatus, aptitudeStatusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`aptitude-status-${approveStatus}`}>{aptitudeStatusText}</span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (hh: any, { row: { id, status, approveStatus } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const edit = approveStatus == 1 ? '审核' : '编辑'
        const statusText = status == 1 ? '停用' : '启用'
        return <div class='row-acts'>
          <a class="operation" on-click={this.editStatus.bind(this, id, status)} to={{ name: 'client-corp-detail', params: { id } }}>{statusText}</a>
          <router-link class="operation" to={{ name: 'client-corp-edit', params: { id } }}>{edit}</router-link>
          <router-link class="operation" to={{ name: 'client-corp-detail', params: { id } }}>详情</router-link>
        </div>
        /* tslint:enable */
      }
    }
  ]

  mounted() {
    this.updateQueryByParam()
  }

  reset() {
    this.resetQuery()
  }

  created() {
    this.business()
  }

  async business() {
    try {
      const res = await directorList()
      this.businessDirector = res.data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  formatCinema(data: any) {
    const cinemChildren = data && data.map((item: any) => {
      return item.typeCategoryList
    })
    return typeMap(this.flatten(cinemChildren))
  }

  flatten(arr: any) {
    return  arr.reduce((pre: any, cur: any) => {
          if ( !Array.isArray(cur) ) {
              return [...pre, cur]
          } else {
              return [...pre, ...this.flatten(cur)]
          }
      }, [])
  }
  typeListFormt(value: any) {
    const typeArray: any = []
    if ( !!value ) {
      value.forEach((i: any) => {
        const typeObject: any = {}
        this.customerTypeList.forEach((val: any) => {
          if (i.typeCode == val.typeCode) {
            typeObject.oneText = val.typeName
          }
          if ( !!i.typeCategoryCode ) {
            val.typeCategoryList.forEach((chlVal: any) => {
              if ( i.typeCategoryCode == chlVal.typeCode ) {
                typeObject.twoText = chlVal.typeName
                typeObject.two = chlVal.typeCode
              }
            })
          }
        })
        typeArray.push(typeObject)
      })
    }
    return typeArray
    // let brr: any= []
    // let typeArray: any = null
    // value.forEach( (val: any, i: any) => {
    //   if (val.typeCategoryList) {
    //     typeArray = {
    //       label: val.typeName,
    //       value: val.typeCode,
    //       children: this.typeListFormt(val.typeCategoryList)
    //     }
    //   } else {
    //     typeArray = {
    //       label: val.typeName,
    //       value: val.typeCode
    //     }
    //   }
    //   brr.push(typeArray)
    // })
    // return brr
  }
  get cachedMap() {
    return {
      resType: makeMap(this.resTypeList),
      status: makeMap(this.statusList),
      levelList: makeMap(this.levelList),
      aptitudeStatus: makeMap(this.aptitudeStatusList),
      levelStaus: conMap(this.levelList),
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        resTypeName: cachedMap.resType[it.typeString],
        statusText: cachedMap.status[it.status],
        levelText: cachedMap.levelList[it.levelCode],
        aptitudeStatusText: cachedMap.aptitudeStatus[it.approveStatus],
        levelStaus: cachedMap.levelStaus[it.levelCode],
        userType: this.formatCinema(this.customerTypeList)
      }
    })
    return list
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }
    this.updateUrl()
    this.loading = true
    const query = clean({ ...this.query })
    try {
      const { data: {
        items: list,
        totalCount: total,
        customerTypeList,
        resTypeList,
        statusList,
        levelList,
        approveStatusList,
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.levelList = levelList
      this.customerTypeList = customerTypeList
      this.resTypeList = resTypeList
      this.statusList = statusList.slice(1)
      this.aptitudeStatusList = approveStatusList.slice(1)
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  edit(id: number) {
    const params: any = id > 0 ? { id } : {}
    this.$router.push({ name: 'client-corp-edit', params })
  }

  async editStatus(id: number, status: number) {
    const statu = status == 1 ? '停用' : '启用'
    const statusType = status == 1 ? 2 : 1
    await confirm(`确定要${statu}该项吗？`)
    try {
      await statusId(id, { status: statusType})
      this.doSearch()
    } catch (ex) {
      setTimeout(() => {
        this.handleError(ex)
      }, 1000)
    }

  }

  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.doSearch()
  }
}
</script>

<style lang="less" scoped>
.form {
  .input,
  /deep/ .ivu-select {
    width: 100px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
  }

  .input-id {
    width: 80px;
  }
  .type-select {
    display: inline-block;
    width: 100%;
    margin-left: 8px;
  }
}

.btn-search,
.btn-reset {
  margin-left: 8px;
}

.table {
  margin-top: 16px;
  /deep/ .status-2,
  /deep/ .aptitude-status-3 {
    color: #ed4014;
  }
  /deep/ .aptitude-status-2 {
    color: #19be6b;
  }
  /deep/ .row-acts {
    .operation {
      margin-right: 6px;
    }
  }
  /deep/ span:only-child:empty {
    &::before {
      content: '-';
    }
  }
  /deep/ span p:only-child:empty {
    &::before {
      content: '-';
    }
  }
}

.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
</style>
