import loadScript from '@/fn/loadScript'
import checkRun from '@/fn/checkRun'

// doc: http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html

const KEY = VAR.env == 'dev' ? 'CChbilBUxL7gfec9fUfmj95CrOExu5DG' : ''

const loaded = () => 'BMap' in window

export async function load() {
  if (!loaded()) {
    const url = location.protocol + `//api.map.baidu.com/getscript?v=3.0&ak=${KEY}`
    await loadScript(url)
    await checkRun(loaded)
  }

  return BMap
}
