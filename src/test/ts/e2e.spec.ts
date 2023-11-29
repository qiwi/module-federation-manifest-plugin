import { expect } from 'earljs'
import fs from 'node:fs'
import { test } from 'uvu'
import { ModuleFederationManifestPlugin } from '../../main/ts'
import { buildAndAssert, buildFixture, getManifestPath } from './helpers/build-and-assert'

test('multiple package versions', async (t) => {
  await buildAndAssert(t, 'multiple-package-versions', {
    name: 'container',
    publicPath: 'auto',
    provides: {
      react: [
        { version: '1.0.0', shareScope: 'default' },
        { version: '1.2.0', shareScope: 'default' },
      ],
    },
    consumes: {
      react: [
        { version: '^1.0.0', shareScope: 'default', singleton: false, strictVersion: true, eager: false },
        { version: '^1.2.0', shareScope: 'default', singleton: false, strictVersion: true, eager: false },
      ],
    },
  })
})

test('multiple package with same versions', async (t) => {
  await buildAndAssert(t, 'multiple-package-same-versions', {
    name: 'container',
    publicPath: 'auto',
    provides: {
      react: [
        { version: '1.0.0', shareScope: 'default' },
        { version: '1.0.0', shareScope: 'default' },
      ],
    },
    consumes: {
      react: [
        { version: '^1.0.0', shareScope: 'default', singleton: false, strictVersion: true, eager: false },
        { version: '=1.0.0', shareScope: 'default', singleton: false, strictVersion: true, eager: false },
      ],
    },
  })
})

test('shared kitchensink', async (t) => {
  await buildAndAssert(t, 'shared-kitchensink', {
    name: 'container',
    publicPath: 'auto',
    provides: {
      a: [{ version: '1.0.0', shareScope: 'default' }],
      b: [{ version: '6.0.0', shareScope: 'default' }],
      c: [{ version: '1.0.0', shareScope: 'test-scope' }],
      'test-key': [{ version: '1.0.0', shareScope: 'test-scope' }],
      e: [{ version: '1.0.0', shareScope: 'default' }],
      f: [{ version: '1.0.0', shareScope: 'default' }],
    },
    consumes: {
      a: [{ version: '^1.0.0', shareScope: 'default', singleton: true, strictVersion: false, eager: false }],
      b: [{ version: '^6.0.0', shareScope: 'default', singleton: false, strictVersion: true, eager: false }],
      c: [{ version: '^1.0.0', shareScope: 'test-scope', singleton: false, strictVersion: true, eager: false }],
      'test-key': [
        { version: '^1.0.0', shareScope: 'test-scope', singleton: false, strictVersion: true, eager: false },
      ],
      e: [{ version: '=1.0.0', shareScope: 'default', singleton: false, strictVersion: false, eager: false }],
      f: [{ version: '=1.0.0', shareScope: 'default', singleton: true, strictVersion: true, eager: false }],
    },
  })
})

test('remotes and exposed kitchensink', async (t) => {
  await buildAndAssert(t, 'remotes-and-exposed-kitchensink', {
    name: 'container',
    publicPath: 'auto',
    entry: {
      path: 'entry.js',
    },
    exposes: {
      a: {
        name: 'custom-name',
      },
      b: {},
      c2: {},
    },
    remotes: {
      remote1: {
        modules: ['app'],
      },
      remote2: {
        modules: ['helpers', 'app'],
      },
    },
  })
})

test('should not emit when filename is empty', async () => {
  const fixtureName = 'real-world'

  await buildFixture('real-world', (config) => {
    const cfgCopy = { ...config }
    cfgCopy.plugins = cfgCopy.plugins!.filter((plugin) => plugin.constructor.name !== 'ModuleFederationManifestPlugin')
    cfgCopy.plugins.push(new ModuleFederationManifestPlugin({}))
    return cfgCopy
  })
  const manifestPath = getManifestPath(fixtureName)

  expect(fs.existsSync(manifestPath)).toEqual(false)
})

test.run()
