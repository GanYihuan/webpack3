module.exports = {
	'/.+': {
		// 请求远端服务器
		target: 'https://m.weibo.cn',
		// 找到真实请求的地址
		changeOrigin: true,
		// 控制台信息
		logLevel: 'debug',
		// 重定向
		pathRewrite: {
			'^/comments': '/api/comments'
		}
	}
}
