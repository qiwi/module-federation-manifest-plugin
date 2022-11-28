import { ModuleFederationManifestPlugin, ModuleFederationManifest } from '../../main/ts'
import { test } from 'uvu'
import type webpack from 'webpack'
import { buildFixture } from './helpers/build-and-assert'
import { expect, mockFn } from 'earljs'

test('should call onManifestCreated hook with manifest as argument', async () => {
  const onManifestCreatedCallback = mockFn<(manifest: ModuleFederationManifest) => any>()
  onManifestCreatedCallback.resolvesToOnce(undefined)

  const testPlugin = {
    apply: function (compiler: webpack.Compiler) {
      compiler.hooks.compilation.tap('TestPlugin', (compilation) => {
        ModuleFederationManifestPlugin.getHooks(compilation).onManifestCreated.tap(
          'TestPlugin',
          onManifestCreatedCallback,
        )
      })
    },
  }

  await buildFixture('real-world', (config) => {
    const cfgCopy = { ...config }
    cfgCopy.plugins = cfgCopy.plugins || []
    cfgCopy.plugins.push(testPlugin)
    return config
  })

  expect(onManifestCreatedCallback).toHaveBeenCalledExactlyWith([
    [
      {
        name: 'container',
        publicPath: 'auto',
        entry: {
          path: 'entry.js',
        },
        exposes: {
          export: {
            name: undefined,
          },
        },
        provides: {
          react: [{ version: '17.0.2', shareScope: 'default' }],
          'react-dom': [{ version: '17.0.2', shareScope: 'default' }],
        },
        remotes: {
          remote1: {
            modules: ['app'],
          },
        },
        consumes: {
          react: [{ version: '^17.0.2', shareScope: 'default', singleton: false, strictVersion: true, eager: false }],
          'react-dom': [
            { version: '^17.0.2', shareScope: 'default', singleton: false, strictVersion: true, eager: false },
          ],
        },
      },
    ],
  ])
})

test.run()
