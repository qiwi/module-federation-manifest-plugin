import type { ModuleFederationManifestPluginHooks } from './hooks'
import type { ModuleFederationManifest } from './schema'

import { AsyncSeriesHook } from 'tapable'
import webpack, { type Chunk, type Module } from 'webpack'

import {
  consumedModuleParser,
  exposedModuleParser,
  providedModuleParser,
  remoteModuleParser,
} from './identifier-parsers'

type ModuleFederationPluginOptions = ConstructorParameters<typeof webpack.container.ModuleFederationPlugin>[0]

export interface ModuleFederationManifestPluginOptions {
  filename?: string
}

const undefinedOrNotEmptyObject = <T extends {}>(obj: T): T | undefined => {
  return Object.keys(obj).length ? obj : undefined
}

const compilationHooks = new WeakMap<webpack.Compilation, ModuleFederationManifestPluginHooks>()

export class ModuleFederationManifestPlugin {
  private federationPluginOptions!: ModuleFederationPluginOptions

  constructor(private options: ModuleFederationManifestPluginOptions) {}

  apply(compiler: webpack.Compiler) {
    const pluginName = this.constructor.name
    const federationPlugin = compiler.options.plugins.find(
      (plugin) => plugin?.constructor.name === 'ModuleFederationPlugin',
    ) as
      | (webpack.container.ModuleFederationPlugin & {
          _options: ModuleFederationManifestPluginOptions
        })
      | undefined

    if (!federationPlugin) {
      throw new Error('Module Federation Manifest Plugin cannot be used without Module Federation plugin')
    }

    this.federationPluginOptions = { ...federationPlugin._options }

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        async () => await this.processWebpackAssets(compilation),
      )
    })
  }

  static getHooks(compilation: webpack.Compilation): ModuleFederationManifestPluginHooks {
    let hooks = compilationHooks.get(compilation)
    if (!hooks) {
      hooks = {
        onManifestCreated: new AsyncSeriesHook(['manifest']),
      }
      compilationHooks.set(compilation, hooks)
    }

    return hooks
  }

  private createManifest(
    publicPath: string,
    entryChunk: Chunk | undefined,
    modules: Set<Module>,
  ): ModuleFederationManifest {
    const entry: ModuleFederationManifest['entry'] = entryChunk?.files && {
      path: Array.from(entryChunk.files)[0],
    }

    const remotes: ModuleFederationManifest['remotes'] = {}
    const consumes: ModuleFederationManifest['consumes'] = {}
    const provides: ModuleFederationManifest['provides'] = {}
    const exposes: ModuleFederationManifest['exposes'] = {}

    for (const module of Array.from(modules)) {
      const identifier = module.identifier()

      if (!identifier) {
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
      publicPath,
      entry,
      exposes: undefinedOrNotEmptyObject(exposes),
      provides: undefinedOrNotEmptyObject(provides),
      consumes: undefinedOrNotEmptyObject(consumes),
      remotes: undefinedOrNotEmptyObject(remotes),
    }
  }

  private emitManifestAsset(compilation: webpack.Compilation, manifest: ModuleFederationManifest) {
    if (!this.options.filename) {
      return
    }

    const source = new webpack.sources.RawSource(JSON.stringify(manifest))
    compilation.emitAsset(this.options.filename, source)
  }

  private async processWebpackAssets(compilation: webpack.Compilation): Promise<void> {
    const manifest = this.createManifest(
      compilation.outputOptions.publicPath as string,
      this.getRemoteEntryChunk(compilation.chunks),
      compilation.modules,
    )

    await ModuleFederationManifestPlugin.getHooks(compilation).onManifestCreated.promise(manifest)

    this.emitManifestAsset(compilation, manifest)
  }

  private getRemoteEntryChunk(chunks: Set<Chunk>): Chunk | undefined {
    return Array.from(chunks).find((chunk) => chunk.name === this.federationPluginOptions.name)
  }
}
