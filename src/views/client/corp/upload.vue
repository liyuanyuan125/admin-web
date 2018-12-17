<template>
  <div class="upload-box">
    <div class="upload-list" v-for="item in uploadlist" :key="item.name">
      <div v-if="!types">
        <template v-if="item.status === 'finished'">
          <img :src="item.imageUrl">
          <div class="upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
      <div v-else  v-for="item in uploadlist" :key="item.name">
         <img :src="item.imageUrl">
          <div class="upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
          </div>
      </div>
    </div>
    <div v-if="!types" style="display: inline-block">
      <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        action="//jsonplaceholder.typicode.com/posts/"
        style="display: inline-block;width: 78px;">
        <div style="width: 78px;height:78px;line-height: 78px;">
          <p></p>
          <p>上传</p>
        </div>
      </Upload> 
    </div>

    <Modal title="View Image" v-model="visible">
      <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import View from '@/util/View'

@Component
export default class ComponentMain extends View {
  @Prop({ type: Array, default: () => [] }) uploadList!: any[]
  @Prop({}) types: any
  uploadlist: any = []
  defaultList = [
  ]
  imgName = ''
  visible = false
  created() {
    this.uploadlist = this.uploadList
  }
  mounted() {
    this.upload()
  }
  upload() {
    if (!this.types) {
      this.uploadlist = (this.$refs.upload as any).fileList
    }
  }
  handleView(name: any) {
    this.imgName = name
    this.visible = true
  }
  handleRemove(file: any) {
    const fileList  = (this.$refs.upload as any).fileList
    ; (this.$refs.upload as any).fileList.splice(fileList.indexOf(file), 1)
  }
  handleSuccess(res: any, file: any) {
    file.imageUrl = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
    file.name = '7eb99afb9d5f317c912f08b5212fd69a'
  }
  handleFormatError(file: any) {
    this.$Notice.warning({
      title: 'The file format is incorrect',
      desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
    })
  }
  handleMaxSize(file: any) {
    this.$Notice.warning({
      title: 'Exceeding file size limit',
      desc: 'File  ' + file.name + ' is too large, no more than 2M.'
    })
  }
  handleBeforeUpload() {
    // const check = this.uploadList.length < 5;
    // if (!check) {
    //   this.$Notice.warning({
    //       title: 'Up to five pictures can be uploaded.'
    //   })
    // }
    // return check
  }
}
</script>

<style lang="less" scoped>
.upload-box {
  background: #ecf0f4;
  padding: 8px;
}
.upload-list {
  display: inline-block;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 8px;
}
.upload-list img {
  width: 100%;
  height: 100%;
}
.upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}
.upload-list:hover .upload-list-cover {
  display: block;
}

.upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
