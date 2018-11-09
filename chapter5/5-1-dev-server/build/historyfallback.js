module.exports = {
	// 需要什么类型的文件头
	htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
	rewrites: [
		{
			from: /^\/([a-zA-Z0-9]+\/?)([a-zA-Z0-9]+)/,
			to: function(context) {
				return '/' + context.match[1] + context.match[2]
			}
		}
	]
}
