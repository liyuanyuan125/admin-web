<template>
  <div class='page'>
    <header>
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <Button v-if='$route.params.status != 4' class="bth" style='float: right' @click="edit($route.params.id)">关闭订单</Button><br>
      <!-- <div class="flex-1" style='margin-left:20px;'>
        <em>基础信息</em>
      </div> -->
    </header>
    <div class='title'>基础信息</div>
    <div class='bos'>
      <Row>
        <Col :span='12'>计划名称&nbsp;：&nbsp;嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻</Col>
        <Col :span='12'>广告片&nbsp;：&nbsp;年轻有WEY.MP4（45s）【WEY汽车】   / --（45s）【--】</Col>
      </Row>
      <Row>
        <Col :span='12'>投放排期&nbsp;：&nbsp;2019/02/02 ~ 2019-05-05</Col>
        <Col :span='12'>推广预算&nbsp;：&nbsp;200元</Col>
      </Row>
      <Row>
        <Col :span='12'>覆盖城市&nbsp;：&nbsp;票仓城市Top20 | 一线城市 / 自定义城市 <span>查看城市列表</span></Col>
        <Col :span='12'>影院星级&nbsp;：&nbsp;5星</Col>
      </Row>
      <Row>
        <Col :span='12'>受众性别&nbsp;：&nbsp;男性为主</Col>
        <Col :span='12'>受众年龄&nbsp;：&nbsp;20岁以下 | 20~24岁</Col>
      </Row>
      <Row>
        <Col :span='12'>影片类型&nbsp;：&nbsp;悬疑 | 爱情 | 科幻</Col>
        <Col :span='12'></Col>
      </Row>
      <Row>
        <Col :span='12'>创建时间&nbsp;：&nbsp;2019-02-05 20:20:50</Col>
        <Col :span='12'>创建人&nbsp;：&nbsp;zhiping.zhao@aiads.com【老麦】</Col>
      </Row>
    </div>
    <div class='title'>投放影片(系统推荐 / 用户自选)</div>
    <div class='bos'>
      <Table :columns="itemcolumns" :data='itemlist' border stripe disabled-hover size="small" class="table">
        <template slot="action" slot-scope="{row}" >
          <a  @click="change(row.id, row)">删除</a>
        </template>
     </Table>
     <div>添加影片</div>
    </div>
    <div class='title'>投放影院(532家)
      <span style='float: right' @click='chgRes'>导出影院列表</span>
    </div>
    <div class='bos'>
      <!-- <Cinema :value="it.cinemaList"/> -->
      <Cinema  />
    </div>
    <div class='title'>备注</div>
    <div class='bos'>
      <Row>2019/02/11 12:21:22  zhiping.zhao@aiads.com【老麦】 已联系资源方，天街物业暂时不接单，需要更换资源方</Row>
      <Row>2019/02/11 12:21:22  zhiping.zhao@aiads.com【老麦】 已联系资源方，天街物业暂时不接单，需要更换资源方</Row>
      <Row>2019/02/11 12:21:22  zhiping.zhao@aiads.com【老麦】 已联系资源方，天街物业暂时不接单，需要更换资源方</Row>
      <Form ref="databeizhu" :model="databeizhu" label-position="left"  :label-width="50">
        <FormItem label="备注" prop="closeReason">
          <Input type='textarea' v-model="databeizhu.closeReason"></Input>
        </FormItem>
        <Button style='margin-left: 49%;' type="primary" @click="dataFormSubmit">提交备注</Button>
    </Form>
    </div>
    <div class='title'>操作记录</div>
    <div class='bos'>
      <Row>2019/02/11 12:21:22  zhiping.zhao@aiads.com【老麦】 已联系资源方，天街物业暂时不接单，需要更换资源方</Row>
      <Row>2019/02/11 12:21:22  zhiping.zhao@aiads.com【老麦】 已联系资源方，天街物业暂时不接单，需要更换资源方</Row>
      <Row>2019/02/11 12:21:22  zhiping.zhao@aiads.com【老麦】 已联系资源方，天街物业暂时不接单，需要更换资源方</Row>
    </div>
    <div style='padding: 20px 0 30px 0'>
        <Form ref="dataplan" :model="dataplan" label-position="left" :label-width="100">
          <Col :span='11'>预估曝光人次【1,982,734】预估曝光场次【2,312】预估花费【32,123,345.00】</Col>
          <Col :span='5'>
            <FormItem label="应收金额" prop="closeReason">
              <Input style="width:100px" v-model="dataplan.money"></Input>
            </FormItem>
          </Col>
          <Col :span='7'>
              <Button type="primary" @click="dataFormSubmit">保存并发送方案至广告主</Button>
            <Button style='margin-left: 30px;' @click="back">取消</Button>
          </Col>
      </Form>
    </div>
    <close  ref="over"   v-if="overVisible" @done="dlgEditDone"/>
    <changeResource  ref="changeres" v-if='changeresVisible' @done="dlgEditDone"/>
    <singDlg ref="addOrUpdate" @done="dlgEditDone" />
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { cinemaCancel , cinemaList } from '@/api/orderSys'
import { toMap } from '@/fn/array'
import moment from 'moment'
import close from './closeorder.vue'
import AreaSelect from '@/components/areaSelect'
import singDlg from './singDlg.vue'
import changeResource from './changeResource.vue'
import { warning , success, toast , info } from '@/ui/modal'
import { slice , clean } from '@/fn/object'
import Cinema from './cinema.vue'


import {
  queryList
} from '@/api/orderkol'
import EditDialog, { Field } from '@/components/editDialog'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'



