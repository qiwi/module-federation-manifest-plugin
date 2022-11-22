import { test } from 'uvu'
import { expect } from 'earljs'
import { consumedModuleParser, ParsedConsumedModule } from '../../../main/ts/identifier-parsers'

test('canActive() should return true for correct identifiers', (t) => {
  const cases = [
    'consume-shared-module|default|react|=1.0.1|true|/usr/app/example/test/app.js',
    'consume-shared-module|default|react|^1.0.0|false|/usr/app/example/test/app.js',
    'consume-shared-module|custom|react|*1.0.0|true|/usr/app/example/test/app.js',
    'consume-shared-module|custom|react|*1.0.0|true|/',
  ]

  cases.forEach((identifier) => {
    expect(consumedModuleParser.canActive(identifier)).toEqual(true)
  })
})

test('canActive() should return false for incorrect identifiers', (t) => {
  const cases = [
    'provide-shared-module|custom|react|*1.0.0|true|/usr/app/example/test/app.js',
    'consume-shared-module-trash|custom|react|*1.0.0|true|/usr/app/example/test/app.js',
  ]

  cases.forEach((identifier) => {
    expect(consumedModuleParser.canActive(identifier)).toEqual(false)
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
    expect(consumedModuleParser.parse(identifier)).toEqual(expected)
  })
})

test.run()
