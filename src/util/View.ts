import { Vue } from 'vue-property-decorator'
import { alert } from '@/ui/modal'

const ignoreCodes = { 401: 1, 403: 1 }

export default class View extends Vue {
  showError(msg: string) {
    alert(msg, { title: '出错了' })
  }

  // 用来统一处理接口 catch 异常
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
