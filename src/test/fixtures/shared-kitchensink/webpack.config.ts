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
    filename: '[name].[contenthash].js',
    clean: true,
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name: 'container',
      filename: 'entry.js',
      shared: {
        a: {
          requiredVersion: '^1.0.0',
          singleton: true,
        },
        b: {
          requiredVersion: '^6.0.0',
          version: '6.0.0',
        },
        c: {
          shareScope: 'test-scope',
        },
        d: {
          shareKey: 'test-key',
          shareScope: 'test-scope',
        },
        e: {
          requiredVersion: '1.0.0',
          strictVersion: false,
        },
        f: {
          requiredVersion: '1.0.0',
          strictVersion: true,
          singleton: true,
        },
      },
    }),
    new ModuleFederationManifestPlugin({
      filename: 'manifest.json',
    }),
  ],
}
