import { RawLocation } from 'vue-router'

export interface TabItem {
  name: string | number
  label: string
  route: RawLocation
}
