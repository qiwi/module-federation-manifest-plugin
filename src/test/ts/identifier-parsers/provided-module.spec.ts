import { test } from 'uvu'
import { ParsedProvidedModule, providedModuleParser } from '../../../main/ts/identifier-parsers'
import { expect } from 'earljs'

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
    expect(providedModuleParser.canActive(identifier)).toEqual(true)
  })
})

test('canActive() should return false for incorrect identifiers', (t) => {
  const cases = ['provide moduletest', 'provide module smth-here']

  cases.forEach((identifier) => {
    expect(providedModuleParser.canActive(identifier)).toEqual(false)
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
    expect(providedModuleParser.parse(identifier)).toEqual(expected)
  })
})

test.run()
