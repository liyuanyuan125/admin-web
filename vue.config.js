const path = require('path')

const resolve = dir => path.join(__dirname, 'src', dir)

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/mock/': {
        target: 'http://yapi.aiads.com/',
        changeOrigin: true,
      }
    }
  },

  chainWebpack: config => {
    config.resolve.alias
      .set('env$', process.env.NODE_ENV === 'production'
        ? resolve('util/env-prod.ts')
        : resolve('util/env-dev.ts'))
    config.performance.hints(false)
  }
}
