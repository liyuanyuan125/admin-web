<template>
  <Modal 
    v-model='showDlg'
    :width='720'
    title="添加关联影院"
    :mask-closable='false'
    @on-cancel="cancel()"
    >

    <Row class="shouDlg-header">
      <Col span="7">
        <AreaSelect v-model="area"/>
      </Col>
      <Col span="5" offset="1">
         <Input v-model="value" placeholder="请输入影院名称" />
      </Col>
      <Button style="float:right" type="primary" @click="seach">搜索</Button>
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
            <div style="margin-left:34px" v-if="items.length>0">
              <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="handleCheckAll">全选</Checkbox>
            </div>

            <CheckboxGroup v-model="form.check" ref="checks" @on-change="checkAllGroupChange">
              <div v-if="items.length>0">
                <div v-for="(item, index) in items" :key="index" class="check">
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
          <Page :total="totalPage" :current="pageIndex" :page-size="pageSize"
            show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
            @on-change="sizeChangeHandle"
            @on-page-size-change="currentChangeHandle"/>
            <span class="checkId">已选: {{form.check.length}}</span>
        </div>

        <MovieHall ref="moviehall" @done="halldata" />

      </div>
    </div>
    <div  slot="footer" class="dialog-footer">
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
  modelCheck: any = []
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
      this.checkCinema = val
    } else {
      this.form.check = []
      this.checkCinema = []
    }
    this.showDlg = true
    this.seach()
    this.authIdList()
  }

  created() {
    this.seach()
  }

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
  }

  // 判断是否都选中
  checkAllGroupChange(data: any) {
    const item = this.items.map((it: any) => {
      return it.id
    })

    const sameId = this.items.filter((it: any) => {
      return this.form.check.includes(it.id)
    })
    // 判断id是否存在
    const select = data.map((it: any) => {
      if (item.includes(it)) {
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
        const index = this.form.check.indexOf(itemes.id)
        this.checkCinema.splice(index, 1)
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

  addhall(id: any) {
    const ids = this.form.check
    const index = ids.indexOf(id)
    const hallCheck = this.checkCinema[index].hallList || []
    this.$nextTick(() => {
      (this.$refs.moviehall as any).init(id, this.modelCheck, hallCheck)
    })
  }

  halldata(data: any) {
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
  }

  hallCount(id: any) {
    const ids = this.form.check

    const index = ids.indexOf(id)
    if (index != -1) {
      return this.checkCinema[index].hallList ? this.checkCinema[index].hallList.length + '个' : ''
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

    this.$emit('done', [...cinema])
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
  background: #f2f2f2;
  span {
    margin-right: 20px;
  }
}
/deep/ .cinema-box {
  margin-top: 10px;
  height: 260px;
  max-height: 260px;
  overflow-y: auto;
  .table {
    min-height: 200px;
  }
  /deep/ .check {
    position: relative;
    width: 48%;
    padding-left: 5%;
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
.checkId {
  position: absolute;
  bottom: 18px;
  left: 520px;
}
</style>
