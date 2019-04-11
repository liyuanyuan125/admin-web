<template>
  <Modal v-model="visible" :width="770" :loading="submitLoading" @on-ok="submit">
    <div class="inner-loading flex-mid" v-if="loading">
      <TinyLoading :size="38"/>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import TinyLoading from '@/components/TinyLoading.vue'

@Component({
  components: {
    TinyLoading,
  }
})
export default class Dialog extends ViewBase {
  visible = false

  loading = false

  submitLoading = true

  resetSubmitLoading() {
    this.submitLoading = false
    this.$nextTick(() => this.submitLoading = true)
  }
}
</script>

<style lang="less" scoped>
.form {
  margin-top: 18px;
  padding-right: 28px;
}
.row-address {
  /deep/ .area-select {
    width: 100%;
  }
  .form-item-address {
    position: relative;
    padding-left: 8px;
    /deep/ .ivu-form-item-content {
      margin-left: 0 !important;
    }
  }
}
.inner-loading {
  min-height: 302px;
}
</style>
