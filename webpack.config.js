module.exports = {
	entry: {
		app: './src/app.js',
		vendor: './src/index.js'
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /.less$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							singleton: true,
							transform: './css.transform.js'
						}
					},
					{
						loader: 'css-loader',
						options: {}
					}
				]
      }
		]
	},
	output: {
		filename: '[name],bundle.js',
		path: path.resolve(__dirname, 'dist')
  },
}
