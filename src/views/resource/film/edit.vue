<template>
  <div>
    <Form class="create-form form-item" :rules="rule" enctype="multipart/form-data" ref="form"
    :model="form" :label-width="120">
      <div class="modal-item">
        <FormItem label="选择影片:" prop="movieId" >
          <Select v-model="form.movieId" filterable clearable  placeholder="请选择资源关联的影片" v-if="!id" >
            <Option v-for="item in filmList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
          <span v-else>{{detailList.name}}</span>
        </FormItem>
      </div>
      <div class="modal-item">
          <h2>图片/视频类物料</h2>
          <FormItem label="物料下载地址：">
            <Input v-model="form.materialUrl" style="width: 90%" placeholder="下载地址" class="input"/>
          </FormItem>
          <FormItem label="资源使用说明：">
            <Input v-model="form.materialDescription" type="textarea" :rows="4" placeholder="使用说明" />
          </FormItem>
      </div>
      <div class="modal-item">
          <h2>导入券资源</h2>
          <FormItem label="已有的电子券" v-if="id">
            <Table :columns="columns" :data="dataList" border stripe disabled-hover size="small" class="table" ></Table>
          </FormItem>
          <FormItem label="导入电子券：">
            <input type="file" @change="onChange" :accept="accept" />
          </FormItem>
          <FormItem label="资源使用说明：">
            <Input v-model="form.couponDescription" type="textarea" :rows="4" placeholder="使用说明" />
          </FormItem>
      </div>
      <div class="batch-btn text-center">
          <Button type="primary" class="btn" @click="handleSubmit('form')"> 提交</Button>
          <Button :to="{name: 'resource-film-index'}"> 取消</Button>
      </div>
    </Form>

  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { relevanceFilm, queryDetail } from '@/api/resourceFilm'
import Uploader from '@/util/Uploader'

@Component
export default class Main extends ViewBase {
  @Prop({ type: String, default: '*' }) accept!: string
  @Prop({type: Number, default: 0}) id!: number

  form: any = {
    movieId: ''
  }
  uploader: any = {}
  uploaderEdit: any = {}

  file: File | null = null

  filmList = []

  detailList: any = {}
  columns = [
    { title: '导入时间', key: 'uploadTime', align: 'center'},
    { title: '导入数量', key: 'totalCount', align: 'center'},
    { title: '已占用数量', key: 'usedCount', align: 'center'},
    { title: '剩余可用数量', key: 'remainingCount', align: 'center'},
  ]

  dataList = []
  // rule = {
  //   movieId:  [{ required: true, message: 'Please select the city2', trigger: 'blur' }]
  // }
  get rule() {
    return {
      // movieId: [{ required: true, message: 'Please select the city4', type: 'number', trigger: 'change' }]
    }
  }
  mounted() {
    if (this.id) { // 编辑
      this.uploaderEdit = new Uploader({
        filePostUrl: `/movie/resource/${this.id}`,
        fileFieldName: 'file',
        fileSubmitMethod: 'put'
      })
      this.queryDetail()
    } else {
      this.uploader = new Uploader({
        filePostUrl: '/movie/resource',
        fileFieldName: 'file'
      })
      this.relevanceFilm()
    }
  }
  async queryDetail() {
    try {
      const { data } = await queryDetail(this.id)
      this.detailList = data || {}
      this.form = {
        materialUrl: this.detailList.material.url,
        materialDescription: this.detailList.material.description,
        couponDescription: this.detailList.coupon.description  // batches
      }
      this.dataList = this.detailList.coupon.batches || [] // 已有的电子券
    } catch (ex) {
      this.handleError(ex)
    }
  }
  onChange(ev: Event) {
    const input = ev.target as HTMLInputElement
    this.file = input.files && input.files[0]
  }

  async relevanceFilm() {
    try {
      const { data } = await relevanceFilm()
      this.filmList = data || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 提交数据
  async handleSubmit(dataForms: string) {
    const vali = await (this.$refs[dataForms] as any).validate()
    if (this.file == null) {
      // TODO: 如果文件是必选的，提示选择文件
      return
    }

    // TODO: 加 loading 等操作

    try {
      if (!this.id) { // 新建
        const data = await this.uploader.upload(this.file, {
          ...this.form
        })
      } else { // 编辑
        const data = await this.uploaderEdit.upload(this.file, {
          ...this.form,
          status: this.detailList.status,
          reviewMessage: this.detailList.reviewMessage
        })
      }
      this.$router.push({name: 'resource-film-index'})
    } catch (ex) {
      this.handleError(ex)
    }
  }
}

</script>
<style lang='less' scoped>
@import '../less/common.less';
.create-form {
  font-size: 14px;
}
</style>
