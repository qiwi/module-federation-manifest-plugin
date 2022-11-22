import type { ModuleFederationManifest } from './schema'

import webpack from 'webpack'

import {
  exposedModuleParser,
  remoteModuleParser,
  consumedModuleParser,
  providedModuleParser,
} from './identifier-parsers'

type ModuleFederationPluginOptions = ConstructorParameters<typeof webpack.container.ModuleFederationPlugin>[0]

export interface ModuleFederationManifestPluginOptions {
  filename: string
  version: string
}

const undefinedOrNotEmptyObject = <T extends {}>(obj: T): T | undefined => {
  return Object.keys(obj).length ? obj : undefined
}

const PLUGIN_NAME = 'ModuleFederationManifest'

export class ModuleFederationManifestPlugin {
  private federationPluginOptions!: ModuleFederationPluginOptions

  constructor(private options: ModuleFederationManifestPluginOptions) {}

  apply(compiler: webpack.Compiler) {
    const federationPlugin = compiler.options.plugins.find(
      (plugin) => plugin.constructor.name === 'ModuleFederationPlugin',
    ) as
      | (webpack.container.ModuleFederationPlugin & {
          _options: ModuleFederationManifestPluginOptions
        })
      | undefined

    if (federationPlugin) {
      this.federationPluginOptions = { ...federationPlugin._options }
    } else {
      throw new Error('Module Federation Manifest Plugin cannot be used without Module Federation plugin')
    }

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: PLUGIN_NAME,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        async () => this.processWebpackAssets(compilation),
      )
    })
  }

  private createManifest(
    publicPath: string,
    entryChunk: webpack.StatsChunk | undefined,
    modules: webpack.StatsModule[],
  ): ModuleFederationManifest {
    const entry: ModuleFederationManifest['entry'] =
      entryChunk && entryChunk.files
        ? {
            path: entryChunk.files[0],
          }
        : undefined

    const remotes: ModuleFederationManifest['remotes'] = {}
    const consumes: ModuleFederationManifest['consumes'] = {}
    const provides: ModuleFederationManifest['provides'] = {}
    const exposes: ModuleFederationManifest['exposes'] = {}

    for (const module of modules) {
      const { identifier } = module

      if (!identifier) {
        // Actually I don't know cases when identifier is not specified
        // According to webpack sources all types that we need always have it
        // Let's warn about it to obtain information from real cases
        // I think all these warnings will be false positive
        console.log("WARN: Can't get module.identifier")
        console.log('WARN: Please report about it')
        console.log('WARN: Provide source code and info below:')
        console.log(module)
        continue
      }

      if (exposedModuleParser.canActive(identifier)) {
        const modules = exposedModuleParser.parse(identifier)
        modules.forEach((module) => {
          exposes[module.request] = {
            name: module.name,
          }
        })
        continue
      }

      if (remoteModuleParser.canActive(identifier)) {
        const { remoteName, moduleName } = remoteModuleParser.parse(identifier)
        remotes[remoteName] = remotes[remoteName] || {
          modules: [],
        }
        remotes[remoteName].modules.push(moduleName)
        continue
      }

      if (consumedModuleParser.canActive(identifier)) {
        const { name, version, shareScope, singleton, eager, strictVersion } = consumedModuleParser.parse(identifier)
        consumes[name] = consumes[name] || []
        consumes[name].push({ version, shareScope, singleton, eager, strictVersion })
        continue
      }

      if (providedModuleParser.canActive(identifier)) {
        const { name, version, shareScope } = providedModuleParser.parse(identifier)
        provides[name] = provides[name] || []
        provides[name].push({ version, shareScope })
        continue
      }
    }

    return {
      name: this.federationPluginOptions.name as string,
      version: this.options.version,
      publicPath,
      entry,
      exposes: undefinedOrNotEmptyObject(exposes),
      provides: undefinedOrNotEmptyObject(provides),
      consumes: undefinedOrNotEmptyObject(consumes),
      remotes: undefinedOrNotEmptyObject(remotes),
    }
  }

  private emitManifestAsset(compilation: webpack.Compilation, manifest: ModuleFederationManifest) {
    const manifestJson = JSON.stringify(manifest)
    const source = new webpack.sources.RawSource(Buffer.from(manifestJson))
    compilation.emitAsset(this.options.filename, source)
  }

  private async processWebpackAssets(compilation: webpack.Compilation): Promise<void> {
    const liveStats = compilation.getStats()
    const stats = liveStats.toJson()

    const remoteEntryChunk = this.getRemoteEntryChunk(stats)

    const manifest = this.createManifest(stats.publicPath as string, remoteEntryChunk, stats.modules || [])

    this.emitManifestAsset(compilation, manifest)
  }

  private getRemoteEntryChunk(stats: webpack.StatsCompilation) {
    return stats.chunks?.find((chunk) => chunk.names?.find((name) => name === this.federationPluginOptions.name))
  }
}
