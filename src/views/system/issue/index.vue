<template>
  <div class="page">
    <UploadButton
      buttonType="primary"
      :uploaderOptions="options"
      @success="uploadSuccess"
    >上传 Excel</UploadButton>

    <Card title="文件信息" class="file-card" v-if="file != null">
      <Cell title="fileId" :extra="file.fileId"/>
      <Cell title="url" :extra="file.url"/>
      <Cell title="clientName" :extra="file.clientName"/>
      <Cell title="clientSize" :extra="file.clientSize"/>
      <Cell title="clientType" :extra="file.clientType"/>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UploadButton, { FileItem } from '@/components/UploadButton.vue'
import { UploaderOptions } from '@/util/Uploader'

@Component({
  components: {
    UploadButton
  }
})
export default class IssueIndex extends ViewBase {
  file: FileItem | null = null

  options: UploaderOptions = {
    filePostUrl: '/xadvert/off-shelf/import-data',
    fileFieldName: 'file',
  }

  uploadSuccess({ files }: { files: FileItem[] }) {
    this.file = files && files[0]
  }
}
</script>

<style lang="less" scoped>
.file-card {
  margin-top: 15px;
  width: 600px;
}
</style>
