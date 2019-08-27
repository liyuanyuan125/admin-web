<template>
  <Modal 
    v-model='showDlg'
    :width='720'
    title="添加关联影院"
    @on-cancel="cancel()"
    >
    <div  slot="footer" class="dialog-footer">
      <Button type="primary" @click="done()">关联</Button>
      <Button @click="cancel()">取消</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { slice, clean } from '@/fn/object'
import { queryList } from '@/api/cinema'
import { isEqual } from 'lodash'

@Component({
  components: {
  }
})
export default class Main extends ViewBase {

}
</script>

<style lang="less" scoped>

</style>
