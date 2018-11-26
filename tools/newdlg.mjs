/**
 * 生成对话框的脚本
 * @author zhangpeng
 */
import newcommon from './newcommon'

const usage = `
usage:
  yarn newdlg some/dir/name
  yarn newdlg some/dir/name1+name2+...
  yarn newdlg some/dir/name other/dir/name ...
`

newcommon({
  args: process.argv.slice(2),
  maxLevel: 3,
  usage,
  distDir: 'src/views',
  tpl: 'tools/tpl-dlg.vue',
  namePrefix: 'dlg',
})
