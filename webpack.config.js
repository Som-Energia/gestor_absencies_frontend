const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
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
		filename: devMode ? '[name].css' : '[name].[hash].css',
		chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
	})	
  ],  
  devServer: {
    contentBase: './dist',
    port: 9000
  }  
};
