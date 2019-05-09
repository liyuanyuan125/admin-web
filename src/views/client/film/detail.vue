<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>{{title}}</em>
      </div>
    </header>
    <Form :model='query' :label-width='88' :rules='rules' label-position="left" class='form page detail-box' ref='dataForms'>
      <div class='titop'>申请主体</div>
      <Row class="detail-content">
        <Row>
          <Col span="10">
            <FormItem label="公司名称" prop="companyId">
              <CompanyList v-if="!$route.params.id" v-model="query.companyId" @row="rowName" />
              <span v-else>{{companyName}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
           <Col span="10">
            <FormItem label="联系人">
              <span>{{contact}}</span>
            </FormItem> 
           </Col>
           <Col v-if="$route.params.id" span="10">
            <FormItem label="关联状态">
              <span>{{statusName}}</span>
            </FormItem> 
           </Col>
        </Row>
        <FormItem v-if="$route.params.id" label="申请时间">
          <span>{{applyTime}}</span>
        </FormItem>
        <Row>
          <Col span="10">
            <FormItem label="凭证" prop="certificate" :show-message="!(query.certificate.length>0)">
              <div class="imgPing">
                <Upload v-if="!$route.params.id" v-model="query.certificate" multiple :maxCount="5" accept="image/*"/>
                <div v-else>
                  <div v-if="query.certificate.length == 0" class="show-img">
                    <img src="~@/assets/imgerror.png"/>
                  </div>
                  <Upload v-else readonly v-model="query.certificate" />
                </div>
              </div>
            </FormItem> 
          </Col>
        </Row>
      </Row>

      <div class='titop'>关联主体</div>
      <Row class="detail-content">
        <Row>
          <Col span="10">
            <FormItem label="影片名称" prop="movieId">
              <Select  v-if="!$route.params.id" v-model="query.movieId" filterable
                clearable class="component" ref="ui">
                <Option v-for="it in fileList" :key="it.id" :value="it.id"
                  :label="it.name" class="flex-box">
                  <span>{{it.name}}</span>
                </Option>
              </Select>
              <span v-else>{{movieName}}</span>
            </FormItem>
          </Col>
          <Col span="10" offset="2">
            <FormItem label="上映日期">
              <span>{{openTime}}</span>
            </FormItem> 
          </Col>
        </Row>
        <Row>
          <Col span="10">
            <FormItem label="影片主图" v-if="!$route.params.id">
              <div v-if="show" class="mainImgHeight">
                <ImgModel v-if="mainPicUrl"  :uploadList="mainPicUrl" :type=1 />
              </div>
              <span v-else></span>
            </FormItem> 
            <FormItem label="影片主图" v-else>
              <ImgModel v-if="mainPicUrl"  :uploadList="mainPicUrl" :type=1 />
              <span v-else></span>
            </FormItem> 
          </Col>
          <Col span="10" offset="2">
            <FormItem label="影片类型">
              <span>{{fileType}}</span>
            </FormItem> 
          </Col>
        </Row>
      </Row>
      <div v-if="status != 3">
        <div class='titop'>备注</div>
        <Row class="detail-content">
          <Row>
            <Col span="10">
              <FormItem label="备注">
                <Input v-model="query.remark"/>
              </FormItem> 
            </Col>
          </Row>
        </Row>
        <div v-if="!$route.params.id" class="edit-button">
          <Button type="info" size="large" @click="addfilms('dataForms')">关联</Button>
        </div>
        <div v-else  class="edit-button">
          <Button type="info" size="large" style="margin-right: 20px" @click="addrelevance('dataForms')">关联</Button>
          <Button size="large" @click="cancel('dataForms')">取消关联</Button>
        </div>
      </div>
    </Form>
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
import ImgModel from '@/views/data/film/imgModel.vue'
import { getUser } from '@/store'
import { toMap } from '@/fn/array'
import { queryList, getIdDetal } from '@/api/film'
import { addfilm, filmId, relevanceNot, relevance } from '@/api/clientFilm'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY/MM/DD'

@Component({
  components: {
    Upload,
    CompanyList,
    ImgModel,
  }
})
export default class Main extends ViewBase {

  title = ''
  contact: string = ''
  fileList: any = null
  openTime = ''
  fileType = ''
  mainPicUrl = ''
  show = false
  query: any = {
    companyId: null,
    movieId: null,
    certificate: [],
    remark: ''
  }
  status = ''
  statusName = ''
  companyName: any = ''
  movieName: any = ''
  applyTime = ''

  get rules() {
    return {
      companyId: [
        { required: true, message: '请选择公司名称', type: 'number', trigger: 'change' }
      ],
      movieId: [
        { required: true, message: '请选择影片名称', type: 'number', trigger: 'change' }
      ],
      certificate: [
         { required: true, message: '请选择上传凭证', type: 'array', trigger: 'change' }
      ]
    }
  }

  get proposer() {
    const name = getUser()!.name
    return name
  }

  created() {
    if (this.$route.params.id) {
      this.title = '影片关联'
      this.fileDetail()
    } else {
      this.title = '新建影片关联'
      this.fileLists()
    }
  }

  async fileDetail() {
    try {
      const { data } = await filmId(Number(this.$route.params.id))
      this.companyName = data.companyName || ''
      this.openTime = data.openTime ? moment(data.operationTime).format(timeFormat) : ''
      this.contact = data.contactName
      this.movieName = data.movieName
      this.mainPicUrl = data.mainPicUrl
      this.fileType = (data.movieType || []).join('/')
      this.status = data.status
      this.statusName = data.statusList.filter((it: any) => it.key == data.status)[0].text
      this.applyTime = data.applyTime ? moment(data.applyTime).format(timeFormat) : ''
      this.query.certificate = (data.certificate || []).map((it: any) => {
        return {
          ...it,
          url: it.fileUrl
        }
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async fileLists() {
    try {
      const { data: { items } } = await queryList({pageIndex: 1, pageSize: 999999, controlStatus: 1})
      this.fileList = items.filter((item: any) => item.releaseStatus != 4)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  back() {
    this.$router.go(-1)
  }

  rowName(data: any) {
    this.contact = data[0].contact || ''
  }

  goSet() {
    const id = this.$route.params.id
    this.$router.replace({ name: 'client-corp-edit', params: { id }} )
  }

  async filmIddetils(value: number) {
    try {

      const res = await getIdDetal({id: value})
      this.openTime = res.data.openTime ? moment(res.data.openTime).format(timeFormat) : ''
      this.fileType = (res.data.type || []).join('/')
      this.mainPicUrl = res.data.mainPicUrl || ''
      if (this.mainPicUrl) {
        this.show = true
      } else {
        this.show = false
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async addfilms(dataForms: string) {
    const flag = await (this.$refs[dataForms] as any).validate()
    if (flag) {
      (this.$Spin as any).show()
      await addfilm({
        ...this.query,
        certificate: this.query.certificate.map((it: any) => it.fileId)
      })
      ; (this.$Spin as any).hide()
      this.$router.push({ name: 'client-film' })
    }
  }

  async addrelevance() {
    try {
      (this.$Spin as any).show()
      await relevanceNot(Number(this.$route.params.id), { remark: this.query.remark })
      ; (this.$Spin as any).hide()
      this.$router.push({ name: 'client-film' })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async cancel() {
    try {
      (this.$Spin as any).show()
      await relevanceNot(Number(this.$route.params.id), { remark: this.query.remark })
      ; (this.$Spin as any).hide()
      this.$router.push({ name: 'client-film' })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('query.movieId')
  watchQueryMoieId(val: number) {
    if (val) {
      this.mainPicUrl = ''
      this.filmIddetils(val)
    } else {
      this.show = false
      this.openTime = ''
      this.fileType = ''
      this.mainPicUrl = ''
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
  em, i {
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

.detail-header, .detail-content, .detail-footer, .detail-number {
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

.upload {
  padding-bottom: 40px;
  /deep/ .uplaod-slot {
    margin-bottom: 10px;
    color: #19be6b;
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

</style>
