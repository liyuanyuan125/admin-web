<template>
  <div class="page">
    <div class="form-group">
      <h3 class="group-name">票房城市TOP20设置</h3>
      <div class="field-section" v-if="!initLoading && !timeout && total > 0">
        <div class="field-item">
          <div class="field-item-title">包含城市列表</div>
          <div class="field-item-content">
            城市数量共计【{{total}}】
          </div>
        </div>
        <div class="field-item">
          <div class="field-item-title"></div>
          <div class="field-item-content">

            <div class="fetch-loading" v-if="initLoading">
              <TinyLoading /> 加载中...
            </div>

            <div class="fetch-empty" v-if="!initLoading && !timeout && total === 0">暂无数据</div>

            <div class="fetch-timeout" v-if="timeout">
              请求超时，<a class="retry" @click="retry">点击重试</a>
            </div>

            <div class="fetch-list" v-if="!initLoading && !timeout && total > 0">
              <Button type="default" :loading="loadingId === it.id" @click="removeHandler(it.id)" v-for="(it, index) in list" :key="index" >
                <span v-if="!(loadingId === it.id)"  class="text">{{it.cityName}}</span>
                <Icon v-if="!(loadingId === it.id)" size="20" type="ios-backspace-outline" />
                <span v-else> 删除中...</span>
              </Button>
            </div>

            <Button class="add-button" type="primary" v-if=" total < maxCount " @click="edit">
              <Icon size="12" type="md-add-circle" />      
              <span class="text">添加城市</span>
            </Button>

          </div>
        </div>
      </div>      
    </div>
    <DlgEdit ref="addOrUpdate" :cinemaOnes="editOne"  @refreshDataList="fetchData" v-if="addOrUpdateVisible" @done="fetchData"/>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList, removeItem, addItem } from './data'
import TinyLoading from '@/components/TinyLoading.vue'
import { warning , success, toast } from '@/ui/modal'
import DlgEdit from './dlgEdit.vue'

@Component({
  components: {
    TinyLoading,
    DlgEdit
  }
})
export default class TopCities extends ViewBase {

  list: any[] = []

  maxCount: number = 20

  total: number | null = null

  initLoading = false

  timeout = false

  loadingId: string | null = null

  editOne: any = null

  addOrUpdateVisible = false

  mounted() {
    this.fetchData()
  }

  async fetchData() {
    if (this.initLoading) {
      return
    }
    this.initLoading = true
    this.timeout = false
    try {
      const { data } = await queryList()
      const items = data.items || null
      if (items && items.length !== 0) {
        this.list = items
        this.total = items.length
      }
    } catch (ex) {
      const name = ex && ex.code && `handle${ex.code}`
      ; ((this as any)[name] || this.handleError).call(this, ex)
    } finally {
      this.initLoading = false
    }
  }

  async removeHandler(id?: string) {
    if ( this.loadingId || id == '' || (typeof id !== 'string') ) {
      return
    }

    this.loadingId = id ? id : ''

    const query = {
      ids: [
        ...id
      ]
    }

    try {
      const { data, msg, code } = await removeItem(query)
      if ( code === 0 ) {
        await toast('操作成功')
        this.loadingId = null
        this.fetchData()
      } else {
        await toast('操作失败')
        this.loadingId = null
        this.fetchData()
      }
    } catch (ex) {
      const name = ex && ex.code && `handle${ex.code}`
      ; ((this as any)[name] || this.handleError).call(this, ex)
    } finally {
      this.initLoading = false
    }
  }

  // 新增
  edit(id: number, row: any) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init()
    })
  }

}
</script>

<style lang="less" scoped>
.fetch-loading,
.fetch-empty,
.fetch-timeout {
  color: #888;
  font-size: 16px;
  text-align: center;
  user-select: none;
}

.page {
  .add-button {
    i {
      position: relative;
      top: -1px;
    }
  }
}

.fetch-list {
  button {
    margin-right: 15px;
    margin-bottom: 15px;
    i {
      position: relative;
      top: -1px;
      right: -6px;
    }
    span.text {
      font-size: 14px;
    }
  }
}

.form-group {
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 15px;
  .group-name {
    font-size: 14px;
  }
  .field-section {
    margin-top: 24px;
    .field-item {
      display: flex;
      flex-flow: row;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 24px;
      .field-item-title {
        min-width: 110px;
        text-align: right;
        padding-right: 15px;
      }
      .field-item-content {
        flex: 1;
      }
    }
  }
}
</style>
