<template>
  <Modal 
    v-model='showDlg'
    :transfer='false'
    :width='620'
    title='关联影厅'
    @on-cancel="cancel"
    >
    <div  slot="footer" class="dialog-footer">
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
}
</script>

<style lang="less" scoped>
</style>
