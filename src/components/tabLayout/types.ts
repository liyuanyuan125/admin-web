import Vue from 'vue'

export interface RouteItem {
  component?: Vue
  name: string
  query: any
  params: any
  meta?: {
    title: string
    fixed?: boolean
    lastUrl?: string
  }
}
