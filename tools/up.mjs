import request from 'request-promise-native'
import { createReadStream } from 'fs'
import { resolve } from 'path'
import globby from 'globby'
import enquirer from 'enquirer'
import 'colors'

// tslint:disable:no-console

const uploadFile = async fpath => {
  console.log(`\n-> uploading ${fpath} ...`.cyan)
  const res = await request.post('https://fapi.aiads-dev.com/file/images', {
    formData: {
      images: createReadStream(fpath)
    }
  })
  const json = JSON.parse(res)
  const url = 'http:' + json.data.items[0].url
  console.log('     ' + url.green)
}

(async () => {
  const args = process.argv
  if (args.length > 2) {
    const patterns = args.slice(2)
    const list = await globby(patterns)
    const fullList = list.map(it => resolve(it))

    const choices = fullList.map(it => ({ name: it }))
    const prompt = new enquirer.MultiSelect({
      type: 'multiselect',
      message: '选择要上传的文件',
      hint: '(使用上下箭头切换选项，空格切换选择，回车确定)',
      choices,
      initial: choices,
    })
    const fileList = await prompt.run()

    for (const fpath of fileList) {
      await uploadFile(fpath)
    }
  } else {
    console.log(`yarn up <patterns>`)
  }
})()
