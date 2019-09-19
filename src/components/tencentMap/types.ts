/** 地图上的点 */
export interface MapPoint {
  /** 经度 */
  lng: number
  /** 纬度 */
  lat: number
}

/** 地图上的 marker */
export interface MapMarker {
  /** marker 上的 label */
  label?: string
  /** marker 偏离量，默认 20, 10 */
  offset?: BMap.Size
}
