<template>
  <div class="error-page flex-mid" :class="`error-page-${code}`">
    <Button type="primary" class="btn-back" @click="$router.back()">返回</Button>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { MapType } from '@/util/types'

@Component
export default class Error extends ViewBase {
  @Prop({ type: Number, default: 0 }) code!: number
}
</script>

<style lang="less" scoped>
.error-page {
  height: 100%;
  min-height: 588px;
  flex-direction: column;
  background-color: #fff;
  &::before {
    content: '';
    background-size: contain;
    background-repeat: no-repeat;
  }
}
.btn-back {
  width: 200px;
  height: 50px;
  margin-top: 66px;
}
.error-page-403 {
  &::before {
    width: 492px;
    height: 360px;
    background-image: url(//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bhv1mvh8jlg0008089u0.png);
  }
}
.error-page-404 {
  &::before {
    width: 475px;
    height: 409px;
    background-image: url(//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bhv23l18jlg0008089v0.png);
  }
  .btn-back {
    margin-top: 19px;
  }
}
</style>
