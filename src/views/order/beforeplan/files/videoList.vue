<template>
  <Select v-model="inValue" placeholder="广告片" filterable
    clearable class="component" ref="ui">
    <Option v-for="(it,index) in list" :key="index" :value="it.name"
      :label="it.name" class="flex-box">
      <span>{{it.name}}</span>
    </Option>
  </Select>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList  } from '@/api/planfilm'
import { clean } from '@/fn/object'

@Component
export default class VideoList extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: String, default: '' }) value!: any
  /**
   * 提示文字
   */
  @Prop({ type: String, default: '广告片列表' }) placeholder!: string
  // @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: any = this.value

  list: any = []

  async mounted() {
    try {
      const { data } =  await queryList(clean({ pageSize: 888888, status: 1 }))
      const  data2  =  await queryList(clean({ pageSize: 888888, status: 2 }))
      const  data3  =  await queryList(clean({ pageSize: 888888, status: 3 }))
      const  data4  =  await queryList(clean({ pageSize: 888888, status: 4 }))
      const  data5  =  await queryList(clean({ pageSize: 888888, status: 5 }))
      const  data6  =  await queryList(clean({ pageSize: 888888, status: 6 }))
      const list1: any[] = data.items || []
      const list2: any[] = data2.data.items
      const list3: any[] = data3.data.items || []
      const list4: any[] = data4.data.items || []
      const list5: any[] = data5.data.items || []
      const list6: any[] = data6.data.items || []
      this.list = list1

      for (const key in  list2) {
        if (1 == 1) {
          this.list.push(list2[key])
        }
      }
      for (const key in  list3) {
        if (1 == 1) {
          this.list.push(list3[key])
        }
      }
      for (const key in  list4) {
        if (1 == 1) {
          this.list.push(list4[key])
        }
      }
      for (const key in  list5) {
        if (1 == 1) {
          this.list.push(list5[key])
        }
      }
      for (const key in  list6) {
        if (1 == 1) {
          this.list.push(list6[key])
        }
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('value')
  watchValue(val: number) {
    this.inValue = val
    // 触发 form item 验证
    ; (this.$refs.ui as any).dispatch('FormItem', 'on-form-change', val)
  }

  @Watch('inValue')
  watchInValue(val: number) {
    this.$emit('input', val)
    const row = this.list.filter((item: any) => item.name == val)
    this.$emit('row', row)
  }
}
</script>

<style lang="less" scoped>
.component {
  min-width: 120px;
}
.offline {
  color: #bbb;
  font-style: normal;
}
</style>
