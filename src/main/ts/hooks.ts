import type tapable from 'tapable'
import type { ModuleFederationManifest } from './schema'

export interface ModuleFederationManifestPluginHooks {
  onManifestCreated: tapable.AsyncSeriesHook<[ModuleFederationManifest]>
}
