<template>
  <div>
    <Form class="create-form form-item" :rules="rule" enctype="multipart/form-data" ref="form"
    :model="form" :label-width="120">
      <div class="modal-item">
        <FormItem label="选择影片:" prop="movieId" v-if="!id" >
          <Select v-model="form.movieId" filterable clearable  placeholder="请选择资源关联的影片"  >
            <Option v-for="item in filmList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="选择影片:" v-else>
          <span>{{detailList.name}}</span>
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
            <Table :columns="columns" :data="detailList.couponBatches" border stripe disabled-hover size="small" ></Table>
          </FormItem>
          <FormItem label="导入电子券：">
            <input type="file"  @change="onChange" :accept="accept" />
          </FormItem>
          <FormItem label="资源使用说明：">
            <Input v-model="form.couponDescription" type="textarea" :rows="4" placeholder="使用说明" />
          </FormItem>
      </div>
      <div class="batch-btn text-center">
          <Button type="primary" class="btn" @click="handleSubmit"> 提交</Button>
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
import couponTable from './component/table.vue'
import { info } from '@/ui/modal'

@Component({
  components: {
    couponTable
  }
})
export default class Main extends ViewBase {
  @Prop({ type: String, default: '*' }) accept!: string
  @Prop({type: Number, default: 0}) id!: number

  form: any = {
    movieId: '',
    materialUrl: '',
    materialDescription: '',
    couponDescription: ''
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

  get rule() {
    return {
       movieId: [{ required: true, message: '请选择影片', type: 'number', trigger: 'change' }]
    }
  }

  mounted() {
    if (this.id) { // 编辑
      this.queryDetail()
      this.uploaderEdit = new Uploader({
        filePostUrl: `/movie/resource/${this.id}`,
        fileFieldName: 'file',
        fileSubmitMethod: 'put'
      })
    } else { // 新建
      this.uploader = new Uploader({
        filePostUrl: '/movie/resource',
        fileFieldName: 'file'
      })
      this.relevanceFilm()
    }
  }

  async queryDetail() {
    const data = await queryDetail(this.id)
    this.detailList = data || {}
    this.form = {
      materialUrl: data.materialUrl,
      materialDescription: data.materialDescription,
      couponDescription: data.couponDescription
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
  async handleSubmit() {
    // 新建影片id和file文件必传验证
    if (!this.id) {
      const verify = await (this.$refs.form as any).validate()
      if (!verify) {return}
      if (!this.file) {
        await info('请导入电子券')
        return
      }
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
