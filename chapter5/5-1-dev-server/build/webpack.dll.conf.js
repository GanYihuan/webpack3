const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: {
		vue: ['vue', 'vue-router'],
		ui: ['element-ui']
	},
	output: {
		path: path.join(__dirname, '../src/dll/'),
		filename: '[name].dell.js',
		library: '[name]'
	},
	optimization: {
		splitChunks: {
			name: 'vendor',
			chunks: 'initial',
			minChunks: 2,
			minSize: 30000
		}
	},
	plugins: [
		new webpack.DllPlugin({
			// manifest json 文件的绝对路径 (输出文件)
			path: path.join(__dirname, '../src/dll/', '[name]-bundle.js'),
			// 暴露出的 DLL 的函数名
			name: '[name]'
		})
	]
}
