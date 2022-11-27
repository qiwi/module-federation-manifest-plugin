# module-federation-manifest-plugin

[![CI](https://github.com/qiwi/module-federation-manifest-plugin/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/qiwi/module-federation-manifest-plugin/actions/workflows/ci.yaml)
[![Maintainability](https://api.codeclimate.com/v1/badges/b393ef93cb69397b2738/maintainability)](https://codeclimate.com/github/qiwi/module-federation-manifest-plugin/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b393ef93cb69397b2738/test_coverage)](https://codeclimate.com/github/qiwi/module-federation-manifest-plugin/test_coverage)
[![npm (tag)](https://img.shields.io/npm/v/@qiwi/module-federation-manifest-plugin/latest.svg)](https://www.npmjs.com/package/@qiwi/module-federation-manifest-plugin)

> Webpack plugin to generate manifest about module federation: shared, exposed, remote modules

### Install

```bash
yarn add -D @qiwi/module-federation-manifest-plugin
npm i -D @qiwi/module-federation-manifest-plugin
```

### Usage

Add plugin to webpack config. This plugin works together with `ModuleFederationPlugin`. In case of usage without it error will be raised

```typescript
import webpack from 'webpack'
import path from 'path'
import { ModuleFederationManifestPlugin } from '@qiwi/module-federation-manifest-plugin'

export const config: webpack.Configuration = {
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      /** Your options here */
    }),
    new ModuleFederationManifestPlugin({
      filename: 'manifest.json',
    }),
  ],
}
```

## Manifest schema

You can find schema description [here](https://github.com/qiwi/module-federation-manifest-plugin/blob/main/src/main/ts/schema.ts) and real examples in [tests](https://github.com/qiwi/module-federation-manifest-plugin/blob/main/src/test/ts/e2e.spec.ts)

## API

### Hooks

#### onManifestCreated

Invokes after manifest created, but not emitted

```javascript
compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
  ModuleFederationManifestPlugin.getHooks(compilation).onManifestCreated.tap('MyPlugin', (manifest) => {
    console.log(manifest)
  })
})
```

## License

[MIT](./LICENSE)
