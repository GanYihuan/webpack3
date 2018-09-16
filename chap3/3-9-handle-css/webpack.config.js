var path = require('path')

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.js'
	},
	output: {
		/* 输出到指定目录下 */
		path: path.resolve(__dirname, 'dist'),
		/* 引入资源路径 */
		// publicPath: './dist/',
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				/* 从后往前处理 */
				use: [
					{
						/* 在最后生成的 js 文件中进行处理，动态创建 style 标签，塞到 head 标签里 */
						loader: 'style-loader',
						/* 小众功能: style-loader 使其插入 link 标签, 不能处理多个样式 */
						// loader: 'style-loader/url',
						/* app.js 额外增加 use(), unuse() 方法, 控制样式是否插入页面中 */
						// loader: 'style-loader/useable'
						options: {
							/* insertAt(插入位置) */
							/* insertInto(插入到 dom) */
							/* insertInto: '#app', */
							/* singleton (是否只使用一个 style 标签) */
							singleton: true,
							/* transform 在 style-loader 塞 style 标签时执行, css 加载前提前判断浏览器 */
							transform: './css.transform.js'
						}
					},
					{
						/* 打包时把css文件拆出来，css 相关模块最终打包到一个指定的 css 文件中，我们手动用link标签去引入这个 css 文件就可以了 */
						loader: 'css-loader',
						/* 小众功能: style-loader 使其插入 link 标签, 不能处理多个样式 */
						// loader: 'file-loader'
						options: {
							/* 解析的别名 */
							// alias
							/* @import */
							// importLoader
							/* 是否压缩 */
							minimize: true,
							/* 启用 css-modules */
							modules: true,
							/* 定义编译出来的名称 */
							localIdentName: '[path][name]_[local]_[hash:base64:5]'
						}
					},
					{
						/* 放置 css-loader 下面 */
						loader: 'sass-loader'
					},
					{
						/* 放置 css-loader 下面 */
						loader: 'less-loader'
					}
				]
			}
		]
	}
}
