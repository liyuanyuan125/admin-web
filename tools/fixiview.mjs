/**
 * 临时解决方案，修复 iview types 中的一个小错误
 */

import fs from 'fs'

const fpath = 'node_modules/iview/dist/types/iview.components.d.ts'

const text = fs.readFileSync(fpath, { encoding: 'utf8' })
const newText = text.replace('TabsPane', 'TabPane')

newText !== text && fs.writeFileSync(fpath, newText)
