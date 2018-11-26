<template>
  <div class="page">about</div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import View from '@/util/View'
import event from '@/fn/event'

import { get, post } from '@/fn/ajax'

@Component
export default class Main extends View {
  async mounted() {
    // const data = await post('/mock/29230/demo/user_list', {
    //   page: 8,
    //   pageSize: 88,
    //   array: [1,2,3],
    //   object: {
    //     name: 'lip',
    //     role: [8,9,10]
    //   }
    // })
    // debugger

    // event.on('ajax800', (ex) => {
    //   debugger
    // })

    try {
      const { data } = await get('/mock/40/demo/error')
      debugger
    } catch (ex) {
      const { code, msg } = ex
      ; ((this as any)[`ajax${code}`] || this.handleError).call(this, ex)
    }
  }

  ajax900100(ex: any) {
    // do something
  }

  ajax900200(ex: any) {
    // do something
  }
}
</script>

<style lang="less" scoped>
.class-1 {
  font-size: 12px;
}
</style>
