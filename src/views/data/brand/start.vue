<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="status == 1 ? '禁用' : '启用'"
    @on-cancel="cancel('dataForm')" >
      <Row>
        <Col :span="24">
          <div class="detail">
            <span>
              品牌ID: {{id}}
            </span>
          </div>
        </Col>
        <Col :span="11">
          <div class="detail">
            <p>
              品牌中文名称: <span>{{name}}</span>
            </p>
          </div>
        </Col>
        <Col :span="12" :offset="1">
          <div class="detail">
            <p>
              品牌英文名称: <span>{{namecN}}</span>
            </p>
          </div>
        </Col>
      </Row>
    <div  slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { dataFrom , add , set} from '@/api/cinemaChain'
import { warning , success } from '@/ui/modal'
import ViewBase from '@/util/ViewBase'
import { brandstart, brandstop } from '@/api/brand'

@Component
export default class ComponentMain extends ViewBase {
  showDlg = false
  status = 0

  name = ''
  namecN = ''
  id = 0

  init(row: any) {
    this.showDlg = true
    this.status = row.status
    this.name = row.name || ''
    this.id = row.id
    this.namecN = row.enName
  }

  cancel() {
    this.showDlg = false
  }

  async dataFormSubmit() {
    try {
      if (this.status == 1) {
        await brandstop(this.id)
      } else if (this.status == 2) {
        await brandstart(this.id)
      }
      this.$emit('done')
      this.cancel()
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  margin-bottom: 20px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  span:only-child:empty::before {
    content: "-";
  }
}
</style>