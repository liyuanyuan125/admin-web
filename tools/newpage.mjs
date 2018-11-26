/**
 * 生成 page 的脚本
 * @author zhangpeng
 */
import newcommon from './newcommon'
import shellExec from 'shell-exec'

const usage = `
usage:
  yarn newpage some/dir/page
  yarn newpage some/dir/page1+page2+...
  yarn newpage some/dir/page other/dir/page ...
`

newcommon({
  args: process.argv.slice(2),
  maxLevel: 3,
  usage,
  distDir: 'src/views',
  tpl: 'tools/tpl-page.vue',
  onAfter() {
    shellExec('yarn uproute')
    .then(({ stdout }) => {
      console.log(stdout)
    })
    .catch(({ stderr, code }) => {
      console.error(stderr)
      process.exit(code)
    })
  }
})
