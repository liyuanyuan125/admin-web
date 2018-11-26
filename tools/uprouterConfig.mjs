/**
 * 明确的参数配置
 *
 * 由于启用的动态 route 生成，导致手动配置这些 route 不方便，
 * 这里提供一种补救方案，暂时试行一段时间
 *
 * 暴露出来一个对象，key 为 route-name，值为 path 的配置，
 * 主要用来定义 path 中的 param 参数，暂时不可以定义其他值
 */

export default {
  'client-account-detail': '/client/account/detail/:id',
  'client-corp-detail': '/client/corp/detail/:id',
  'client-corp-edit': '/client/corp/edit/:id',
}
