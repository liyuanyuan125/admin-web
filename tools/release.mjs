import { exec } from 'child_process'

// tslint:disable-next-line: no-console
const log = msg => console.log(msg)

const extract = (str, regex, index = 1, defVal = '') => {
  return ((str || '').match(regex) || [])[index] || defVal
}

const shell = async command => {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
      error ? reject({ error, stdout, stderr }) : resolve(stdout.trim())
    })
  })
}

const MAIN = 'master'

const thisTag = async () => {
  await shell('git fetch --tags')
  const tag = await shell('git describe --tags `git rev-list --tags --max-count=1`').catch(() => '1.0')
  const version = extract(tag, /(\d+\.\d+)/) || '1.0'
  return 'v' + version
}

const nextTag = async () => {
  const tag = await thisTag()
  const newTag = tag.replace(/v(\d+\.)(\d+)/i, (_, m, s) => 'v' + m + (+s + 1))
  return newTag
}

const main = async () => {
  const [ vtag ] = process.argv.slice(2)

  if (vtag == 'help') {
    return log('yarn release [version]')
  }

  if (vtag && !/^v?\d+\.\d+$/.test(vtag)) {
    return log(`${vtag} 不符合格式，正确的格式有：v2.3 或 3.8`)
  }

  const branch = await shell('git rev-parse --abbrev-ref HEAD')
  log(`=> 当前分支 ${branch}`)

  if (branch != MAIN) {
    log(`=> 切换到分支 ${MAIN}`)
    await shell('git pull')
    await shell('git push')
    await shell(`git checkout ${MAIN}`)
    await shell(`git pull origin ${branch}`)
    await shell('git push')
  }

  const theTag = await thisTag()
  const newTag = vtag ? vtag.replace(/^v/i, 'v') : await nextTag()

  log(`=> 发布版本 ${theTag} -> ${newTag}`)

  await shell(`git tag -a ${newTag} -m 'version ${newTag}'`)
  await shell(`git push origin ${newTag}`)

  if (branch != MAIN) {
    log(`=> 切换回分支 ${branch}`)
    shell(`git checkout ${branch}`)
  }
}

(async () => {
  try {
    await main()
  } catch (ex) {
    console.error(ex)
  }
})()

