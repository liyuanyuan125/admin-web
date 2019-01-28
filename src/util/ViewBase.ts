import { Vue, Component } from 'vue-property-decorator'
import { alert, warning } from '@/ui/modal'

const ignoreCodes = { 401: 1, 403: 1 }

/**
 * 本系统所有页面、组件的基类
 */
@Component
export default class ViewBase extends Vue {
  /**
   * 显示错误信息
   * @param msg 错误信息
   */
  showError(msg: string) {
    alert(msg, { title: '出错了' })
  }

  /**
   * 显示警告信息
   * @param msg 警告信息
   */
  showWaring(msg: string) {
    warning(msg, { title: '提示' })
  }

  /**
   * 将错误格式化成字符串
   * @param ex 错误对象
   */
  formatError(ex: any = {}) {
    const msg = ex.msg || ex.code ? `${ex.code} ${ex.msg}` : String(ex)
    return msg
  }

  /**
   * 统一处理 ajax catch 异常
   * @param ex 错误对象
   */
  handleError(ex: any = {}) {
    if (!(ex.code in ignoreCodes)) {
      const msg = this.formatError(ex)
      this.showError(msg)
      // tslint:disable-next-line
      console.error(msg)
    }
  }
}
