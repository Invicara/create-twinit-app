

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
    hot: true,
  },
  mode: 'development',
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
        {from: 'node_modules/@dtplatform/iaf-viewer/dist/lib/', to: 'lib/', toType: 'dir'},
        {from: 'IpaFonts', to: 'fonts/', context: 'node_modules/@invicara/ipa-core/modules/'},
        {from: 'IpaIcons', to: 'fonts/', context: 'node_modules/@invicara/ipa-core/modules/'},
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
         type: 'asset/resource',
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
      // react: path.resolve('./node_modules/react'), // This was to prevent the error of more than one copy of React coming through
      '@dtplatform/platform-api': path.resolve(__dirname, './node_modules/@dtplatform/platform-api/dist/esm/platform-api.js')
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
      constants: resolve("constants-browserify"),
      "url": resolve("url/"),
      "https": resolve("https-browserify"),
      "http": resolve("stream-http"),
      "vm": require.resolve("vm-browserify"),
      "zlib": require.resolve("browserify-zlib")
    },
  },
  node: {
    global: true
  }
}

export default CONFIG