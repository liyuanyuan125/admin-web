<template>
  <div class="attachment-table">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      disableUrlManager
      ref="listPage"
    >
      <template slot="acts" v-if="!disabled">
        <UploadButton
          buttonType="success"
          multiple
          @success="uploadSuccess"
        >上传附件</UploadButton>
        <span class="attachment-tip">注：支持pdf、doc、docx、rar、7z、zip等格式的文件</span>
      </template>

      <template slot="action" slot-scope="{ row: { id, url } }">
        <div class="row-acts">
          <a :href="url" download>下载</a>
          <a @click="remove(id)">删除</a>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import CinemaDialog, { AddToListEvent } from '@/components/cinemaDialog'
import { CancelableEvent } from '@/util/types'
import { FormInputNumber } from '@/components/editForm'
import UploadButton, { SuccessEvent } from '@/components/UploadButton.vue'
import { getUser } from '@/store'
import { formatTimestamp } from '@/util/dealData'

export interface AttachmentItem {
  id?: number
  name: string
  url: string
  fileId: string
  uploadUser: number
  uploadUserName: string
  uploadTime: number
  uploadTimeText: string
}

@Component({
  components: {
    ListPage,
    CinemaDialog,
    FormInputNumber,
    UploadButton
  }
})
export default class AttachmentTable extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: AttachmentItem[]

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  model: AttachmentItem[] = []

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  get filters(): Filter[] {
    return [
      {
        name: 'pageIndex',
        defaultValue: 1
      },

      {
        name: 'pageSize',
        defaultValue: 10
      }
    ]
  }

  get columns() {
    const list = [
      { title: '序号', key: 'id', width: 60 },
      { title: '附件', key: 'name' },
      { title: '上传时间', key: 'uploadTimeText', width: 150 },
      { title: '上传人', key: 'uploadUserName', width: 150 },
    ] as ColumnExtra[]

    !this.disabled && list.push({ title: '操作', slot: 'action', width: 90 })

    return list
  }

  fetch({ pageIndex: index, pageSize: size }: any) {
    const store = this.model || []
    const totalCount = store.length
    const items = store.slice((index - 1) * size, index * size)
    return {
      items,
      totalCount
    }
  }

  uploadSuccess({ files }: SuccessEvent) {
    const user = getUser()!
    const list = files.map(it => ({
      name: it.clientName,
      url: it.url,
      fileId: it.fileId,
      uploadUser: user.id,
      uploadUserName: user.name,
      uploadTime: Date.now(),
      uploadTimeText: formatTimestamp(Date.now()),
    }) as AttachmentItem)
    this.model = list.concat(this.model)
    this.listPage.update()
  }

  remove(id: number) {
    const index = this.model.findIndex(it => it.id == id)
    if (index > -1) {
      this.model.splice(index, 1)
      this.listPage.update()
    }
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: AttachmentItem[]) {
    this.model = value
  }

  @Watch('model', { deep: true })
  watchModel(value: AttachmentItem[]) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.attachment-table {
  line-height: 1.5;
  /deep/ .list-page {
    margin-bottom: 0;
    min-height: auto;
  }
  /deep/ th,
  /deep/ td {
    padding: 6px 3px;
  }
}

.attachment-tip {
  position: relative;
  top: 1px;
  margin-left: 20px;
  color: #e20;
}
</style>
