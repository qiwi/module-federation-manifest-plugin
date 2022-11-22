import path from 'path'
import webpack from 'webpack'
import { ModuleFederationManifestPlugin } from '../../../src'

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
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name: 'container',
      filename: 'entry.js',
      shareScope: 'test',
      remotes: {
        remote1: `remote1@http://localhost:4000/remoteEntry.js`,
        remote2: `remote2@http://localhost:5000/remoteEntry.js`,
        remote3: `remote3@http://localhost:5000/remoteEntry.js`,
      },
      exposes: {
        a: {
          import: path.join(__dirname, './a.js'),
          name: 'custom-name',
        },
        b: path.join(__dirname, './b.js'),
        c2: {
          import: path.join(__dirname, './c.js'),
        },
      },
    }),
    new ModuleFederationManifestPlugin({
      filename: 'manifest.json',
      version: 'test',
    }),
  ],
}
