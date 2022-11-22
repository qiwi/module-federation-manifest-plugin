import test from 'ava'
import { buildAndAssert } from './helpers/build-and-assert'

test('multiple package versions', async (t) => {
  await buildAndAssert(t, 'multiple-package-versions', {
    schemaVersion: '1',
    name: 'container',
    version: 'test',
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
    schemaVersion: '1',
    name: 'container',
    version: 'test',
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
    schemaVersion: '1',
    name: 'container',
    version: 'test',
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
        modules: ['app', 'helpers'],
      },
    },
    schemaVersion: '1',
    version: 'test',
  })
})
