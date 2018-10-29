module.exports = {
	mode: 'production',
	entry: {
		app: './app.js'
	},
	output: {
		filename: '[name].[hash:5].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							/* Specification summary */
							presets: [
								[
									'@babel/preset-env',
									{
										targets: {
											/* Designation Node.js version */
											node: 'current',
											browsers: ['> 1%', 'last 2 versions']
										}
									}
								]
							]
						}
					}
				],
				exclude: '/node_modules/'
			}
		]
	}
}
