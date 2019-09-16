// tslint:disable:max-classes-per-file
declare namespace qq.maps {
  // https://lbs.qq.com/javascript_v2/doc/map.html
  class Map {
    constructor(mapContainer: string | HTMLElement, options?: MapOptions)
    setCenter(latLng: LatLng): void
    setZoom(zoom: number): void
  }

  // https://lbs.qq.com/javascript_v2/doc/mapoptions.html
  interface MapOptions {
    center?: LatLng
    zoom?: number
    scrollwheel?: boolean
    disableDoubleClickZoom?: boolean
  }

  // https://lbs.qq.com/javascript_v2/doc/latlng.html
  class LatLng {
    constructor(lat: number, lng: number)
    getLat(): number
    getLng(): number
    clone(): LatLng
    equals(other: LatLng): boolean
  }

  // https://lbs.qq.com/javascript_v2/doc/markeroptions.html
  interface MarkerOptions {
    /** Marker的位置坐标，必填项 */
    position?: LatLng
    /** 该值为true时，Marker可以拖拽移动，默认值false */
    draggable?: boolean
    /** 是否可见，为true时可见 */
    visible?: boolean
    /** 显示Marker的地图 */
    map?: Map
  }

  // https://lbs.qq.com/javascript_v2/doc/marker.html
  class Marker {
    constructor(options: MarkerOptions)

    /** 返回标注是否可见 */
    getVisible(): boolean

    /** 设置标注可见性 */
    setVisible(visible: boolean): void

    /** 返回标注的位置 */
    getPosition(): LatLng

    /** 设置标注位置 */
    setPosition(position: LatLng): void
  }

  // https://lbs.qq.com/javascript_v2/doc/event.html
  // tslint:disable-next-line
  class event {
    static addListener(instance: object, eventName: string, handler: (ev: any) => void): void
  }
}
