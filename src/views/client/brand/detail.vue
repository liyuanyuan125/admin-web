<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>{{title}}</em>
      </div>
    </header>
    <Form :model='query' :label-width='88' :rules='rules' label-position="left" class='form page detail-box' ref='dataForms'>
      <div class='titop'>公司基本信息</div>
      <Row class="detail-content">
        <Row>
          <Col span="10">
          <FormItem label="公司ID">
            <span>{{companyId}}</span>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10">
          <FormItem label="公司名称">
            <span>{{companyName}}</span>
          </FormItem>
          </Col>
          <Col :offset="2" :span="6">
          <FormItem label="公司简称">
            <span>{{companyShortName}}</span>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10">
          <FormItem label="客户类型">
            <span v-if=" typeNameArr.length > 0 ">
              {{ typeNameArr[0][0] }} {{ typeNameArr[0][1] ? '，'+typeNameArr[0][1] : '' }}
              <span v-if=" typeNameArr[1]">
                / {{ typeNameArr[1][0] }} {{ typeNameArr[1][1] ? '，'+typeNameArr[1][1] : '' }}
              </span>
            </span>
          </FormItem>
          </Col>
        </Row>
      </Row>
      <div class='titop'>申请单基本信息</div>
      <Row class="detail-content">
        <Row v-if="!needAudit">
          <Col :span="10">
            <FormItem label="关联状态">
              <span>{{ statusName }}</span>
            </FormItem>
          </Col>
          <Col :offset="2" :span="6">
            <FormItem label="申请方式">
              <span>{{ applyName }}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="10">
          <FormItem label="申请时间">
            <span>{{ moment(createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </FormItem>
          </Col>
          <Col :offset="2" :span="6">
          <FormItem label="申请账号邮箱">
            <span>{{email}}</span>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10">
          <FormItem label="品牌ID">
            <span>{{brandId}}</span>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="10">
          <FormItem label="品牌中文名称">
            <span>{{brandName}}</span>
          </FormItem>
          </Col>
          <Col :offset="2" :span="6">
          <FormItem label="品牌英文名称">
            <span>{{brandEnName}}</span>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="11">
          <FormItem label="品牌LOGO" :show-message="!(brandLogo == '')">
            <div class="imgPing">
              <div>
                <div v-if=" brandLogo == '' " class="show-img">
                  <img src="~@/assets/imgerror.png" />
                </div>
                <ImgModel v-if="brandLogo" :uploadList="brandLogo"  />
              </div>
            </div>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="20">
            <FormItem label="资质文件">
              <div class="imgPing">
                <div>
                  <div v-if=" fileIds.length == 0 " class="show-img">
                    <img src="~@/assets/imgerror.png" />
                  </div>
                  <ImgModel v-if=" fileIds.length > 0 " :uploadList="fileIds"  />
                </div>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Row>
      <div v-if="needAudit" class='titop'>审核意见</div>
      <Row v-if="needAudit" class="detail-content">
        <FormItem label="审核意见" prop="approveStatus">
          <Row>
            <Col span="10">
            <RadioGroup v-model="query.approveStatus">
              <Radio :label=1>
                <span>通过</span>
              </Radio>
              <Radio :label=2>
                <span>未通过</span>
              </Radio>
            </RadioGroup>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="备注">
          <Row>
            <Col span="10">
              <Input v-model="query.remark" />
            </Col>
          </Row>
        </FormItem>
      </Row>
    </Form>
    <div v-if="!needAudit" class='titop'>操作日志</div>
    <div class="log-wrap">
      <Table :columns="columns" :data="logList"
            border stripe disabled-hover size="small" class="table"></Table>
    </div>
    <div v-if="needAudit" class="edit-button">
      <Button type="info" size="large" @click="approvehandle('dataForms')">提交</Button>
    </div>
    <div v-if="!needAudit" class="edit-button">
      <Button type="info" size="large" @click="back">返回</Button>
    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { queryId } from '@/api/corpReal'
import Upload from '@/components/Upload.vue'
import CompanyList from '@/components/companyList.vue'
import { getUser } from '@/store'
import { getIdDetal } from '@/api/film'
import { queryList, queryItem, approvePass, approveReject, log } from '@/api/clientBrand'
import ImgModel from './components/imgModel.vue'
const timeFormat = 'YYYY/MM/DD'
import { findIndex } from 'lodash'
const getName = (key: string, list: any[]) => {
  const i: number = findIndex(list, (it: any) => {
    return key === it.key
  })
  const res: string = list[i].text
  return res
}

@Component({
  components: {
    Upload,
    CompanyList,
    ImgModel
  }
})
export default class Main extends ViewBase {
  moment = moment
  needAudit: boolean = false
  title = ''
  id: any = null
  query: any = {
    id: null,
    remark: '',
    approveStatus: null
  }
  // brands
  status: number = 0
  companyId: number = 0
  companyName: string = ''
  companyShortName: string = ''
  typeNameArr: any[] = []
  createTime: string = ''
  email: string = ''
  brandId: string = ''
  brandName: string = ''
  brandEnName: string = ''
  brandLogo: string = ''
  fileIds: string[] = []

  applyName: string = ''
  statusName: string = ''

  logList: any = []

  get columns() {
    return [
      { title: '序号', key: 'logId', width: 200 },
      { title: '操作类型', key: 'description', width: 150 },
      { title: '操作时间', key: 'createTime', minWidth: 150 },
      { title: '操作人', key: 'createUserName', width: 200 },
    ] as any[]
  }

  get rules() {
    return {
      approveStatus: [
         { required: true, message: '请选择审核结果', type: 'number', trigger: 'change' }
      ]
    }
  }

  created() {
    this.getDetailHandler()
    this.getLogHandler()
  }

  async getDetailHandler() {
    try {
      const id = Number(this.$route.params.id) || null
      this.id = id || null
      if ( !id ) { return }
      const { data } = await queryItem(id)
      const brandRelationStatus = data.brandRelationStatus || null
      const brandRelationType = data.brandRelationType || null
      const applyType = data.item.applyType || null
      const status = data.item.status || 0
      if (status === 5) {
        this.needAudit = true
        this.title = '审核'
      } else if (status == -1 || status == 10 || status == 15) {
        this.needAudit = false
        this.title = '查看'
      }
      this.status = status

      this.statusName = getName(status, brandRelationStatus)
      this.applyName = getName(applyType, brandRelationType)

      this.companyId = data.item.companyId || 0
      this.companyName = data.item.companyName || ''
      this.companyShortName = data.item.companyShortName || ''

      const typeCodeList = data.typeCodeList || null
      const typeCategoryCodeList = data.typeCategoryCodeList || null
      const typeList = data.item.companyCustomerType || []
      if (typeList.length > 0 && typeCodeList && typeCategoryCodeList) {
        // 初始化
        typeList.forEach((it: any) => {
          this.typeNameArr.push([])
        })
        // 内容填充
        typeList.forEach((it: any, index: number) => {
          if (it.typeCode) {
            this.typeNameArr[index].push(getName(it.typeCode, typeCodeList))
          }
          if (it.typeCategoryCode) {
            this.typeNameArr[index].push(
              getName(it.typeCategoryCode, typeCategoryCodeList)
            )
          }
        })
      }
      this.brandLogo = data.item.brandLogo || ''
      this.createTime = data.item.createTime || ''
      this.email = data.item.email || ''
      this.brandId = data.item.brandId || '-'
      this.brandName = data.item.brandName || ''
      this.brandEnName = data.item.brandEnName || ''
      this.fileIds = data.item.fileIds || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async getLogHandler() {
    try {
      const id = Number(this.$route.params.id) || null
      this.id = id || null
      if ( !id ) { return }
      const { data } = await log(id)
      if ( data.length > 0 ) {
        this.logList = data
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  back() {
    this.$router.go(-1)
  }

  async approvehandle(dataForms: string) {
    const flag = await (this.$refs[dataForms] as any).validate()
    if (flag) {
      (this.$Spin as any).show()
      if ( this.query.approveStatus === 1 ) {
        await approvePass({
          id: this.id,
          remark: this.query.remark
        })
      } else if ( this.query.approveStatus === 2 ) {
        await approveReject({
          id: this.id,
          remark: this.query.remark
        })
      }
      ~(this.$Spin as any).hide()
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

.page {
  margin-right: 14px;
}

.header {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;
  em,
  i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}

.detail-number {
  /deep/ .btn-add {
    margin-left: 8px;
    line-height: 50px;
  }
}

.btn-back {
  margin-right: 10px;
}

.detail-check {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  padding: 10px;
  background: #fff;
  padding-left: 14px;
}

.detail-header,
.detail-content,
.detail-footer,
.detail-number {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  background: #fff;
  padding-top: 22px;
  padding-left: 14px;
  /deep/ .ivu-col-span-2 {
    div {
      line-height: 50px;
      width: 88px;
    }
  }
  .red {
    color: red;
  }
  span {
    display: inline-block;
    color: #717975;
  }
  span:only-child:empty {
    &::before {
      content: '暂无';
    }
  }
  /deep/ .cinema-button {
    margin-bottom: 20px;
  }
  /deep/ .ivu-col-span-8 > div {
    padding-top: 8px;
  }
  .mainImgHeight {
    height: 116px;
  }
}

.edit-button {
  text-align: center;
}
.titop {
  line-height: 28px;
  color: rgb(61, 156, 235);
  font-size: 16px;
}
.log-wrap {
  padding-right: 15px;
  padding-bottom: 50px;
}
</style>
