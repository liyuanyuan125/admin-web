<template>
  <div class="upload-box">
    <slot></slot>
    <div class="upload-list" v-for="item in uploadlist" :key="item.name">
      <div v-if="!types">
        <template v-if="item.status === 'finished'">
          <img :src="item.imageUrl">
          <div class="upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.imageUrl)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
      <div v-else  v-for="item in uploadlist" :key="item.imageUrl">
         <img :src="item.imageUrl">
          <div class="upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.imageUrl)"></Icon>
          </div>
      </div>
    </div>
    <div v-if="!types" style="display: inline-block">
      <div class="ivu-upload" style="display: inline-block;width: 78px;">
        <div class="ivu-upload ivu-upload-drag">
          <input ref="uploadReset" type="file" multiple id="uplaod" @change="onChange" class="ivu-upload-input">
          <label for="uplaod" style="width: 78px;height:78px;line-height: 78px;">
            <p>+</p>
            <p>上传</p>
          </label>
        </div>
      </div>
    </div>

    <Modal title="View Image" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import View from '@/util/View'
import event from '@/fn/event'

import Uploader, { ImageType, UploaderOptions } from '@/util/Uploader'

@Component
export default class ComponentMain extends View {
  @Prop({ type: Array, default: () => [] }) uploadListArray!: any[]
  @Prop({}) types: any
  uploadlist: any = []
  defaultList = [
  ]
  imgName = ''
  format = ['jpg', 'jpeg', 'png', 'gif']
  visible = false
  created() {
    this.uploadlist = this.uploadListArray
  }

  handleView(imageUrl: any) {
    this.imgName = imageUrl
    this.visible = true
  }

  handleRemove(file: any) {
    this.uploadlist.splice(this.uploadlist.indexOf(file), 1)
  }

  handleFormatError(file: any) {
    this.$Notice.warning({
      title: '文件格式不正确',
      desc:  `${file.name}文件格式不是jpg,jpeg,png, gif`
    })
  }

  handleMaxSize(file: any) {
    this.$Notice.warning({
      title: 'Exceeding file size limit',
      desc: 'File  ' + file.name + ' is too large, no more than 2M.'
    })
  }

  onChange(ev: Event) {
    const files = (ev.target as HTMLInputElement).files!
    const uploader = new Uploader({
      imageCompress: {
        keepTypes: [ ImageType.gif, ImageType.png ]
      }
    } as UploaderOptions)
    let imgObject: any = null
    uploader.on({
      thumb: ({ thumb }) => {
        // 已经生成预览图的时候触发，只有上传的是图片的时候，才有这个事件
        // thumb 是图片预览地址，可以直接绑定到 img 的 src 上实现预览
      },
      begin: () => {
        // 开始上传，执行开始动作，比如显示 loading 之类的
        imgObject = {
          showProgress: true,
        }
      },
      progress: (e: ProgressEvent) => {
        const { loaded, total } = e
        const percent = Math.floor(loaded * 100 / total)
        imgObject = {
          size: total,
          percentage: percent,
          ...imgObject
        }
        this.uploadlist.push({...imgObject})
        // loaded 是已上传的字节数，total 是总字节数，percent 是计算出来的百分比
      },
      done: data => {
        const url = data[0].url
        const fileId = data[0].fileId
        imgObject = {
          imageUrl: url,
          fileId,
          ...imgObject
        }
        this.$set(this.uploadlist, this.uploadlist.length - 1, imgObject)
        // 上传成功，url 是上传后的地址，图片预览需要这个值
        // fileId 是文件 ID，一般后端需要这个值
      },
      fail: ex => {
        // ex 是与 ajax 组件相同的错误对象
        this.uploadlist.pop()
        this.handleError(ex)
      },
      end: () => {
        imgObject = {
          ...imgObject,
          showProgress: false,
          status: 'finished'
        }
        this.$set(this.uploadlist, this.uploadlist.length - 1, imgObject)
        this.$emit('imglist', imgObject)
        // 结束上传，无论成功还是失败，都会执行，执行清理工作，比如取消显示 loading
      }
    })
    const uploadArray = Array.from(files)

    if (uploadArray.length === 0) {
      return
    }
    Array.from(files).forEach(i => {
      if (this.format.length) {
        const fileFormat = (i as any).name.split('.').pop().toLocaleLowerCase()
        const checked = this.format.some(item => item.toLocaleLowerCase() === fileFormat)
        if (!checked) {
            this.handleFormatError(i)
            return false
        }
      }
      uploader.upload(i)
    })
    ; (this.$refs.uploadReset as any).value = null
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

.ivu-upload {
  p:first-child {
    position: absolute;
    top: -10px;
    right: 34px;
  }
}
</style>
