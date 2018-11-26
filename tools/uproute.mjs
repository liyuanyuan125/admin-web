/**
 * 动态读取 src/views 下的所有页面，创建 rounters
 */

import globby from 'globby'
import path from 'path'
import fs from 'fs'
import 'colors'
import pathConfig from './uprouterConfig'

const ignoreList = [
  'home',
]

const ignorePrefix = [
  'dlg',
  'part',
]

const comment = `
/**
 * !! 警告：该文件使用 yarn uproute 自动生成，不要手动维护 !!
 */
`

const baseDir = 'src/views'

; (async () => {
  const list = await globby(`${baseDir}/**/*.vue`)

  const lines = list.reduce((result, it) => {
    const relPath = path.relative(baseDir, it)
    const { dir, name } = path.parse(relPath)

    const jpath = dir ? [ dir, name !== 'index' ? name : '' ].join('/') : name
    const jname = jpath.replace(/\//g, '-').replace(/-$/, '')
    const fpath = dir ? [ dir, name ].join('/') : name
    const prefix = (name.match(/^[a-z]+/) || [])[0]

    if (ignoreList.includes(fpath) || ignorePrefix.includes(prefix)) {
      return result
    }

    // 如果配置中有，则优先使用配置中的
    const toPath = pathConfig[jname] || `/${jpath}`

    // 保持下面的格式
    const line = `  {
    path: '${toPath}',
    name: '${jname}',
    component: () => import(/* webpackChunkName: "${jname}" */ './views/${fpath}.vue')
  }`

    return result.concat(line)
  }, [])

  const text = `
${comment.trim()}

export default [
${lines.join(',\n')}
] as any[]
  `.trim()

  fs.writeFileSync('src/routers.ts', text + '\n', { mode: 0o644 })

  console.log('\n✨ Route 已更新 ✨\n')
})()
