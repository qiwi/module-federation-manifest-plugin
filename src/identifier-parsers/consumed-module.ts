import { IdentifierParser } from './interface'

export interface ParsedConsumedModule {
  name: string
  version: string
  singleton: boolean
  shareScope: string
  eager: boolean
  strictVersion: boolean
}

class ConsumedModuleParser implements IdentifierParser<ParsedConsumedModule> {
  canActive(identifier: string): boolean {
    return identifier.startsWith('consume-shared-module|')
  }

  parse(identifier: string): ParsedConsumedModule {
    const [_, shareScope, shareKey, version, strictVersion, _importResolved, singleton, eager] = identifier.split('|')
    return {
      name: shareKey,
      version: version,
      singleton: singleton === 'true',
      shareScope: shareScope,
      eager: eager === 'true',
      strictVersion: strictVersion === 'true',
    }
  }
}

export const consumedModuleParser = new ConsumedModuleParser()
