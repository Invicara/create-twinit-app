

import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserJSPlugin from 'terser-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)
const resolve = fname => require.resolve(fname)


const CONFIG = {
  entry: ['regenerator-runtime/runtime', './app/client/index.jsx'],
  output: {
    filename: 'index.[chunkhash:8].js',
    sourceMapFilename: 'index.[chunkhash:8].js.map',
    //path - build is required by DevOps to have subfolder and be named APP_ROOT
    path: path.resolve(__dirname, 'build'),
    //publicPath - every url that begins with "/APP_ROOT/" will be searched for under 'build/APP_ROOT'
    publicPath: '', // (absolute path, or relative to main HTML file)
    clean: true,
    assetModuleFilename: '[name][contenthash][ext]'
  },
  devServer: {
    hoy: true
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          keep_fnames: true
        }
      })
    ],
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/public/index.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: 'app/public/config.js', to: 'config.js'},
        {from: 'app/public/version.js', to: 'version.js'},
        {from: 'app/public/helpers.js', to: 'helpers.js'},
        {from: 'app/public/fontawesome.css', to: 'fontawesome.css'},
        {from: 'app/public/webfonts', to: 'webfonts/', toType: 'dir'},
        {from: 'IpaFonts', to: 'fonts/', context: 'node_modules/@invicara/ipa-core/modules/'},
        {from: 'IpaIcons', to: 'fonts/', context: 'node_modules/@invicara/ipa-core/modules/'},
        {from: 'app/public/icons/logo_32px.png', to: 'logo_32px.png'},
        {from: 'app/public/icons/logo.png', to: 'logo.png'},
        {from: 'app/public/icons/assets.png', to: 'assets.png'},
        {from: 'app/public/icons/navigator.png', to: 'navigator.png'},
        {from: 'app/public/icons/spaces.png', to: 'spaces.png'},
        {from: 'app/public/icons/docs.png', to: 'docs.png'},
        {from: 'app/public/icons', to: 'icons'},
        {from: 'app/public/icons/simple_navigator.png', to: 'simple_navigator.png'},
        {from: 'app/public/icons/simple_buildingPerformance.png', to: 'simple_buildingPerformance.png'},
        {from: 'app/public/icons/simple_comfortWellness.png', to: 'simple_comfortWellness.png'},
        {from: 'app/public/icons/simple_files.png', to: 'simple_files.png'},
        {from: 'app/public/icons/simple_smartBuilding.png', to: 'simple_smartBuilding.png'},
        {from: 'app/public/icons/simple_spaces.png', to: 'simple_spaces.png'},
        {from: 'app/public/icons/simple_assets.png', to: 'simple_assets.png'},
      ]
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    })
  ],

  module: {
    rules: [
       {
         exclude: [
           /\.html$/,
           /\.(m?js|jsx)$/,
           /\.css$/,
           /\.scss$/,
           /\.less$/,
           /\.json$/,
           /\.bmp$/,
           /\.gif$/,
           /\.jpe?g$/,
           /\.png$/,
           /\.(glsl|vs|fs)$/
         ],
         type: 'asset/resource'
       },
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: { fullySpecified: false }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'app'),
        use: ['babel-loader'],
        resolve: { fullySpecified: false }
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        type: 'asset'
      },
      {
        test: /\.(scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.(css)$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
    alias: {
      '@dtplatform/platform-api': path.resolve(__dirname, './node_modules/@dtplatform/platform-api/dist/esm/platform-api.js'),
    },
    fallback: {
      fs: false,
      stream: resolve('stream-browserify'),
      crypto: resolve('crypto-browserify'),
      path: resolve('path-browserify'),
      assert: resolve('assert'),
      os: resolve('os-browserify/browser'),
      buffer: resolve('buffer'),
      querystring: resolve('querystring-es3'),
      events: resolve('events'),
      'process/browser': resolve('process/browser'),
      "constants": resolve("constants-browserify"),
      "url": resolve("url/"),
      "https": resolve("https-browserify"),
      "http": resolve("stream-http"),
      "vm": require.resolve("vm-browserify")
    }
  },
  node: {
    global: true
  }
}

export default CONFIG