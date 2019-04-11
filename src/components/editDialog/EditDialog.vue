<template>
  <Modal v-model="visible" :width="width" :loading="submitLoading" @on-ok="submit">
    <Form :model="item" :label-width="labelWidth" :rules="rules" class="form" ref="form"
      v-show="!loading">
    </Form>
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
    TinyLoading
  }
})
export default class EditDialog extends ViewBase {
  @Prop({ type: Number, default: 770 }) width!: number

  @Prop({ type: Number, default: 76 }) labelWidth!: number

  visible = false

  submitLoading = true

  loading = false

  resetSubmitLoading() {
    this.submitLoading = false
    this.$nextTick(() => this.submitLoading = true)
  }

  async submit() {
  }
}
</script>

<style lang="less" scoped>
.form {
  margin-top: 18px;
  padding-right: 28px;
}
.inner-loading {
  min-height: 302px;
}
</style>
