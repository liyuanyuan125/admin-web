<template>
  <div class="baidu-map">
    <div class="map-head">
      <Input v-model="model.lng" class="lng-input" number :disabled="disabled"/>
      <span class="separator">-</span>
      <Input v-model="model.lat" class="lat-input" number :disabled="disabled"/>
    </div>
    <div class="map-body" ref="map"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { MapPoint, MapMarker } from './types'
import { load as loadBaiduMap } from '@/util/baiduMap'

// doc: http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html

@Component
export default class BaiduMap extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Object, default: () => ({ lng: 0, lat: 0 }) }) value!: MapPoint

  /**
   * 地图的默认缩放级别，默认 16
   */
  @Prop({ type: Number, default: 16 }) defaultZoom!: number

  /**
   * 显示 marker 的配置，默认 null，则不显示
   */
  @Prop({ type: [ Object, Boolean ], default: null }) marker!: MapMarker | boolean

  /**
   * 禁用模式
   */
  @Prop({ type: Boolean, default: false }) disabled!: boolean

  model = this.value

  map: BMap.Map | null = null

  mapMarker: BMap.Marker | null = null

  oldMarkerJson = ''

  mounted() {
    this.initMap()
  }

  async initMap() {
    if (this.map != null) {
      return
    }
    const { Map, Point } = await loadBaiduMap()
    const el = this.$refs.map as HTMLDivElement
    const map = this.map = new Map(el)
    map.addControl(new BMap.NavigationControl())
    this.centerAndZoom()
    this.updateMarker()
  }

  centerAndZoom() {
    if (this.map == null) {
      return
    }
    const { lng, lat } = this.model
    const point = new BMap.Point(lng, lat)
    this.map.centerAndZoom(point, this.defaultZoom)
    return point
  }

  async updateMarker() {
    if (this.map == null) {
      return
    }

    const markerJson = JSON.stringify({ marker: this.marker, point: this.model })
    if (markerJson == this.oldMarkerJson) {
      // 没有改变，直接返回
      return
    }

    this.oldMarkerJson = markerJson

    if (this.mapMarker) {
      this.map.removeOverlay(this.mapMarker)
      this.mapMarker = null
    }

    if (this.marker == null) {
      return
    }

    const { Marker, Label, Size } = await loadBaiduMap()

    const {
      label = '',
      offset = new Size(20, -10)
    } = typeof this.marker === 'boolean' ? {} : this.marker

    const point = this.centerAndZoom()

    const marker = this.mapMarker = new Marker(point!, {
      enableDragging: true
    })

    if (label) {
      const mapLabel = new Label(label, { offset })
      marker.setLabel(mapLabel)
    }

    this.map.addOverlay(marker)

    marker.addEventListener('dragend', (ev: any) => {
      const { point: { lng, lat } } = ev
      this.model = { lng, lat }
    })
  }

  @Watch('value', { deep: true, immediate: true })
  async watchValue(value: MapPoint) {
    this.model = value
    this.updateMarker()
  }

  @Watch('model', { deep: true })
  watchModel(value: MapPoint) {
    this.$emit('input', value)
  }

  @Watch('marker', { deep: true, immediate: true })
  watchMarker(value: MapMarker) {
    this.marker = value
    this.updateMarker()
  }
}
</script>

<style lang="less" scoped>
.map-body {
  height: 500px;
  margin-top: 16px;
}

.lng-input,
.lat-input {
  width: 158px;
}

.separator {
  margin: 0 8px;
}
</style>
