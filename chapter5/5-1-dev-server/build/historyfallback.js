module.exports = {
  // 指定文件类型, 匹配了才重定向
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
  rewrites: [
    {
      from: /^\/([a-zA-Z0-9]+\/?)([a-zA-Z0-9]+)/,
      to: function (context) {
        return '/' + context.match[1] + context.match[2]
      }
    }
  ]
}
