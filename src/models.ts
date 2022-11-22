import type webpack from 'webpack'

export type ModuleFederationPluginOptions = ConstructorParameters<typeof webpack.container.ModuleFederationPlugin>[0]

export interface ModuleFederationManifestPluginOptions {
  filename: string
  version: string
}
