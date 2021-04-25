const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
  target: ["web"],
  entry: {
    index: [
      "./src/assets/js/index.js",
      "./src/assets/styles/index.scss",
    ],
  },
  output: {
    filename: '[name].js',
    // filename: "[name].js",
    // chunkFilename: "[name].js",
    // chunkLoading: false,
    // publicPath: "/assets",
    path: path.resolve(__dirname, 'dist/assets'),
  },

  mode: 'production',

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          enforce: true
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
            /* // for development mode
            {
                loader: "style-loader",
                options: {
                    singleton: true
                }
            },
            */
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    // publicPath: './static',
                    // minimize: true
                }
            },
            { loader: "css-loader" },
            { loader: "sass-loader" }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", { modules: false }]
            ]
          }
        }
      }
    ]
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new WebpackManifestPlugin({ publicPath: "/assets/" }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