@Component({
  components: {
    close,
    AreaSelect,
    singDlg,
    changeResource,
    Cinema
  }
})
export default class Main extends ViewBase {
  overVisible = false
  addOrUpdateVisible = false
  changeresVisible = false
  query: any = {
    pageIndex: 1,
    pageSize: 10,
    name: '',
    provinceId: 0,
    cityId: 0,
    countyId: 0,
    resourceCompanyId: 0,
  }
  databeizhu: any = {
    closeReason : ''
  }
  dataplan: any = {
    money : ''
  }
  loading = false
  area: any = []
  list = []
  total = 0
  cinemaArray: any = []
  checkId: any = []


  // 投放影片
  itemlist: any = []
  itemcolumns = [
    { title: '影片名称', key: 'email', align: 'center' },
    {
      title: '上映日期',
      width: 120,
      key: 'createTime',
      align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(createTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '投放排期',
      width: 120,
      key: 'createTime',
      align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(createTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      slot: 'action',
      align: 'center',
    }
  ]
  mounted() {
  }

  dlgEditDone() {
    // this.doSearch()
  }

  // get columns() {
    // const data: any = [
    //   { title: '影院名称', key: 'shortName',  align: 'center' },
    //   { title: '影厅数量', key: 'hallCount', align: 'center' },
    //   { title: '场次数量', key: 'seatCount', align: 'center' },
    //   { title: '专资编码',  key: 'code', align: 'center' },
    //   {
    //     title: '所在地',
    //     key: 'status',
    //     align: 'center',
    //     render: (hh: any, { row: { areaName, provinceName, cityName } }: any) => {
    //       /* tslint:disable */
    //       const h = jsxReactToVue(hh)
    //       const area = areaName ? areaName + ' , ' : ''
    //       const province = provinceName ? provinceName + ' , ' : ''
    //       const city = cityName ? cityName : ''
    //       return <span>{area}{province}{city}</span>
    //       /* tslint:enable */
    //     }
    //   }
    // ]
  //   const check = [
  //      {
  //       type: 'selection',
  //       title: '全选',
  //       width: 60,
  //       align: 'center'
  //     }
  //   ]
  //   const opernation = [
  //      {
  //       title: '操作',
  //       key: 'status',
  //       align: 'center',
  //       width: 80,
  //       slot: 'action'
  //     }
  //   ]
  //   return this.$route.params.status == '2' ? [...check, ...data, ...opernation] : data
  // }

  // check(data: any) {
  //   const ids = this.tableData.map((it: any) => it.id)
  //   const dataId = data.map((it: any) => it.id)
  //   data.forEach((item: any) => {
  //     if (!this.checkId.includes(item.id)) {
  //       this.checkId.push(item.id)
  //     }
  //   })
  //   const filterId = ids.filter((it: any) => !dataId.includes(it))
  //   this.checkId = this.checkId.filter((it: any) => !filterId.includes(it))
  // }

  // get cachedMap() {
  //   return {
  //   }
  // }

  // get tableData() {
  //   if (this.cinemaArray.length == 0) {
  //     return []
  //   }
  //   const cachedMap = this.cachedMap
  //   const list = (this.list || []).map((it: any) => {
  //     return {
  //       ...it
  //     }
  //   })
  //   const list1 = (this.list || []).map((it: any) => {
  //     if (this.checkId.includes(it.id)) {
  //       return {
  //         ...it,
  //         _checked: true
  //       }
  //     } else {
  //       return {
  //         ...it,
  //       }
  //     }
  //   })
  //   return this.$route.params.status == '2' ? list1 : list
  // }

  // 返回上一页 && 接单取消按钮
  back() {
    this.$router.go(-1)
  }
  // 关闭订单
  edit(id: any) {
    this.overVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.over.init(id)
    })
  }

  // 修改资源方
  chgRes(id: any) {
    this.changeresVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.changeres.init(id)
    })
  }


  async search() {
    if (this.loading) {
      return
    }
    if (this.cinemaArray.length == 0) {
      return
    }
    this.loading = true
    const query = clean({ ...this.query, ids: this.cinemaArray.join(',') })
    try {
        // 订单列表
      const { data: {
        items: list,
        totalCount: total,
        statusList: statusList,
        planTypeList: planTypeList
      } } = await cinemaList(this.$route.params.id, query)
      this.list = list
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  // 备注提交
  async dataFormSubmit(dataForms: any) {
    const valid = await (this.$refs.databeizhu as any).validate()
    if (!valid) {
      return
    }
    // try {
    //   const res = await set (this.$route.params.id, this.databeizhu)
    //   toast('成功')
    //   this.$emit('done')
    //   this.$router.push({ name: 'order-list'})
    // } catch (ex) {
    //   this.handleError(ex)
    // }
  }

  @Watch('area', {immediate : true})

  watchArea(val: number[]) {
    this.query.provinceId = !!val[0] ? val[0] : ''
    this.query.cityId = !!val[1] ? val[1] : ''
    this.query.countyId = !!val[2] ? val[2] : ''
  }

  change(id: number, shortName: any) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      (this.$refs.addOrUpdate as any).init(id, shortName)
    })
  }

  changeAll() {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      (this.$refs.addOrUpdate as any).inits(this.checkId)
    })
  }

  @Watch('cinemaArray', {deep: true})

  watchcinemaArray(val: number[]) {
    if (val.length > 0) {
      this.search()
    }
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.query.pageIndex = val
    this.search()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.query.pageSize = val
    this.search()
  }


}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';
.page {
  line-height: 40px;
  font-size: 14px;
}
.header {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;
  em, i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}
.title {
  font-size: 16px;
  color: @c-base;
  line-height: 50px;
}
.bos {
  border: 1px solid #ccc;
  padding: 15px;
}
.row-li {
  line-height: 40px;
  font-size: 14px;
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
}
</style>
