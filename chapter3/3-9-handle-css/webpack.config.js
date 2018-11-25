const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js'
  },
  output: {
    /* return the absolute path of the current working directory. */
    path: path.resolve(__dirname, './dist'),
    /* dynamic load code path */
    // publicPath: './dist',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        /* Processe from the back to the front */
        use: [
          {
            /* Adds CSS to the DOM by injecting a <style> tag */
            loader: 'style-loader',
            /* Adds CSS to the DOM by injecting a <link/> tag */
            // loader: 'style-loader/url',
            /* wether use style-loader */
            // loader: 'style-loader/useable',
            options: {
              /* Reuses a single <style></style> element */
              singleton: true,
              /* load CSS by pase custom function */
              transform: './css.transform.js'
              /* <style></style> insert into dom */
              // insertInto: '#app',
              /* <style></style> insert at given position */
              // insertAt: '#app'
            }
          },
          {
            /* The css-loader interprets @import and url() like import/require() and will resolve them. */
            loader: 'css-loader',
            options: {
              /* number of loaders applied before CSS loader */
              // importLoader: 2,
              /* compress ? */
              minimize: true,
              /* enable css-modules ? */
              modules: true,
              /* 定义 css-modules 编译出来文件的名称 */
              localIdentName: '[path][name]_[local]_[hash:base64:5]'
            }
          },
          {
            /* put css-loader below */
            loader: 'less-loader'
          }
        ]
      }
    ]
  }
}
