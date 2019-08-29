<template>
  <Modal 
    v-model='showDlg'
    :width='720'
    title="添加关联影院"
    style="top: 20px"
    @on-cancel="cancel()"
    >
    <Row class="shouDlg-header">
      <Col span="7">
        <Input v-model="value" placeholder="影片中文名" />
      </Col>
      <Col span="5" offset="1">
         <DatePicker type="daterange" @on-change='timechange' placeholder="请选择上映时间"></DatePicker>
      </Col>
      <Button style="float:right" type="primary" @click="seach(1)">搜索</Button>
    </Row>
    <Table style='margin-top: 20px' stripe @on-selection-change="check" :loading="loading" :columns="columns" :data="tableDate">
    </Table>
    <div style='margin-top: 20px' class="page-wrap" v-if="total > 0">
      <Page :total="total" class="btnCenter"
          :current="dataForm.pageIndex"
          :page-size="dataForm.pageSize"
          show-total
          show-elevator
          @on-change="sizeChangeHandle"
          @on-page-size-change="currentChangeHandle"/>
      <span class="checkId">已选: {{checkId.length}}</span>
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
import { slice, clean } from '@/fn/object'
import { queryList } from '@/api/film-ed'
import { isEqual } from 'lodash'

@Component({
  components: {
  }
})
export default class Main extends ViewBase {

  @Prop({ type: Array, default: () => [] }) addData!: any[]
  total = 0
  dataForm: any = {
    pageIndex: 1,
    pageSize: 6,
  }

  loading = true
  showDlg: any = false

  data: any = []
  checkId: any = []
  checkObj: any = []
  time: any = []
  query: any = {
    name: '',
    startTime: '',
    endTime: '',
  }

  columns: any = [
    {
      type: 'selection',
      width: 60,
      align: 'right'
    },
    {
      title: '影片中文名',
      key: 'name',
      align: 'center'
    },
    {
      title: '影片英文名',
      key: 'englishName',
      align: 'center'
    }
  ]

  timechange(val: any) {
    this.query.startTime = val[0] ? new Date(val[0]).getTime() : ''
    this.query.endTime = val[1] ? new Date(val[1]).getTime() : ''
  }

  init(val: any) {
    this.showDlg = true
    this.checkObj = [...(val || [])]
    this.checkId = (val || []).map((it: any) => it.id)
  }

  get tableDate() {
    if (this.data && this.data.length > 0) {
      return this.data.map((it: any) => {
        if (this.checkId.includes(it.id)) {
          return {
            ...it,
            _checked: true
          }
        } else {
          return {
            ...it,
          }
        }
      })
    } else {
      return []
    }
  }

  created() {
    this.seach()
  }

  done() {
    this.$emit('done', [...this.checkObj])
    this.showDlg = false
  }

  check(data: any) {
    const ids = this.data.map((it: any) => it.id)
    const dataId = data.map((it: any) => it.id)
    data.forEach((item: any) => {
      if (!this.checkId.includes(item.id)) {
        this.checkId.push(item.id)
        this.checkObj.push(item)
      }
    })
    const filterId = ids.filter((it: any) => !dataId.includes(it))
    this.checkId = this.checkId.filter((it: any) => !filterId.includes(it))
    this.checkObj = this.checkObj.filter((it: any) => !filterId.includes(it.id))
  }

  async seach() {
    this.loading = true
    try {
      const {
        data: {
          items,
          totalCount
        }
      } = await queryList({
        ...this.query,
        ...this.dataForm
      })
      this.loading = false
      this.total = totalCount
      this.data = items || []
      this.$emit('ref')
    } catch (ex) {
      this.loading = false
      this.handleError(ex)
    }
  }

   // 每页数
  sizeChangeHandle(val: any) {
    this.dataForm.pageIndex = val
    this.seach()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.dataForm.pageSize = val
    this.seach()
  }

  cancel() {
    this.showDlg = false
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-modal {
  top: 20px;
}
.checkId {
  position: absolute;
  bottom: 18px;
  left: 520px;
}
</style>
