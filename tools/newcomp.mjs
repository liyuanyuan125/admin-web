/**
 * 生成组件的脚本
 * @author zhangpeng
 */
import newcommon from './newcommon'

const usage = `
usage:
  yarn newcomp some/dir/component
  yarn newcomp some/dir/component1+component1+...
  yarn newcomp some/dir/component other/dir/component ...
`

newcommon({
  args: process.argv.slice(2),
  maxLevel: 3,
  usage,
  distDir: 'src/components',
  tpl: 'tools/tpl-comp.vue',
  uppercaseName: true,
})
