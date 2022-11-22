import path from 'path'
import webpack from 'webpack'
import { ModuleFederationManifestPlugin } from '../../../main/ts'

export const config: webpack.Configuration = {
  stats: 'normal',
  devtool: false,
  entry: path.join(__dirname, 'index.js'),
  optimization: {
    minimize: false,
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name: 'container',
      filename: 'entry.js',
      shared: {
        react: {},
      },
    }),
    new ModuleFederationManifestPlugin({
      filename: 'manifest.json',
    }),
  ],
}
