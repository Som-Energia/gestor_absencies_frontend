const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

const mode = process.env.WEBPACK_MODE;
const devMode = mode !== 'production';

const api_urls = {
    production: 'https://gestorabsencies-demo.somenergia.local:8000',
    testing: 'https://gestorabsencies-demo.somenergia.local:8000',
    development: 'http://localhost:8000',
};

module.exports = (env, argv) => {
  
  return {
  entry: './src/main.js',
  output: {
    filename: 'bundle-[name]-[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'chunk-[name]-[chunkhash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        exclude: /node_modules/,
        use: {
          loader: 'html-loader',
          options: {minimize: true}
        }
	  },
	  {
		test: /\.(scss|sass|css)$/,
		//exclude: /node_modules/,
		loaders: [
		  MiniCssExtractPlugin.loader,
		  {
      loader: 'css-loader'  
		  }
      ,'sass-loader',
		]
	  },
    {
    test: /\.styl$/,
    //exclude: /node_modules/,
    loaders: [
      MiniCssExtractPlugin.loader,
      {
      loader: 'css-loader'  
      }
      ,'stylus-loader',
    ]
    },
	  {
		  test: /\.svg$/,
		  loader: "file-loader?prefix=font/"
	  }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
	}),
	new MiniCssExtractPlugin({
		filename: '[name].[hash].css',
		chunkFilename: '[id].[hash].css',
	}),
  new webpack.EnvironmentPlugin({
    APIBASE: api_urls[argv.mode],
  })
  ],
}
};
