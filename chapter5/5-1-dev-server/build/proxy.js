module.exports = {
  '/.+': {
    target: 'https://m.weibo.cn',
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/comments': '/api/comments'
    },
    headers: {
      'Cookie': ''
    }
  }
}
