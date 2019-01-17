// const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PurifyCss = require('purifycss-webpack')
const HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const glob = require('glob-all')
const path = require('path')
// const env = require('../config.prod.env')

module.exports = {
  optimization: {
    splitChunks: {
      name: 'manifest'
    }
  },
  plugins: [
    // new webpack.NamedChunksPlugin(),
    // new webpack.NamedModulesPlugin(),
    new PurifyCss({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    // new UglifyJsPlugin(),
    // 优化打包速度
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: false,
      parallel: true,
      cache: true
    }),
    new HtmlInlineChunkPlugin({
      inlineChunks: ['manifest']
    }),
    new CleanWebpackPlugin(['dist'])
    // new Happypack({
    //   id: 'vue',
    //   loaders: [
    //     {
    //       laoder: 'eslint-laoder',
    //       option: require('./eslint-loader.conf')
    //     }
    //   ]
    // }),
    // new webpack.DellReferencePlugin({
    //    manifest: require('../src/dll/ui-mannifest.json')
    // }),
    // new webpack.DellReferencePlugin({
    //    manifest: require('../src/dll/vue-manifest.json')
    // }),
    // new webpack.DefinePlugin({
    //   'process.env': env
    // })
  ]
}
