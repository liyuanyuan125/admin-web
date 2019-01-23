import { Vue, Component } from 'vue-property-decorator'
import { slice } from '@/fn/object'
import { numberify, numberKeys } from '@/fn/typeCast'
import { prettyQuery, urlParam } from '@/fn/url'
import { isEmpty } from 'lodash'

/**
 * updateQueryByParam 参数
 */
export interface ParamOptions {
  /** 不使用 route 参数 */
  noRouteParam: boolean
}

/**
 * 实现 URL 管理
 */
@Component
export default class UrlManager extends Vue {
  /** 默认查询参数，必须重写 */
  defQuery: any

  /** 当前查询参数，必须重写 */
  query: any

  updateUrlByCode = false

  beforeRouteUpdate(to: any, from: any, next: any) {
    next()
    this.updateUrlByCode || this.updateQuery(to.query)
    this.updateUrlByCode = false
  }

  /**
   * 从 Url 参数，route 参数中读取数据，更新查询条件
   * @param extraQuery 附加查询条件
   * @param options 选项
   */
  updateQueryByParam(extraQuery?: any, { noRouteParam = false } = {} as ParamOptions) {
    const urlParams = urlParam()
    const routeParams = noRouteParam ? {} : this.$route.params
    const query = { ...urlParams, ...routeParams, ...extraQuery }
    this.updateQuery(query)
  }

  /**
   * 更新 Location Url
   */
  updateUrl() {
    const query = prettyQuery(this.query, this.defQuery)
    this.updateUrlByCode = true
    this.$router.replace({ query })
  }

  /**
   * 更新查询条件
   * @param query 查询条件
   */
  updateQuery(query: any) {
    const keys = Object.keys(this.defQuery)
    const urlQuery = slice(query, keys)
    const newQuery = numberify({ ...this.defQuery, ...urlQuery }, numberKeys(this.defQuery))
    isEmpty(this.query)
      ? (this.query = newQuery)
      : keys.forEach(key => this.query[key] = newQuery[key])
  }

  /**
   * 重置查询
   * @param keepFields 保留的查询参数，默认为 pageSize
   */
  resetQuery(keepFields: string | string[] = 'pageSize') {
    const fields = slice(this.query, keepFields)
    this.updateQuery({ ...this.defQuery, ...fields })
  }
}
