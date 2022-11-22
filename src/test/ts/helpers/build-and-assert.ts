import webpack from 'webpack'
import { expect } from 'earljs'

const runCompilerAsync = (compiler: webpack.Compiler): Promise<webpack.Stats> => {
  return new Promise((resolve, reject) => {
    compiler.run((err, result) => {
      if (err) reject(err)
      resolve(result as webpack.Stats)
    })
  })
}

import fs from 'node:fs/promises'
import path from 'path'
import type { Context, uvu } from 'uvu'

const fixturesDir = path.join(__dirname, '../..', 'fixtures')

const getManifest = async (fixtureName: string): Promise<unknown> => {
  return await fs
    .readFile(path.join(fixturesDir, fixtureName, 'build', 'manifest.json'), 'utf-8')
    .then((value) => JSON.parse(value))
}

const buildFixture = async (fixtureName: string): Promise<webpack.Stats> => {
  const { config } = require(path.join(fixturesDir, fixtureName, 'webpack.config.ts'))
  const compiler = webpack(config)
  const stats = await runCompilerAsync(compiler)

  if (stats.hasErrors()) {
    console.error('Error during build')
    console.error(stats.toJson({ errors: true }).errors?.map((error) => error))
    throw new Error('Error during build')
  }

  return stats
}

export const buildAndAssert = async <T extends any>(
  t: Context & uvu.Crumbs,
  fixtureName: string,
  expected: T,
): Promise<void> => {
  await buildFixture(fixtureName)
  const manifest = await getManifest(fixtureName)
  expect(manifest).toEqual(expected)
}
