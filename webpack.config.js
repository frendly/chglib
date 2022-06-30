const path = require("path");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  return {
    // watch: isProduction ? false : true,
    watch: false,
    target: ["web"],
    entry: {
      index: [
        "./src/assets/js/index.js",
        "./src/assets/styles/index.scss",
      ],
    },
    output: {
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      path: path.resolve(__dirname, 'dist/assets'),
    },
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: "css-loader" },
            { loader: "sass-loader" }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.ya?ml$/,
          type: 'json',
          use: 'yaml-loader'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new WebpackManifestPlugin({ publicPath: "/assets/" }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css',
      }),
    ],
  };
};
