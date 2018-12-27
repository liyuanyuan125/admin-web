<template>
  <Modal 
    v-model='showDlg'
    :width='720'
    title="添加关联影院"
    >
    <p class="cinema-header">注：因资源方类型为影院，因此仅能关联一家影院</p>
    <Row class="shouDlg-header">
      <Col span="7">
        <CinemaChainSelect v-model="chainId"/>
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
        <Form ref="radioCinema" :model="form">
          <FormItem>
            <CheckboxGroup v-model="form.check">
              <div v-if="items.length>0">
                <div v-for="(item, index) in items" :key="index" class="check">
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
  area: number[] = []
  chainId: number = 0
  cinemaList: any = []
  dataForm = {}
  columns: any = [
  ]
  items: any = []
  query: any = {
    provinceId: 0,
    cityId: 0,
    countyId: 0
  }
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
  }

  created() {
    this.seach()
  }

  async seach() {
    const query: any = {
      chainId: this.chainId,
      name: this.value,
      ...this.query,
      pageSize: 10000
    }
    const res = await queryList(clean({...query}))
    this.items = res.data.items
    this.dataLoading = false
  }

  async done() {
    const checkCinema: any = []
    if (this.form.check.length > 0) {
      this.items.forEach((item: any) => {
        if (this.form.check.indexOf(item.id) > -1) {
          checkCinema.push({
            id: item.id,
            cinemaName: item.shortName
          })
        }
      })
    }
    if (this.cinemaend == 1 && checkCinema.length > 1) {
      this.showError('因资源方类型为影院，因此仅能关联一家影院')
      return
    }
    this.$emit('done', checkCinema)
    this.showDlg = false
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
  height: 300px;
  max-height: 300px;
  overflow-y: auto;
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
</style>
