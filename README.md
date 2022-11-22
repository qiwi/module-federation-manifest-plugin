# module-federation-manifest-plugin

Webpack plugin to generate manifest about module federation: shared, exposed, remote modules

### Install

```bash
yarn add -D @qiwi/module-federation-manifest-plugin
npm i -D @qiwi/module-federation-manifest-plugin
```

### Usage

Add plugin to webpack config. This plugin works together with `ModuleFederationPlugin`. In case of usage without it error will be raised

```typescript
import path from 'path'
import webpack from 'webpack'
import { ModuleFederationManifestPlugin } from '@qiwi/module-federation-manifest-plugin'

export const config: webpack.Configuration = {
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      /** Your options */
    }),
    new ModuleFederationManifestPlugin({
      filename: 'manifest.json',
    }),
  ],
}
```

### Manifest schema

You can find schema description [here](https://github.com/qiwi/module-federation-manifest-plugin/blob/main/src/main/ts/schema.ts) and real examples in [tests](https://github.com/qiwi/module-federation-manifest-plugin/blob/main/src/test/ts/e2e.spec.ts)
