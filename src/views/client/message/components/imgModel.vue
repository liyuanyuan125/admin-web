<template>
<div class="upload-box">
  <div v-if="!img">
    <div class="upload-list" v-for="item in imgarr" :key="item">
    <img :src="item">
      <div class="upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
      </div>
    </div>
  </div>
  <div v-if="!!img" class="upload-list">
    <img :src="img">
    <div class="upload-list-cover">
      <Icon type="ios-eye-outline" @click.native="handleView(img)"></Icon>
    </div>
  </div>
  <Modal title="View Image" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
  </Modal>
</div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class ImgModel extends ViewBase {
    @Prop() uploadList: any
    imgarr: string[] = []
    img: string = ''
    visible = false
    imgName = ''
    created() {
      if ( (typeof this.uploadList) == 'string' )  {
        this.img = this.uploadList
      } else {
        this.imgarr = this.uploadList
      }
    }
    handleView(name: any) {
      this.imgName = name
      this.visible = true
    }
}
</script>

<style lang="less" scoped>
.upload-box {
  background-color: #ecf0f4;
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  padding: 15px 25px;
  width: 100%;
}
.upload-list {
  text-align: center;
  line-height: 120px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}
.upload-list img {
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
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
