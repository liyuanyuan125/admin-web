<template>
  <Modal 
    v-model='showDlg'
    :width='720'
    title="添加关联影院"
    @on-cancel="cancel()"
    >
    <p class="cinema-header">注：因资源方类型为影院，因此仅能关联一家影院</p>
    <Row class="shouDlg-header">
      <Col span="7">
        <Select v-model="chainId" placeholder="请输入院线名称" filterable
          clearable class="component" ref="ui">
          <Option v-if="!!it.chainName" v-for="it in options" :key="it.id" :value="it.chainId"
            :label="it.chainName" class="flex-box">
            <span class="flex-1">{{it.chainName}}</span>
          </Option>
        </Select>
      </Col>
      <Col span="7" offset="1">
        <AreaSelect v-model="area"/>
      </Col>
      <Col span="5" offset="1">
         <Input v-model="value" placeholder="请输入影院名称" />
      </Col>
      <Button style="float:right" type="primary" @click="seach">搜索</Button>
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
        <Form class="table" ref="radioCinema" :model="form">
          <FormItem>
            <div style="margin-left:34px" v-if="items.length>0">
              <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="handleCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="form.check" ref="checks" @on-change="checkAllGroupChange">
              <div v-if="items.length>0">
                <div v-for="(item) in items" :key="item.id" class="check">
                  <tooltip content="已下架" v-if="item.controlStatus != 1" placement="right">
                    <Checkbox :label="item.id" style="color: red">{{item.shortName}}</Checkbox>
                  </tooltip>
                  <Checkbox v-else :label="item.id">{{item.shortName}}</Checkbox>
                </div>
                <div v-if="(items.length%4) == 3" class="check">&nbsp;</div>
              </div>
              <div v-else class="text-center">
                暂无数据
              </div>
            </CheckboxGroup >
          </FormItem>
        </Form>
        <div class="page-wrap" v-if="totalPage > 0">
          <Page :total="totalPage" :current="pageIndex" :page-size="pageSize"
            show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
            @on-change="sizeChangeHandle"
            @on-page-size-change="currentChangeHandle"/>
            <span class="checkId">已选: {{form.check.length}}</span>
        </div>
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
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import { slice, clean } from '@/fn/object'
import { queryList } from '@/api/cinema'
import { isEqual } from 'lodash'

@Component({
  components: {
    AreaSelect,
    CinemaChainSelect
  }
})
export default class Main extends ViewBase {
  @Prop({ type: Array, default: () => [] }) addData!: any[]
  @Prop() cinemaend: any
  form: any = {
    check: []
  }
  dataLoading: boolean = true
  showDlg: any = false
  loading = true
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
  items: any = []
  query: any = {
    provinceId: 0,
    cityId: 0,
    countyId: 0
  }
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

  async authIdList() {
    try {
      const { data } = await queryList({
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
      chainId: this.chainId,
      name: this.value,
      ...this.query,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }
    try {
      const res = await queryList(clean({...query}))
      this.items = res.data.items
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

  done() {
    if (this.cinemaend == 1 && this.checkCinema.length > 1) {
      this.showError('因资源方类型为影院，因此仅能关联一家影院')
      return
    }
    this.checkCinema.forEach((item: any) => {
      if (this.form.check.indexOf(item.id) == -1 ) {
        const index = this.checkCinema.indexOf(item.id)
        this.checkCinema.splice(index, 1)
      }
    })

    this.$emit('done', [...this.checkCinema])
    this.showDlg = false
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
  @Watch('area')

  watchArea(val: number[]) {
    this.query.provinceId = val[0]
    this.query.cityId = val[1]
    this.query.countyId = val[2]
  }

  cancel(dataForms: string) {
    this.value = ''
    this.area = []
    this.chainId = 0
    this.showDlg = false
    this.pageIndex = 1
    this.seach()
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
/deep/ .cinema-box {
  margin-top: 15px;
  height: 260px;
  max-height: 260px;
  overflow-y: auto;
  .table {
    min-height: 200px;
  }
  /deep/ .check {
    width: 48%;
    padding-left: 5%;
    float: left;
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
  height: 300px;
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
