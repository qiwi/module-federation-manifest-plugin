import test from 'ava'
import { consumedModuleParser, ParsedConsumedModule } from '../../src/identifier-parsers'

test('canActive() should return true for correct identifiers', (t) => {
  const cases = [
    'consume-shared-module|default|react|=1.0.1|true|/usr/app/example/test/app.js',
    'consume-shared-module|default|react|^1.0.0|false|/usr/app/example/test/app.js',
    'consume-shared-module|custom|react|*1.0.0|true|/usr/app/example/test/app.js',
    'consume-shared-module|custom|react|*1.0.0|true|/',
  ]

  cases.forEach((identifier) => {
    t.is(consumedModuleParser.canActive(identifier), true, `Expected true for ${identifier}`)
  })
})

test('canActive() should return false for incorrect identifiers', (t) => {
  const cases = [
    'provide-shared-module|custom|react|*1.0.0|true|/usr/app/example/test/app.js',
    'consume-shared-module-trash|custom|react|*1.0.0|true|/usr/app/example/test/app.js',
  ]

  cases.forEach((identifier) => {
    t.is(consumedModuleParser.canActive(identifier), false, `Expected false for ${identifier}`)
  })
})

test('parse() should return correct parsed value', (t) => {
  const cases: [identifier: string, expectedValue: ParsedConsumedModule][] = [
    [
      'consume-shared-module|default|react|=1.0.1|false|/usr/app/example/test/app.js|true|false',
      { name: 'react', shareScope: 'default', version: '=1.0.1', singleton: true, strictVersion: false, eager: false },
    ],
    [
      'consume-shared-module|default|react|^1.0.0|true|/usr/app/example/test/app.js|false|true',
      { name: 'react', shareScope: 'default', version: '^1.0.0', singleton: false, strictVersion: true, eager: true },
    ],
    [
      'consume-shared-module|custom|react|*1.0.0|true|/usr/app/example/test/app.js|true|false',
      { name: 'react', shareScope: 'custom', version: '*1.0.0', singleton: true, strictVersion: true, eager: false },
    ],
    [
      'consume-shared-module|custom|react|*1.0.0|false|/|true|false',
      { name: 'react', shareScope: 'custom', version: '*1.0.0', singleton: true, strictVersion: false, eager: false },
    ],
  ]

  cases.forEach(([identifier, expected]) => {
    t.deepEqual(consumedModuleParser.parse(identifier), expected, `Incorrect result for ${identifier}`)
  })
})
