import test from 'ava'
import { exposedModuleParser, ParsedExposedModule } from '../../src/identifier-parsers'

test('canAcitve() should return true for correct identifiers', (t) => {
  const cases = [
    'container entry (test) [["a",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/a.js"],"name":"custom-name"}],["b",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/b.js"]}],["c2",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/c.js"]}]]',
    'container entry (default) [["a",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/a.js"],"name":"custom-name"}],["b",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/b.js"]}],["c2",{"import":["/webpack-module-federation-manifest-plugin/test/fixtures/remotes-and-exposed-kitchensink/c.js"]}]]',
  ]

  cases.forEach((id) => t.is(exposedModuleParser.canActive(id), true, `Expected true for ${id}`))
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
    t.deepEqual(exposedModuleParser.parse(identifier), expected, `Incorrect result for ${identifier}`)
  })
})
