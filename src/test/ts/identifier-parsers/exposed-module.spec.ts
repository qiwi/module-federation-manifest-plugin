import { test } from 'uvu'
import { exposedModuleParser, ParsedExposedModule } from '../../../main/ts/identifier-parsers'
import { expect } from 'earljs'

test('canAcitve() should return true for correct identifiers', (t) => {
  const cases = [
    'container entry (test) [["a",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/a.js"],"name":"custom-name"}],["b",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/b.js"]}],["c2",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/c.js"]}]]',
    'container entry (default) [["a",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/a.js"],"name":"custom-name"}],["b",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/b.js"]}],["c2",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/c.js"]}]]',
  ]

  cases.forEach((id) => expect(exposedModuleParser.canActive(id)).toEqual(true))
})

test('parse() should return correct parsed value', (t) => {
  const cases: [identifier: string, expectedValue: ParsedExposedModule[]][] = [
    [
      'container entry (test) [["a",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/a.js"],"name":"custom-name"}],["b",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/b.js"]}],["c2",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/c.js"]}]]',
      [
        { request: 'a', name: 'custom-name' },
        { request: 'b', name: undefined },
        { request: 'c2', name: undefined },
      ],
    ],
  ]

  cases.forEach(([identifier, expected]) => {
    expect(exposedModuleParser.parse(identifier)).toEqual(expected)
  })
})

test.run()
