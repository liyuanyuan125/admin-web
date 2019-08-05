import { Vue, Prop, Component } from 'vue-property-decorator'
import formatter, { Formatter } from './formatter'

const emptyFormatter: Formatter = v => String(v)

const resolveFormatter = (
  poptip: boolean | string | Formatter,
  defaultFormatter: Formatter = emptyFormatter
) => {
  const result = (typeof poptip === 'function'
    ? poptip
    : typeof poptip === 'string' ? formatter[poptip] : null) ||  defaultFormatter
  return result
}

/**
 * 含有 poptip 功能的组件
 */
@Component
export default class WithPoptip extends Vue {
  /**
   * 是否显示 poptip，以及用什么格式化函数
   * 当 poptip 为 true 时，则使用组件默认的格式化函数显示提示
   * 当 poptip 为 string 时，则使用 formatter.ts 中的函数名对应的格式化函数显示提示
   * 当 poptip 为函数时，则只用该函数本身
   */
  @Prop({ type: [Boolean, String, Function], default: false }) poptip!: boolean | string | Formatter

  /**
   * 获取格式化后的提示文本
   * @param value 值，一般传入 model
   * @param emptyValues 被当做空的值列表，null 始终被认为是空值
   * @param defaultPoptip 默认的格式化函数名或函数（当 poptip 为 true 时的格式化函数），
   *                      可用的格式化函数参见 ./formatter.ts
   */
  public getPoptipText(
    value: null | number | string,
    emptyValues: any[] = [],
    defaultPoptip: string | Formatter = emptyFormatter
  ) {
    const poptip = this.poptip
    if (poptip === false) {
      return false
    }
    const defaultFormatter = resolveFormatter(defaultPoptip)
    const poptipFormatter = resolveFormatter(poptip, defaultFormatter)

    const result = value != null && !emptyValues.includes(value)
      ? poptipFormatter(value)
      : false
    return result
  }
}
