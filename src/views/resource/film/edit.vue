<template>
  <div>
    <Form class="create-form form-item" :rules="rule" enctype="multipart/form-data" ref="form"
    :model="form" :label-width="120">
      <div class="modal-item">
        <FormItem label="选择影片:" prop="movieId" >
          <Select v-model="form.movieId" filterable clearable  placeholder="请选择资源关联的影片" >
            <Option v-for="item in filmList" :key="item.id" :value="item.id">{{item.companyName}}</Option>
          </Select>
        </FormItem>
      </div>
      <div class="modal-item">
          <h2>图片/视频类无聊</h2>
          <FormItem label="物料下载地址：">
            <Input v-model="form.materialUrl" placeholder="下载地址" class="input"/>
          </FormItem>
          <FormItem label="资源使用说明：">
            <Input v-model="form.materialDescription" type="textarea" :rows="4" placeholder="使用说明" />
          </FormItem>
      </div>
      <div class="modal-item">
          <h2>导入券资源</h2>
          <FormItem label="已有的电子券" v-if="editID">
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
          <Button> 取消</Button>
      </div>
    </Form>

  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { relevanceFilm } from '@/api/resourceFilm'
import Uploader from '@/util/Uploader'

const uploader = new Uploader({
  filePostUrl: '/movie/resource',
  fileFieldName: 'file',
})

@Component
export default class Main extends ViewBase {
  @Prop({ type: String, default: '*' }) accept!: string

  form: any = {
    movieId: ''
  }

  file: File | null = null

  filmList = []

  editID = ''

  columns = [
    { title: '导入时间', key: 'importTime', align: 'center'},
    { title: '导入数量', key: 'importNum', align: 'center'},
    { title: '已占用数量', key: 'usedQuantity', align: 'center'},
    { title: '剩余可用数量', key: 'remainingQuantity', align: 'center'},
  ]

  dataList = []
  // rule = {
  //   movieId:  [{ required: true, message: 'Please select the city2', trigger: 'blur' }]
  // }
  get rule() {
    return {
      movieId: [{ required: true, message: 'Please select the city4', type: 'number', trigger: 'change' }]
    }
  }
  mounted() {
    this.editID = this.$route.params.id
    this.relevanceFilm()
  }

  onChange(ev: Event) {
    const input = ev.target as HTMLInputElement
    this.file = input.files && input.files[0]
  }

  async relevanceFilm() {
    try {
      const { data: {items} } = await relevanceFilm({
        pageIndex: 1,
        pageSize: 999999
      })
      this.filmList = items
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
      const data = await uploader.upload(this.file, {
        ...this.form
      })
      // debugger
      // const { data} = await createResource(this.form)
      // this.$router.push({name: 'resource-film-index'})
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