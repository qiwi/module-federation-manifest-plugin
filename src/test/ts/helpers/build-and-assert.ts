import webpack from 'webpack'
import { expect } from 'earljs'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Context, uvu } from 'uvu'

const runCompilerAsync = (compiler: webpack.Compiler): Promise<webpack.Stats> => {
  return new Promise((resolve, reject) => {
    compiler.run((err, result) => {
      if (err) reject(err)
      resolve(result as webpack.Stats)
    })
  })
}

const fixturesDir = path.join(__dirname, '../..', 'fixtures')

const getManifest = async (fixtureName: string): Promise<unknown> => {
  return await fs
    .readFile(path.join(fixturesDir, fixtureName, 'build', 'manifest.json'), 'utf-8')
    .then((value) => JSON.parse(value))
}

export const buildFixture = async (
  fixtureName: string,
  configTransformer: (config: webpack.Configuration) => webpack.Configuration = (cfg) => cfg,
): Promise<webpack.Stats> => {
  let { config } = require(path.join(fixturesDir, fixtureName, 'webpack.config.ts'))
  config = configTransformer(config)

  const compiler = webpack(config)
  const stats = await runCompilerAsync(compiler)

  if (stats.hasErrors()) {
    console.error('Error during build')
    console.error(stats.toJson({ errors: true }).errors?.map((error) => error))
    throw new Error('Error during build')
  }

  return stats
}

export const buildAndAssert = async (t: Context & uvu.Crumbs, fixtureName: string, expected: any): Promise<void> => {
  await buildFixture(fixtureName)
  const manifest = await getManifest(fixtureName)
  expect(manifest).toEqual(expected)
}
