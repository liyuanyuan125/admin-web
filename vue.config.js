const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = dir => path.join(__dirname, 'src', dir)

module.exports = {
  devServer: {
    host: 'mdev.aiads-dev.com',
    disableHostCheck: true,
  },

  chainWebpack: config => {
    const isDev = process.env.NODE_ENV === 'development'
    // 开发|测试|仿真|生产：aiads-dev|qas|stg|prd
    ;[
      {
        env: 'dev',
        baseUrl: isDev ? '/' : '//admin.aiads-dev.com',
        ajaxBaseUrl: '//mapi.aiads-dev.com'
      },
      {
        env: 'qas',
        baseUrl: '//admin.whaledata.com',
        ajaxBaseUrl: '//mapi.whaledata.com'
      },
      {
        env: 'stg',
        baseUrl: '//admin.aiads-stg.com',
        ajaxBaseUrl: '//mapi.aiads-stg.com'
      },
      {
        env: 'prd',
        baseUrl: '//admin.jydata.com',
        ajaxBaseUrl: '//mapi.jydata.com'
      }
    ].forEach(it => {
      const { env } = it
      config.plugin(env === 'dev' ? 'html' : `html-${env}`).use(HtmlWebpackPlugin, [
        {
          template: 'public/index.html',
          filename: isDev && env === 'dev' ? 'index.html' : `index-aiads-${env}.html`,
          minify: {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
            removeAttributeQuotes: true
          },
          VAR: it
        }
      ])
    })

    config.performance.hints(false)
  }
}
