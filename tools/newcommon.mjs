/**
 * 生成脚本公用工具函数
 * @author zhangpeng
 *
 * TODO: 将几种生成方式合并，搞成问答式的
 */
import 'colors'
import prompt from 'prompt-promise'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

const validName = /^[\w-]+$/

const checkNames = (names, msg) => {
  if (names.some(it => !validName.test(it))) {
    throw new Error(msg)
  }
}

const parseArg = (arg, maxLevel) => {
  const parts = arg.split('/')

  if (parts.length > maxLevel) {
    throw new Error(`最多支持 ${maxLevel} 级`)
  }

  let dirname = ''

  if (parts.length > 1) {
    const dirs = parts.slice(0, -1)
    checkNames(dirs, '目录名中含有非法字符')
    dirname = dirs.join('/')
  }

  const last = parts[parts.length - 1]
  const pages = last.split('+')
  checkNames(pages, '页面名中含有非法字符')

  return dirname
    ? pages.map(it => `${dirname}/${it}`)
    : pages
}

const parseArgs = (args, maxLevel) => {
  return args.reduce((list, arg, i) => {
    try {
      const pages = parseArg(arg, maxLevel)
      return list.concat(pages)
    } catch ({ message }) {
      throw new Error(`第 ${i + 1} 个参数“${arg}”：${message}`)
    }
  }, [])
}

const promptCreate = async list => {
  console.log('\n--------------------------------------')
  console.log(list.join('\n').cyan)
  console.log('--------------------------------------\n')

  const answer = await prompt('确定要创建以上文件吗（已存在的文件会跳过）？[y/N] ') || 'n'
  prompt.done()

  if (answer.toLowerCase() == 'y') {
    return true
  } else {
    console.info(`\n你的回答是“${answer}”，忽略退出\n`.cyan)
    process.exit(8)
    return false
  }
}

const toFiles = (list, { distDir, ext, namePrefix, uppercaseName }) => {
  return list.map(it => {
    const { dir, name } = path.parse(it)
    const upcase = name.slice(0, 1).toUpperCase() + name.slice(1)
    const fname = namePrefix || uppercaseName
      ? namePrefix + upcase
      : name
    return path.join(distDir, dir, `${fname}${ext}`)
  })
}

const print = msg => process.stdout.write(msg)

const makeFiles = (list, tpl) => {
  console.log('\n--------------------------------------')
  list.forEach(fpath => {
    print(`-> create ${fpath.cyan} ... `)
    try {
      if (!fs.existsSync(fpath)) {
        const dirname = path.dirname(fpath)
        mkdirp.sync(dirname, { mode: 0o755 })
        print('done'.green)
        fs.copyFileSync(tpl, fpath)
      } else {
        print('exists, pass'.cyan)
      }
    } catch (ex) {
      console.error(`\nERROR: ${ex}`.red)
    } finally {
      console.log()
    }
  })
  console.log('--------------------------------------\n')
}

export default async function({
  args,
  maxLevel,
  usage,
  distDir,
  tpl,
  namePrefix = '',
  uppercaseName = false,
  onAfter,
}) {
  if (args.length > 0) {
    try {
      if (!fs.existsSync(tpl)) {
        throw new Error(`模板文件“${tpl}”不存在`)
      }

      const names = parseArgs(args, maxLevel)
      const files = toFiles(names, {
        distDir,
        ext: path.extname(tpl),
        namePrefix,
        uppercaseName
      })
      const can = await promptCreate(files)
      can && makeFiles(files, tpl)
      onAfter && onAfter()
    } catch (ex) {
      if (ex && ex.message) {
        console.error(`\n[错误] ${ex.message}\n`.red)
      } else {
        throw ex
      }
    }
  } else {
    console.log(usage)
    process.exit(1)
  }
}
