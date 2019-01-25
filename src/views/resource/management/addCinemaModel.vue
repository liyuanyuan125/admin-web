<template>
  <Modal 
    v-model='showDlg'
    :width='720'
    title="添加关联影院"
    :mask-closable='false'
    @on-cancel="cancel()"
    >

    <Row class="shouDlg-header">
      <Col span="7" style="margin-left: 20px">
        <AreaSelect v-model="area"/>
      </Col>
      <Col span="5" offset="1">
         <Input v-model="value" placeholder="请输入影院名称" />
      </Col>
      <Button style="float:right; margin-right: 6px" type="primary" @click="seach">搜索</Button>
    </Row>

    <Row class="model-check">
      <span>批量选择：</span>
      <CheckboxGroup v-model="modelCheck">
        <Checkbox v-for="(item, index) in inhallTypeList" :key="index" :label="item.code">
          <span>{{item.name}}</span>
        </Checkbox>
      </CheckboxGroup>
    </Row>

    <div class="cinema-box">
      <div>

        <Row v-if="dataLoading">
          <Col class="demo-spin-col" span="22">
            <Spin fix>
              <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
              <div>Loading</div>
            </Spin>
          </Col>
        </Row>

        <Form v-else class="table" ref="radioCinema" :model="form">
          <FormItem>
            <CheckboxGroup v-model="form.check" ref="checks" @on-change="checkAllGroupChange">
              <div v-if="items.length>0">
                <div  @click="hallCountNum(item.id)" v-for="(item, index) in items" :key="index" class="check">
                  <Checkbox :label="item.id">{{item.shortName}}</Checkbox>
                  <span>{{hallCount(item.id)}}</span>
                  <Icon class="cinema-icon-left" @click="addhall(item.id)" v-show="cidCinema(item.id)" type="ios-arrow-forward" />
                </div>
                <div v-if="(items.length%4) == 3" class="check">&nbsp;</div>
              </div>
              <div v-else class="text-center">
                暂无数据
              </div>
            </CheckboxGroup>
          </FormItem>
        </Form>

        <div class="page-wrap" v-if="dataLoading == false && totalPage > 0">
          <div class="check-all" style="padding-left: 40px" v-if="items.length>0">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll">本页全选</Checkbox>
          </div>
          <Page class="page" :total="totalPage" :current="pageIndex" :page-size="pageSize"
            show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
            @on-change="sizeChangeHandle"
            @on-page-size-change="currentChangeHandle"/>
            <span class="checkId">已选: {{cinemaLength}}</span>
        </div>

        <MovieHall ref="moviehall" @done="halldata" />

      </div>
    </div>
    <div  slot="footer" class="dialog-footer" style="margin-right: 6px">
      <Button type="primary" @click="done()">关联</Button>
      <Button @click="cancel()">取消</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import AreaSelect from '@/components/AreaSelect.vue'
import MovieHall from './moviehall.vue'
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import { slice, clean } from '@/fn/object'
import { cinemaList, cinemaCldList } from '@/api/rateCard'
import { info } from '@/ui/modal.ts'
import { isEqual } from 'lodash'

