<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='600'
    :title="'定金和折扣设置'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="折扣" prop="rejectReason">
        <InputNumber style="width:240px" :min='0' :max='1' v-model="dataForm.discount"></InputNumber><br>
        请输入0-1的小数 (<em style='font-style: normal' v-if='discount != null'>您的可享折扣为{{discount}}</em><em style='font-style: normal' v-else >您暂无可享折扣</em>)
      </FormItem>
      <FormItem label="定金" prop="rejectReason">
        <InputNumber style="width:240px" :min='0' v-model="dataForm.depositAmount"></InputNumber>
      </FormItem>
      <Row v-if='this.itemlist.promotion != null' style='line-height: 26px;'>
      	<Col :span='4'>促销活动名称</Col>
      	<Col :span='9'>{{ this.promotion.name == null ? '暂无' : this.promotion.name}}</Col>
      	<Col :span='3'>活动类型</Col>
      	<Col :span='8'>{{ this.promotion.typeName == null ? '暂无' : this.promotion.typeName}}</Col>
      </Row>
      <Row v-if='this.itemlist.promotion != null' style='line-height: 26px;'>
      	<Col :span='4'>活动ID</Col>
      	<Col :span='8'>{{ this.promotion.id == null ? '暂无' : this.promotion.id}}</Col>
      </Row>
      <Row v-if='this.itemlist.promotion == null' style='line-height: 26px;'>
      	<Col :span='4'>促销活动名称</Col>
      	<Col :span='9'>-</Col>
      	<Col :span='3'>活动类型</Col>
      	<Col :span='8'>-</Col>
      </Row>
      <Row v-if='this.itemlist.promotion == null' style='line-height: 26px;'>
      	<Col :span='4'>活动ID</Col>
      	<Col :span='8'>-</Col>
      </Row>
      <Table v-if='this.itemlist.promotion != null' style='margin-top: 5px;' :columns="columns" :data="activeList"
        border stripe disabled-hover size="small" class="table">
          <template slot="activeNum" slot-scope="{ row: { activeNum , name  } }">
                <div v-if="name == '预估花费'" class="row-acts">
                    {{activeNum == null ? '-' : formatNumber(activeNum)}}
                </div>
                <div v-else class="row-acts">
                    {{activeNum == null ? '-' : formatNumber(activeNum , 2)}}
                </div>
            </template>
            <template slot="fastNum" slot-scope="{ row: { fastNum , name  } }">
                <div  v-if="name == '预估花费'" class="row-acts">
                    {{fastNum == null ? '-' : formatNumber(fastNum)}}
                </div>
                <div v-else class="row-acts">
                    {{fastNum == null ? '-' : formatNumber(fastNum , 2)}}
                </div>
            </template>
      </Table>
      <br>
        整单折扣不可与促销活动同享，设置整单折扣后此单自动取消促销活动资格<br>
        如您设置的折扣值小于可享折扣值，需要下一级主管审批<br>
        设置折扣和定金后，不可再修改方案信息 (影片 / 影院)
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" v-if='dataForm.discount < discount' @click="dataFormSubmit('dataForm')">保存并提交下一级审批</Button>
      <Button type="primary" v-else @click="dataFormSubmit('dataForm')">保存并发送方案至广告主</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { business } from '@/api/beforeplan'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import { formatNumber } from '@/util/validateRules'
import ViewBase from '@/util/ViewBase'
import { itemlist } from '@/api/beforeplan'
const dataForm: any = {
  discount: null,
  depositAmount: null
}

@Component
export default class ComponentMain extends ViewBase {

  showDlg = false
  id = 0
  discount: any = 0

  itemlist: any = {}
  promotion: any = {}

  activeList: any = []

  get formatNumber() {
        return formatNumber
    }

  get ruleValidate() {
    const rules = {
      name: [
          { required: true, message: '请输入备注', trigger: 'blur' }
      ],
      status: [
          { required: true }
      ]
    }
    return rules
  }

  columns = [
    { title: ' ', key: 'name', align: 'center', width: 100 },
    { title: '非活动数据', slot: 'activeNum', align: 'center' },
    { title: '促销活动数据', slot: 'fastNum', align: 'center' },
  ]


  dataForm = { ...dataForm }

  async init(id: number , discount: any , depositAmount: any) {
    this.showDlg = true
    this.id = id || 0
    const { data } = await itemlist(id)
    this.itemlist = data.item
    // 当前登录人可享折扣
    this.discount = data.currentUserDiscount
    // 输入可享折扣值
    this.dataForm.discount = discount,
    // 定金值
    this.dataForm.depositAmount = depositAmount == null ? data.item.estimateCostAmount : depositAmount
    this.promotion = data.item.promotion
    data.item.promotion == null ?
    this.activeList = [
      {
        name: '预估花费',
        activeNum: null,
        fastNum: null
      },
      {
        name: '预估曝光场次',
        activeNum: null,
        fastNum: null
      },
      {
        name: '预估曝光人次',
        activeNum: null,
        fastNum: null
      }
    ] : this.activeList = [
      {
        name: '预估花费',
        activeNum: data.item.estimateCostAmount,
        fastNum: data.item.discountEstimateCostAmount
      },
      {
        name: '预估曝光场次',
        activeNum: data.item.estimateShowCount,
        fastNum: data.item.discountEstimateShowCount
      },
      {
        name: '预估曝光人次',
        activeNum: data.item.estimatePersonCount,
        fastNum: data.item.discountEstimatePersonCount
      }
    ]
    ; (this.$refs.dataForm as any).resetFields()
  }

  cancel(dataForms: string) {
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
   const myThis: any = this
   myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query: any = {
          discount: this.dataForm.discount,
          depositAmount: this.dataForm.depositAmount
        }
        try {
           const res =  await business (this.id, query)
           toast('操作成功')
           this.$emit('done')
           this.showDlg = false
        } catch (ex) {
           this.handleError(ex)
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
</style>
