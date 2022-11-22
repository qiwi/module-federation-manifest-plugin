import test from 'ava'
import { ParsedRemoteModule, remoteModuleParser } from '../../src/identifier-parsers'

test('canAcitve() should return true for correct identifiers', (t) => {
  const cases = [
    'remote (default) webpack/container/reference/remote1 ./app',
    'remote (scope) webpack/container/reference/remote2 ./helpers',
    'remote ( ) webpack/container/reference/remote2 ./helpers',
  ]

  cases.forEach((id) => t.is(remoteModuleParser.canActive(id), true, `Expected true for ${id}`))
})

test('canAcitve() should return false for invalid identifiers', (t) => {
  const cases = ['remote webpack/container/reference/remote1 ./app', 'remote ( ) webpack/reference/remote2 ./helpers']

  cases.forEach((id) => t.is(remoteModuleParser.canActive(id), true, `Expected true for ${id}`))
})

test('parse() should return correct parsed value', (t) => {
  const cases: [identifier: string, expectedValue: ParsedRemoteModule][] = [
    [
      'remote (default) webpack/container/reference/remote1 ./app',
      { moduleName: 'app', shareScope: 'default', remoteName: 'remote1' },
    ],
    [
      'remote (scope) webpack/container/reference/remote2 ./helpers',
      { moduleName: 'helpers', shareScope: 'scope', remoteName: 'remote2' },
    ],
    [
      'remote ( ) webpack/container/reference/remote2 ./helpers',
      { moduleName: 'helpers', shareScope: ' ', remoteName: 'remote2' },
    ],
    [
      'remote (default) webpack/container/reference/remote2 ./helpers/my app',
      { moduleName: 'helpers/my app', shareScope: 'default', remoteName: 'remote2' },
    ],
  ]

  cases.forEach(([identifier, expected]) => {
    t.deepEqual(remoteModuleParser.parse(identifier), expected, `Incorrect result for ${identifier}`)
  })
})
