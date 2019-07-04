<template>
  <div>
      <Modal v-model="value.visible" title="抓取票神影片" width="500">
          <Form ref="form" :model="form" :rules="rules" :label-width="90">
              <FormItem label="票神影片id" prop="filmid" >
                  <Input v-model="form.filmid" placeholder="请输入票神id" />
              </FormItem>
          </Form>
          <div slot="footer">
              <Button type="primary" :loading="modalLoading" @click="handleSubmit">提交</Button>
              <Button @click="value.visible = false">取消</Button>
          </div>
      </Modal>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
    @Prop({ type: Object}) value!: object

    form: any = {}
    rules = {
        filmid: [{required: true, message: '请输入影片id', trigger: 'blur'}]
    }
    // 确定loading
    modalLoading = false

    async handleSubmit() {
        const valid = await (this.$refs.form as any).validate()
        if (!valid) {
            return
        }
        this.modalLoading = true
        this.$emit('passData', this.form)
        this.modalLoading = false
    }

}

</script>
<style lang='less' scoped>
</style>
