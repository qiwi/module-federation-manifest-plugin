import test from 'ava'
import { ParsedProvidedModule, providedModuleParser } from '../../src/identifier-parsers'

test('canActive() should return true for correct identifiers', (t) => {
  const cases = [
    'provide module (default) react@1.0.0 = /node_modules/react/index.js',
    'provide module (default) react@1.0.0 = /node_modules/ui-kit/node_modules/react/index.js',
    'provide module (default) react@1.0.0 = /node_modules/react/index.js',
    'provide module (default) react@1.2.0 = /node_modules/ui-kit/node_modules/react/index.js',
    'provide module (custom) react@1.2.0 = /node_modules/ui-kit/node_modules/react/index.js',
    'provide module (any) react@1.2.0 = /node_modules/ui-kit/node_modules/react/index.js',
    'provide module ( ) react@1.2.0 = /node_modules/ui-kit/node_modules/react/index.js',
  ]

  cases.forEach((identifier) => {
    t.is(providedModuleParser.canActive(identifier), true, `Expected true for ${identifier}`)
  })
})

test('canActive() should return false for incorrect identifiers', (t) => {
  const cases = ['provide moduletest', 'provide module smth-here']

  cases.forEach((identifier) => {
    t.is(providedModuleParser.canActive(identifier), false, `Expected false for ${identifier}`)
  })
})

test('parse() should return correct result', (t) => {
  const cases: [identifier: string, expectedValue: ParsedProvidedModule][] = [
    [
      'provide module (default) react@1.0.0 = /node_modules/react/index.js',
      { name: 'react', shareScope: 'default', version: '1.0.0' },
    ],
    [
      'provide module (default) @react/react@1.0.0 = /node_modules/react/index.js',
      { name: '@react/react', shareScope: 'default', version: '1.0.0' },
    ],
    [
      'provide module (default) react@1.0.0 = /node_modules/ui-kit/node_modules/react/index.js',
      { name: 'react', shareScope: 'default', version: '1.0.0' },
    ],
    [
      'provide module (custom) react@1.2.0 = /node_modules/ui-kit/node_modules/react/index.js',
      {
        name: 'react',
        version: '1.2.0',
        shareScope: 'custom',
      },
    ],
    [
      'provide module (any) react@1.2.0 = /node_modules/ui-kit/node_modules/react/index.js',
      {
        name: 'react',
        version: '1.2.0',
        shareScope: 'any',
      },
    ],
    [
      'provide module ( ) react@1.2.0 = /node_modules/ui-kit/node_modules/react/index.js',
      {
        name: 'react',
        version: '1.2.0',
        shareScope: ' ',
      },
    ],
  ]

  cases.forEach(([identifier, expected]) => {
    t.deepEqual(providedModuleParser.parse(identifier), expected, `Incorrect result for ${identifier}`)
  })
})
