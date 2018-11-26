/**
 * 生成页面小组件的脚本
 * @author zhangpeng
 */
import newcommon from './newcommon'

const usage = `
usage:
  yarn newpart some/dir/name
  yarn newpart some/dir/name1+name2+...
  yarn newpart some/dir/name other/dir/name ...
`

newcommon({
  args: process.argv.slice(2),
  maxLevel: 3,
  usage,
  distDir: 'src/views',
  tpl: 'tools/tpl-comp.vue',
  namePrefix: 'part',
})
