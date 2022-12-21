const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const PugPlugin = require('pug-plugin')

const env = process.NODE_ENV === 'production' ? 'production' : 'development'

// env: 'production'|'development'
exports.getWebpackConfig = (env) => ({
  entry: {
    app: './src/frontend/scripts/app.ts',
    post: './src/frontend/scripts/post.ts',
  },
  output: {
    filename: '[name].js',
    // path: path.join(
    //   __dirname,
    //   env === 'production' ? './build/public' : './src/public',
    // ),
  },

  mode: env,
  module: {
    rules: [
      {
        test: /.pug$/,
        loader: PugPlugin.loader,
      },
      {
        test: /.styl$/,
        use: ['css-loader', 'stylus-loader'],
      },
      {
        test: /.ts$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript'],
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: ['src/frontend/assets/demo.mov'],
    }),
  ],
  resolve: {
    extensions: ['.ts'],
  },
  watch: env === 'development',
  watchOptions: {
    ignored: ['**/node_modules/'],
  },
})

exports.default = this.getWebpackConfig(env)
