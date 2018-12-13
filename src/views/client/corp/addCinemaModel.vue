<template>
  <Modal 
    v-model='showDlg'
    :transfer='false'
    :width='420'
    title="添加关联影院"
    >
    <p class="cinema-header">注：因资源方类型为影院，因此仅能关联一家影院</p>
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="80">
        <FormItem label="地区名称" prop="nameCn">
           <FormItem label="客户类型">
            <Row>
                <Col v-for="it in typeList" :key="it.id" span="8">
                <span class="check-select-group">
                    <Checkbox v-model="it.checked">{{it.name}}</Checkbox>
                    <Select v-model="it.subId" :disabled="!it.checked"
                    :required="!it.checked" class="flex-1" clearable>
                    <Option v-for="sub in typeListSubMap[it.id]" :key="sub.id"
                        :value="sub.id">{{sub.name}}</Option>
                    </Select>
                </span>
                </Col>
            </Row>
        </FormItem>
        <FormItem>
            
        </FormItem>
    </Form>
    <div  slot="footer" class="dialog-footer">
      <Button type="primary" @click="dataFormSubmit('dataForm')">关联</Button>
      <Button @click="cancel('dataForm')">取消</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import View from '@/util/View'

@Component
export default class Main extends View {
}
</script>

<style lang="less" scoped>
.cinema-header {
  position: absolute;
  top: 14px;
  left: 120px;
  font-size: 12px;
  color: #be1a22;
  font-weight: 400;
}
</style>
