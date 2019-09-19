<template>
  <div class="tencent-map">
    <div class="map-head">
      <Input v-model="model.lng" class="lng-input" number/>
      <span class="separator">-</span>
      <Input v-model="model.lat" class="lat-input" number/>
    </div>
    <div class="map-body" ref="map"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { MapPoint, MapMarker } from './types'
import { load as loadTencentMap } from '@/util/tencentMap'

// doc: https://lbs.qq.com/javascript_v2/doc/map.html

@Component
export default class TencentMap extends ViewBase {
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

  model = this.value

  map: qq.maps.Map | null = null

  mapMarker: qq.maps.Marker | null = null

  oldMarkerJson = ''

  mounted() {
    this.initMap()
  }

  async initMap() {
    if (this.map != null) {
      return
    }
    const { Map } = await loadTencentMap()
    const el = this.$refs.map as HTMLDivElement
    this.map = new Map(el, {
      scrollwheel: false,
      disableDoubleClickZoom: true,
    })
    this.centerAndZoom()
    this.updateMarker()
  }

  centerAndZoom() {
    if (this.map == null) {
      return
    }
    const { lng, lat } = this.model
    const point = new qq.maps.LatLng(lat, lng)
    this.map.setZoom(this.defaultZoom)
    this.map.setCenter(point)
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

    if (this.marker == null) {
      return
    }

    const { Marker } = await loadTencentMap()

    const {
      label = '',
      // offset = new Size(20, -10)
    } = typeof this.marker === 'boolean' ? {} : this.marker

    const point = this.centerAndZoom()

    let mapMarker = this.mapMarker
    if (mapMarker == null) {
      mapMarker = this.mapMarker = new Marker({
        draggable: true,
        map: this.map
      })

      // TODO: add label
      // if (label) {
      //   const mapLabel = new Label(label, { offset })
      //   marker.setLabel(mapLabel)
      // }

      qq.maps.event.addListener(mapMarker, 'dragend', ({ latLng }: any) => {
        const { lng, lat } = latLng
        this.model = { lng, lat }
      })
    }

    mapMarker.setPosition(point!)
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
