const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const api_urls = {
    production: 'https://gestor-absencies.somenergia.coop',
    testing: 'https://gestorabsencies-demo.somenergia.local',
    development: 'http://localhost:8000',
};

module.exports = (env, argv) => {

  const mode = argv.mode || 'testing';
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
         test: /\.js$/,
         loader: 'babel-loader',
         exclude: /node_modules/,
         query: {
             presets: ['es2015']
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
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 6,
          warnings: false,
        },
      }),
    ],
  },  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
  	}),
  	new MiniCssExtractPlugin({
  		filename: '[name].[hash].css',
  		chunkFilename: 'chunk-[name].[hash].css',
  	}),
    new webpack.EnvironmentPlugin({
      APIBASE: api_urls[mode],
    }),
  ],
}
};
