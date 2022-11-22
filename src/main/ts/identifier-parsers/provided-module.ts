import { IdentifierParser } from './interface'

export interface ParsedProvidedModule {
  name: string
  version: string
  shareScope: string
}

class ProvidedModuleParser implements IdentifierParser<ParsedProvidedModule> {
  private readonly PROVIDED_MODULE_IDENTIFIER_REGEX = /provide module \((.*)?\) (.*)@(.*) =/

  canActive(identifier: string): boolean {
    return identifier.startsWith('provide module (')
  }

  parse(identifier: string): ParsedProvidedModule {
    const [, shareScope, name, version] = Array.from(identifier.match(this.PROVIDED_MODULE_IDENTIFIER_REGEX) || [])

    return {
      name,
      version,
      shareScope,
    }
  }
}

export const providedModuleParser = new ProvidedModuleParser()
