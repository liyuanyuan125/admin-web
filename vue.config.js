const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = dir => path.join(__dirname, 'src', dir)

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/': {
        target: 'http://mapi.aiads-dev.com',
        changeOrigin: true,
        ws: false,
        bypass(req) {
          if (req.headers.accept.indexOf('html') !== -1) {
            return '/index.html'
          }
        },
        onProxyRes(proxy) {
          const cookies = proxy.headers['set-cookie']
          if (cookies) {
            const newCookies = cookies.map(it =>
              it.replace(/Domain=[^\s;]+;?/i, 'Domain=localhost;'))
            proxy.headers['set-cookie'] = newCookies
          }
        }
      }
    }
  },

  chainWebpack: config => {
    const isDev = process.env.NODE_ENV === 'development'
    // 开发|测试|仿真|生产：aiads-dev|qas|stg|prd
    ; [
      {
        env: 'dev',
        baseUrl: isDev ? '/' : '//admin.aiads-dev.com',
        ajaxBaseUrl: isDev ? '/' : '//mapi.aiads-dev.com',
      },
      {
        env: 'qas',
        baseUrl: '//admin.qas.aiads.com',
        ajaxBaseUrl: '//mapi.qas.aiads.com',
      },
      {
        env: 'stg',
        baseUrl: '//admin.stg.aiads.com',
        ajaxBaseUrl: '//mapi.stg.aiads.com',
      },
      {
        env: 'prd',
        baseUrl: '//admin.aiads.com',
        ajaxBaseUrl: '//mapi.aiads.com',
      },
    ].forEach(it => {
      const { env } = it
      config.plugin(env === 'dev' ? 'html' : `html-${env}`).use(HtmlWebpackPlugin, [{
        template: 'public/index.html',
        filename: isDev && env === 'dev'
          ? 'index.html'
          : `index-aiads-${env}.html`,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          removeAttributeQuotes: true,
        },
        VAR: it,
      }])
    })

    config.performance.hints(false)
  }
}
