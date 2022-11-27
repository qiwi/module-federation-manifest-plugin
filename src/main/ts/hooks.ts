import type { ModuleFederationManifest } from './schema'
import type tapable from 'tapable'

export interface Hooks {
  onManifestCreated: tapable.AsyncSeriesHook<[ModuleFederationManifest]>
}
