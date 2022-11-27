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
        react: {
          requiredVersion: '^17.0.2',
        },
        'react-dom': {
          requiredVersion: '^17.0.2',
        },
      },
      exposes: {
        export: path.join(__dirname, './export.js'),
      },
      remotes: {
        remote1: `remote1@http://localhost:4000/remoteEntry.js`,
      },
    }),
    new ModuleFederationManifestPlugin({
      filename: 'manifest.json',
    }),
  ],
}