@Component({
  components: {
    AreaSelect,
    CinemaChainSelect,
    MovieHall
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Array, default: () => [] }) addData!: any[]
  @Prop() inhallTypeList: any
  @Prop() companyId: any

  form: any = {
    check: []
  }

  // 影厅格式
  modelCheck: any = ['VIP']
  // 搜索loadding
  dataLoading: boolean = true

  // 是否显示影院遮罩层
  showDlg: any = false
  items: any = []
  value = ''
  options: any = []
  area: number[] = []
  chainId: number = 0
  cinemaList: any = []
  dataForm = {}
  columns: any = [
  ]
  // 选中的影院 id加名字
  checkCinema: any = []
  pageIndex = 1
  pageSize = 10
  totalPage = 0
  query: any = {
    provinceId: 0,
    cityId: 0,
    countyId: 0
  }

  // indeterminate状态
  indeterminate = false

  checkAll = false

  init(val: any) {
    if ( val.length > 0 ) {
      this.form.check = val.map((item: any) => {
        return item.id
      })
    } else {
      this.form.check = []
    }
    this.showDlg = true
    this.seach()
    this.authIdList()
  }

  created() {
    this.seach()
  }

  get pageItem() {
    return this.items.map((it: any) => {
      return it.id
    })
  }
  // 获取影院列表
  async authIdList() {
    try {
      const { data } = await cinemaList({
        companyId: this.companyId,
        pageSize: 888888
      })
      const list: any[] = data.items || []
      this.options = list
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 获取所选长度
  get cinemaLength() {
    const cinema = this.checkCinema.filter((it: any) => {
      return this.form.check.includes(it.id)
    })
    const cinemaArray = cinema.filter((it: any) => {
      return  it.hallList && it.hallList.length > 0
    })
    return cinemaArray.length
  }

  // 搜索
  async seach() {
    this.dataLoading = true
    const query: any = {
      name: this.value,
      ...this.query,
      companyId: this.companyId,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }
    try {
      const res = await cinemaList(clean({...query}))
      this.items = res.data.items || []
      this.totalPage = res.data.totalCount

      setTimeout(() => {
        this.dataLoading = false
      }, 500)

      const sameId = this.items.filter((it: any) => {
        return this.form.check.includes(it.id)
      })

      if (this.items.length === sameId.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (sameId.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }

    } catch (ex) {
      this.dataLoading = false
      this.handleError(ex)
    }
  }

  // ‘>’ 显示隐藏
  cidCinema(id: any) {
    const ids = this.form.check
    if (ids.includes(id)) {
      return true
    }
    return false
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.pageIndex = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.pageSize = val
    this.seach()
  }

  // 全选和反选
  handleCheckAll() {
    if (this.indeterminate) {
      this.checkAll = false
    } else {
      this.checkAll = !this.checkAll
    }
    this.indeterminate = false
    const item = this.items.map((it: any) => {
      return it.id
    })
    if (this.checkAll) {
      const arr = [...this.form.check, ...item]
      arr.forEach((v: any) => {
        if (!this.form.check.includes(v)) {
          this.form.check.push(v)
        }
      })
    } else {
      item.forEach((v: any) => {
        if (this.form.check.includes(v)) {
          const index = this.form.check.findIndex((it: any) => it == v)
          this.form.check.splice(index, 1)
        }
      })
    }
    const checkCinemaId = this.checkCinema.map((its: any) => {
      return its.id
    })
    // 追加关联数据
    this.items.forEach((itemes: any) => {
      if (this.form.check.indexOf(itemes.id) > -1 && !checkCinemaId.includes(itemes.id)) {
        this.checkCinema.push({
          id: itemes.id,
          cinemaName: itemes.shortName
        })
      }
      if (this.form.check.indexOf(itemes.id) == -1 && checkCinemaId.includes(itemes.id)) {
        const index = this.form.check.indexOf(itemes.id)
        this.checkCinema.splice(index, 1)
      }
    })
    this.pageItem.forEach((it: any) => {
      this.hallCountNum(it)
    })
  }

  async hallCountNum(cinemaId: any) {
    if (this.pageItem.includes(cinemaId) && this.modelCheck.length > 0) {
      try {
        const {
          data: {
            item,
            typeList
          }
        } = await cinemaCldList(cinemaId)
        let hallList = item.halls || []
        if (hallList.length > 0) {
          this.modelCheck.length > 0 ? hallList = hallList.filter((it: any) => {
            return this.modelCheck.includes(it.typeCode)
          }).map((it: any) => {
            return {
              id: it.id,
              name: it.name
            }
          }) : ''
          const hallcheck: any = hallList.length > 0 ? hallList.map((it: any) => it.id) : []
          const hallName: any = hallList.length > 0 ? hallList.map((it: any) => it.name) : []
          this.halldata({
            id: cinemaId,
            hallcheck,
            hallName
          })
        } else {
          this.halldata({
            id: cinemaId,
            hallcheck: [],
            hallName: []
          })
          info('该影院下暂无影厅')
        }
      } catch (ex) {
        this.handleError(ex)
        this.halldata({
          id: cinemaId,
          hallcheck: [],
          hallName: []
        })
        // info('该影院下暂无影厅')
      }
    }
  }

  // 判断是否都选中
  checkAllGroupChange(data: any) {
    const itemID = this.items.map((it: any) => {
      return it.id
    })

    const sameId = this.items.filter((it: any) => {
      return this.form.check.includes(it.id)
    })
    // 判断id是否存在
    const select = data.map((it: any) => {
      if (itemID.includes(it)) {
        return it
      }
    })

    // 去除数组的underfind
    const selectArray = select.filter((val: any) => {
      return !(!val || val === '')
    })

    const checkCinemaId = this.checkCinema.map((its: any) => {
      return its.id
    })

    // 追加关联数据
    this.items.forEach((itemes: any) => {
      if (this.form.check.indexOf(itemes.id) > -1 && !checkCinemaId.includes(itemes.id)) {
        this.checkCinema.push({
          id: itemes.id,
          cinemaName: itemes.shortName
        })
      }
      if (this.form.check.indexOf(itemes.id) == -1 && checkCinemaId.includes(itemes.id)) {
        this.checkCinema = this.checkCinema.filter((it: any) => {
          return this.form.check.includes(it.id)
        })
      }
    })

    if (this.items.length === sameId.length) {
      this.indeterminate = false
      this.checkAll = true
    } else if (sameId.length > 0) {
      this.indeterminate = true
      this.checkAll = false
    } else {
      this.indeterminate = false
      this.checkAll = false
    }
  }

  // 影厅显示
  addhall(id: any) {
    const ids = this.form.check
    const index = ids.indexOf(id)
    const hallCheck = this.checkCinema[index].hallList || []
    this.$nextTick(() => {
      (this.$refs.moviehall as any).init(id, hallCheck)
    })
  }

  // 影厅hallList，hallName追加
  halldata(data: any) {
    if (data.hallName.length > 0) {
      this.checkCinema = this.checkCinema.map((it: any) => {
        if (it.id == data.id) {
          return {
            ...it,
            hallList: data.hallcheck,
            hallName: data.hallName
          }
        } else {
          return {
            ...it
          }
        }
      })
    } else {
      this.form.check = this.form.check.filter((it: any) => it != data.id)
      if (this.form.check.length > 0) {
        this.checkAll = false
        this.indeterminate = true
      } else if (this.form.check.length == 0) {
        this.checkAll = false
        this.indeterminate = false
      }
    }
  }

  // 所选影厅的个数
  hallCount(id: any) {
    const ids = this.form.check

    const index = ids.indexOf(id)
    if (index != -1) {
      const hallList = this.checkCinema[index].hallList || []
      return (hallList && hallList.length > 0) ? this.checkCinema[index].hallList.length + '个' : ''
    } else {
      return ''
    }
  }

  @Watch('area')

  // 选择所选城市
  watchArea(val: number[]) {
    this.query.provinceId = val[0]
    this.query.cityId = val[1]
    this.query.countyId = val[2]
  }

  // 取消操作
  cancel(dataForms: string) {
    this.value = ''
    this.area = []
    this.chainId = 0
    this.showDlg = false
    this.pageIndex = 1
    this.seach()
  }

  // 确定操作
  done() {

    const cinema = this.checkCinema.filter((it: any) => {
      return this.form.check.includes(it.id)
    })

    const cinemaHall = cinema.filter((it: any) => {
      return  it.hallList && it.hallList.length > 0
    })
    this.$emit('done', [...cinemaHall])
    this.showDlg = false
  }
}
</script>

<style lang="less" scoped>
.cinema-header {
  position: absolute;
  top: 15px;
  left: 120px;
  font-size: 12px;
  color: red;
  font-weight: 400;
}
/deep/ .ivu-table-wrapper > .ivu-spin-fix {
  border: 0;
}
.model-check {
  display: flex;
  height: 40px;
  line-height: 40px;
  margin-top: 14px;
  margin-left: -16px;
  margin-right: -16px;
  background: #f2f2f2;
  > span {
    margin-left: 40px;
    margin-right: 20px;
  }
}
/deep/ .cinema-box {
  margin-top: 10px;
  height: 260px;
  margin-left: -16px;
  margin-right: -16px;
  max-height: 260px;
  overflow-y: auto;
  .table {
    min-height: 200px;
  }
  /deep/ .check {
    position: relative;
    padding-left: 40px;
    margin-bottom: 8px;
    width: 50%;
    float: left;
    .cinema-icon-left {
      position: absolute;
      top: 5px;
      right: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }
  /deep/ .check:nth-child(4n - 1) {
    background: #f0faff;
  }
  /deep/ .check:nth-child(4n) {
    background: #f0faff;
  }
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
.text-center {
  text-align: center;
  line-height: 200px;
}
.page-wrap {
  display: flex;
  .page {
    position: absolute;
    right: 5%;
  }
}
.check-all {
  padding-top: 6px;
}
.checkId {
  position: absolute;
  bottom: 18px;
  left: 520px;
}
</style>
