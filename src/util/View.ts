import { Vue, Component } from 'vue-property-decorator'
import { alert } from '@/ui/modal'

const ignoreCodes = { 401: 1, 403: 1 }

/**
 * 本系统所有页面、组件的基类
 */
export default class View extends Vue {
  /**
   * 显示错误信息
   * @param msg 错误信息
   */
  showError(msg: string) {
    alert(msg, { title: '出错了' })
  }

  /**
   * 统一处理 ajax catch 异常
   * @param ex
   */
  handleError(ex: any = {}) {
    if (!(ex.code in ignoreCodes)) {
      const msg = ex.msg || ex.code ? `${ex.code} ${ex.msg}` : String(ex)
      this.showError(msg)
      ex.handled = true
      // tslint:disable-next-line
      console.error(msg)
    }
  }
}
